import Link from "next/link";
import Image from "next/image"; // 👈 Importamos Image
import { LayoutDashboard, ShoppingBag, Package, Settings, Users, Scissors } from "lucide-react";

export function AdminSidebar() {
    return (
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-10">
            <div className="h-16 flex items-center px-6 border-b border-gray-100">
                <Link href="/admin" className="flex items-center gap-2 group cursor-pointer w-full">
                    {/* 👇 LOGO ACTUALIZADO */}
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
                    <NavItem href="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" />
                    <NavItem href="#" icon={<ShoppingBag size={20} />} label="Orders" badge="12" />
                    <div className="flex items-center gap-3 px-4 py-3 bg-green-50 text-green-700 rounded-lg font-medium cursor-pointer">
                        <Package size={20} />
                        <span>Inventory</span>
                    </div>
                    <NavItem href="#" icon={<Scissors size={20} />} label="Services" />
                    <NavItem href="#" icon={<Users size={20} />} label="Customers" />
                </nav>
            </div>

            <div className="p-4 border-t border-gray-100">
                <NavItem href="#" icon={<Settings size={20} />} label="Settings" />
                <div className="mt-4 flex items-center gap-3 px-4">
                    {/* 👇 Tu Perfil actualizado */}
                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">
                        P
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-700">Peter Zegarra</p>
                        <p className="text-xs text-gray-500">Super Admin</p>
                    </div>
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