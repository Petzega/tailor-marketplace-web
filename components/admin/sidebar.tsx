import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, ShoppingBag, Package, Settings, Users, Scissors } from "lucide-react";
import { UserButton, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";

export function AdminSidebar() {
    return (
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-10">
            <div className="h-16 flex items-center px-6 border-b border-gray-100">
                {/* 👇 CORRECCIÓN 1: Ruta actualizada al nuevo nombre de la carpeta */}
                <Link href="/ame-studio-ops" className="flex items-center gap-2 group cursor-pointer w-full">
                    <Image
                        src="/logo.png"
                        alt="Logo Admin"
                        width={100}
                        height={30}
                        className="object-contain"
                    />
                </Link>
            </div>

            <div className="p-4 space-y-1 flex-1 overflow-y-auto">
                <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-4">Main Menu</p>

                <nav className="space-y-1">
                    {/* 👇 CORRECCIÓN 1: Rutas base actualizadas */}
                    <NavItem href="/ame-studio-ops" icon={<LayoutDashboard size={20} />} label="Dashboard" />
                    <NavItem href="/ame-studio-ops/orders" icon={<ShoppingBag size={20} />} label="Orders" badge="12" />
                    <NavItem href="/ame-studio-ops/inventory" icon={<Package size={20} />} label="Inventory" />
                    <NavItem href="/ame-studio-ops/services" icon={<Scissors size={20} />} label="Services" />
                    <NavItem href="/ame-studio-ops/customers" icon={<Users size={20} />} label="Customers" />
                </nav>
            </div>

            <div className="p-4 border-t border-gray-100">
                <NavItem href="/ame-studio-ops/settings" icon={<Settings size={20} />} label="Settings" />

                {/* 👇 CORRECCIÓN 2: Eliminado el perfil falso. Usamos Clerk con el nombre visible */}
                <div className="mt-4 flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                    <ClerkLoading>
                        {/* placeholder skeleton for the button to prevent jitter */}
                        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                        <div className="w-24 h-4 rounded bg-gray-200 animate-pulse ml-2" />
                    </ClerkLoading>
                    <ClerkLoaded>
                        <UserButton
                            showName={true}
                            appearance={{
                                elements: {
                                    userButtonBox: "flex items-center gap-3",
                                    userButtonOuterIdentifier: "text-sm font-medium text-gray-700"
                                }
                            }}
                        />
                    </ClerkLoaded>
                </div>
            </div>
        </aside>
    );
}

function NavItem({ href, icon, label, badge }: { href: string; icon: React.ReactNode; label: string; badge?: string }) {
    return (
        <Link href={href} className="flex items-center justify-between px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors group">
            <div className="flex items-center gap-3">
                <span className="group-hover:text-green-600 transition-colors">{icon}</span>
                <span className="font-medium text-sm">{label}</span>
            </div>
            {badge && (
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">{badge}</span>
            )}
        </Link>
    );
}