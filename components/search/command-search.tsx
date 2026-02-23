'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import {
    Search, X, ArrowRight,
    Scissors, Ruler, Shirt, Sparkles,
} from 'lucide-react';
import { spotlightSearch, SpotlightResult, SpotlightProduct } from '@/actions/search';

// ─── Íconos y colores para servicios ─────────────────────────────────────────
const SERVICE_STYLES = [
    { icon: Scissors, bg: 'bg-blue-100', text: 'text-blue-600' },
    { icon: Ruler, bg: 'bg-green-100', text: 'text-green-600' },
    { icon: Shirt, bg: 'bg-orange-100', text: 'text-orange-500' },
    { icon: Sparkles, bg: 'bg-purple-100', text: 'text-purple-600' },
];

// ─── Helpers de stock ─────────────────────────────────────────────────────────
function getStockLabel(stock: number) {
    if (stock === 0) return { label: 'Out of Stock', cls: 'text-red-500' };
    if (stock < 5) return { label: 'Low Stock', cls: 'text-amber-500' };
    return { label: 'In Stock', cls: 'text-green-600' };
}

// ─── Componente principal ─────────────────────────────────────────────────────
export function CommandSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SpotlightResult>({ products: [], services: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const allItems: SpotlightProduct[] = [...results.products, ...results.services];
    const hasResults = allItems.length > 0;
    const showResults = query.trim().length >= 2;

    // ── Abrir / cerrar ────────────────────────────────────────────────────────
    const openModal = useCallback(() => {
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 60);
    }, []);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        setQuery('');
        setResults({ products: [], services: [] });
        setActiveIndex(0);
    }, []);

    // ── Atajo global Cmd+K / Ctrl+K ───────────────────────────────────────────
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                isOpen ? closeModal() : openModal();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, openModal, closeModal]);

    // ── Navegación con teclado dentro del modal ───────────────────────────────
    useEffect(() => {
        if (!isOpen) return;

        const handler = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'Escape':
                    closeModal();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    setActiveIndex(i => Math.min(i + 1, allItems.length - 1));
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setActiveIndex(i => Math.max(i - 1, 0));
                    break;
                case 'Enter':
                    if (hasResults) {
                        e.preventDefault();
                        // TODO: redirigir al detalle del producto
                        console.log('Selected:', allItems[activeIndex]?.name);
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, allItems, activeIndex, hasResults, closeModal]);

    // ── Búsqueda con debounce 300ms ───────────────────────────────────────────
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        setActiveIndex(0);

        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (value.trim().length < 2) {
            setResults({ products: [], services: [] });
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        debounceRef.current = setTimeout(async () => {
            const data = await spotlightSearch(value);
            setResults(data);
            setIsLoading(false);
        }, 300);
    };

    const clearQuery = () => {
        setQuery('');
        setResults({ products: [], services: [] });
        inputRef.current?.focus();
    };

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <>
            {/* ── Trigger: barra de búsqueda en el navbar ── */}
            <button
                onClick={openModal}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-400 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:text-gray-600 transition-all shadow-sm group min-w-[220px]"
            >
                <Search size={15} />
                <span className="flex-1 text-left">Search products...</span>
                <kbd className="text-[10px] border border-gray-200 px-1.5 py-0.5 rounded font-mono text-gray-300 group-hover:text-gray-400 transition-colors">
                    ⌘K
                </kbd>
            </button>

            {/* ── Modal ── */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                        onClick={closeModal}
                    />

                    {/* Panel */}
                    <div className="fixed top-[18%] left-1/2 -translate-x-1/2 z-50 w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">

                        {/* ── Input ── */}
                        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100">
                            <Search size={17} className="text-gray-400 shrink-0" />
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={handleChange}
                                placeholder="Search for threads, fabrics, or alteration services..."
                                className="flex-1 text-sm text-gray-700 placeholder:text-gray-400 outline-none bg-transparent"
                            />
                            <div className="flex items-center gap-2 shrink-0">
                                {query && (
                                    <button onClick={clearQuery} className="text-gray-400 hover:text-gray-600 transition-colors">
                                        <X size={14} />
                                    </button>
                                )}
                                <kbd className="text-[10px] text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded font-mono">
                                    ESC
                                </kbd>
                            </div>
                        </div>

                        {/* ── Resultados ── */}
                        {showResults && (
                            <div className="max-h-[380px] overflow-y-auto">
                                {isLoading ? (
                                    <LoadingState />
                                ) : !hasResults ? (
                                    <EmptyState query={query} />
                                ) : (
                                    <>
                                        {/* Sección PRODUCTS */}
                                        {results.products.length > 0 && (
                                            <section>
                                                <SectionHeader label="Products" />
                                                {results.products.map((product, i) => {
                                                    const { label, cls } = getStockLabel(product.stock);
                                                    const isActive = activeIndex === i;
                                                    return (
                                                        <ResultRow
                                                            key={product.id}
                                                            isActive={isActive}
                                                            onHover={() => setActiveIndex(i)}
                                                            left={
                                                                <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                                                                    {product.imageUrl
                                                                        ? <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                                                                        : <div className="h-full w-full flex items-center justify-center text-[9px] text-gray-300">IMG</div>
                                                                    }
                                                                </div>
                                                            }
                                                            title={product.name}
                                                            subtitle={<><span className={cls}>{label}</span> • Thread &amp; Notions</>}
                                                            right={
                                                                <span className="text-sm font-semibold text-indigo-600">
                                                                    S/ {product.price.toFixed(2)}
                                                                </span>
                                                            }
                                                            showEnterHint={isActive}
                                                        />
                                                    );
                                                })}
                                            </section>
                                        )}

                                        {/* Sección SERVICES */}
                                        {results.services.length > 0 && (
                                            <section>
                                                <SectionHeader label="Services" />
                                                {results.services.map((service, i) => {
                                                    const globalIdx = results.products.length + i;
                                                    const isActive = activeIndex === globalIdx;
                                                    const style = SERVICE_STYLES[i % SERVICE_STYLES.length];
                                                    const Icon = style.icon;
                                                    return (
                                                        <ResultRow
                                                            key={service.id}
                                                            isActive={isActive}
                                                            onHover={() => setActiveIndex(globalIdx)}
                                                            left={
                                                                <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${style.bg} ${style.text}`}>
                                                                    <Icon size={18} />
                                                                </div>
                                                            }
                                                            title={service.name}
                                                            subtitle={service.description ?? 'Tailoring service'}
                                                            right={
                                                                <span className="text-sm font-medium text-gray-500">
                                                                    from S/ {service.price.toFixed(2)}
                                                                </span>
                                                            }
                                                            showEnterHint={isActive}
                                                        />
                                                    );
                                                })}
                                            </section>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                        {/* ── Footer con hints de teclado ── */}
                        <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 bg-gray-50/60">
                            <div className="flex items-center gap-3">
                                <KbdHint keys={['↵']} label="to select" />
                                <KbdHint keys={['↑', '↓']} label="to navigate" />
                                <KbdHint keys={['esc']} label="to close" />
                            </div>
                            <button className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 font-medium transition-colors">
                                Advanced Search <ArrowRight size={11} />
                            </button>
                        </div>

                    </div>
                </>
            )}
        </>
    );
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function SectionHeader({ label }: { label: string }) {
    return (
        <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50/80 border-b border-gray-100/80">
            {label}
        </div>
    );
}

function ResultRow({
    isActive, onHover, left, title, subtitle, right, showEnterHint,
}: {
    isActive: boolean;
    onHover: () => void;
    left: React.ReactNode;
    title: string;
    subtitle: React.ReactNode;
    right: React.ReactNode;
    showEnterHint: boolean;
}) {
    return (
        <button
            onMouseEnter={onHover}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-l-2 ${isActive
                    ? 'bg-indigo-50/60 border-indigo-400'
                    : 'border-transparent hover:bg-gray-50'
                }`}
        >
            {left}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{title}</p>
                <p className="text-xs text-gray-400 truncate">{subtitle}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                {right}
                {showEnterHint && (
                    <kbd className="text-[10px] text-gray-400 border border-gray-200 px-1 py-0.5 rounded font-mono">
                        ↵
                    </kbd>
                )}
            </div>
        </button>
    );
}

function KbdHint({ keys, label }: { keys: string[]; label: string }) {
    return (
        <div className="flex items-center gap-1">
            {keys.map(k => (
                <kbd key={k} className="text-[10px] text-gray-500 border border-gray-200 px-1.5 py-0.5 rounded font-mono bg-white">
                    {k}
                </kbd>
            ))}
            <span className="text-[11px] text-gray-400">{label}</span>
        </div>
    );
}

function LoadingState() {
    return (
        <div className="py-10 flex flex-col items-center gap-2">
            <div className="h-5 w-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-gray-400">Searching...</span>
        </div>
    );
}

function EmptyState({ query }: { query: string }) {
    return (
        <div className="py-10 text-center">
            <p className="text-sm text-gray-500">No results for</p>
            <p className="text-sm font-medium text-gray-700 mt-0.5">&quot;{query}&quot;</p>
        </div>
    );
}
