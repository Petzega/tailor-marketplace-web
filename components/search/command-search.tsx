'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import NextImage from 'next/image';
import {
    Search, X, ArrowRight,
    Scissors, Ruler, Shirt, Sparkles,
} from 'lucide-react';
import { spotlightSearch, SpotlightResult, SpotlightProduct } from '@/actions/search';

const SERVICE_STYLES = [
    { icon: Scissors, bg: 'bg-blue-100', text: 'text-blue-600' },
    { icon: Ruler, bg: 'bg-green-100', text: 'text-green-600' },
    { icon: Shirt, bg: 'bg-orange-100', text: 'text-orange-500' },
    { icon: Sparkles, bg: 'bg-purple-100', text: 'text-purple-600' },
];

function getStockLabel(stock: number) {
    if (stock === 0) return { label: 'Out of Stock', cls: 'text-red-500' };
    if (stock < 5) return { label: 'Low Stock', cls: 'text-amber-500' };
    return { label: 'In Stock', cls: 'text-green-600' };
}

export function CommandSearch() {
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SpotlightResult>({ products: [], services: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);
    const kbdRef = useRef<HTMLElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const allItems: SpotlightProduct[] = useMemo(
        () => [...results.products, ...results.services],
        [results.products, results.services]
    );
    const hasResults = allItems.length > 0;
    const showResults = query.trim().length >= 2;

    // Detectar Mac/Windows y actualizar el atajo de teclado directamente en el DOM
    useEffect(() => {
        if (kbdRef.current) {
            const isMac = navigator.userAgent.toUpperCase().indexOf('MAC') >= 0;
            kbdRef.current.textContent = `${isMac ? '⌘' : 'Ctrl'} K`;
        }
    }, []);

    // 👈 MAGIA DEFINITIVA: "Bulletproof Scroll Lock"
    useEffect(() => {
        if (!isOpen) return;

        // 1. Guardamos la posición exacta de la página antes de abrir el buscador
        const scrollY = window.scrollY;
        // 2. Calculamos el ancho de la barra de scroll (para que no salte el diseño en PC)
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

        // 3. Fijamos el fondo para que sea FÍSICAMENTE imposible hacer scroll
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.style.paddingRight = `${scrollbarWidth}px`;

        return () => {
            // 4. Al cerrar, restauramos todo a la normalidad y lo devolvemos a su posición exacta
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.paddingRight = '';
            window.scrollTo(0, scrollY);
        };
    }, [isOpen]);

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

    const handleAdvancedSearch = useCallback(() => {
        closeModal();
        router.push(`/search?q=${encodeURIComponent(query)}`);
    }, [closeModal, query, router]);

    const handleSelectResult = useCallback((item: SpotlightProduct) => {
        closeModal();
        router.push(`/search?q=${encodeURIComponent(item.name)}`);
    }, [closeModal, router]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                void (isOpen ? closeModal() : openModal());
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, openModal, closeModal]);

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
                        handleSelectResult(allItems[activeIndex]);
                    } else if (query.trim().length > 0) {
                        e.preventDefault();
                        handleAdvancedSearch();
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, allItems, activeIndex, hasResults, closeModal, handleSelectResult, handleAdvancedSearch, query]);

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

    return (
        <>
            <button
                onClick={openModal}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-400 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:text-gray-600 transition-all shadow-sm group min-w-[220px]"
            >
                <Search size={15} />
                <span className="flex-1 text-left">Search products...</span>
                <kbd
                    ref={kbdRef}
                    className="hidden sm:inline-block text-[10px] border border-gray-200 px-1.5 py-0.5 rounded font-mono text-gray-300 group-hover:text-gray-400 transition-colors"
                >
                    Ctrl K
                </kbd>
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 overscroll-none touch-none" onClick={closeModal} />

                    <div className="fixed z-50 flex flex-col bg-white overflow-hidden shadow-2xl transition-all
                                    inset-0 w-full h-[100dvh] rounded-none
                                    sm:inset-auto sm:top-[18%] sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-xl sm:h-auto sm:max-h-[70vh] sm:rounded-2xl sm:border sm:border-gray-100">

                        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 shrink-0 mt-2 sm:mt-0">
                            <Search size={17} className="text-gray-400 shrink-0" />
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={handleChange}
                                placeholder="Search products or services..."
                                className="flex-1 text-base sm:text-sm text-gray-700 placeholder:text-gray-400 outline-none bg-transparent"
                            />
                            <div className="flex items-center gap-2 shrink-0">
                                {query && (
                                    <button onClick={clearQuery} className="p-2 -mr-2 text-gray-400 hover:text-gray-600 transition-colors">
                                        <X size={16} />
                                    </button>
                                )}
                                <kbd className="hidden sm:inline-block text-[10px] text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded font-mono">
                                    ESC
                                </kbd>
                            </div>
                        </div>

                        {showResults && (
                            <div className="overflow-y-auto flex-1 overscroll-contain">
                                {isLoading ? (
                                    <LoadingState />
                                ) : !hasResults ? (
                                    <EmptyState query={query} />
                                ) : (
                                    <>
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
                                                            onClick={() => handleSelectResult(product)}
                                                            left={
                                                                <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0 relative">
                                                                    {product.imageUrl
                                                                        ? <NextImage src={product.imageUrl} alt={product.name} fill className="object-cover" />
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
                                                            onClick={() => handleSelectResult(service)}
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

                        <div className="flex items-center justify-between px-4 py-3 sm:py-2.5 border-t border-gray-100 bg-gray-50/60 shrink-0 pb-safe">
                            <div className="hidden sm:flex items-center gap-3">
                                <KbdHint keys={['↵']} label="to select" />
                                <KbdHint keys={['↑', '↓']} label="to navigate" />
                                <KbdHint keys={['esc']} label="to close" />
                            </div>

                            <button onClick={closeModal} className="sm:hidden text-sm text-gray-500 font-medium px-2">
                                Cancelar
                            </button>

                            <button
                                onClick={handleAdvancedSearch}
                                className="flex items-center gap-1 text-sm sm:text-xs text-indigo-600 hover:text-indigo-700 font-bold sm:font-medium transition-colors cursor-pointer"
                            >
                                Advanced Search <ArrowRight size={14} className="sm:w-3 sm:h-3" />
                            </button>
                        </div>

                    </div>
                </>
            )}
        </>
    );
}

function SectionHeader({ label }: { label: string }) {
    return (
        <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50/80 border-b border-gray-100/80">
            {label}
        </div>
    );
}

function ResultRow({
    isActive, onHover, onClick, left, title, subtitle, right, showEnterHint,
}: {
    isActive: boolean;
    onHover: () => void;
    onClick: () => void;
    left: React.ReactNode;
    title: string;
    subtitle: React.ReactNode;
    right: React.ReactNode;
    showEnterHint: boolean;
}) {
    return (
        <button
            onMouseEnter={onHover}
            onClick={onClick}
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
                    <kbd className="hidden sm:inline-block text-[10px] text-gray-400 border border-gray-200 px-1 py-0.5 rounded font-mono">
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