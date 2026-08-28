import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const roles = user?.roles || [];
    const isAdmin = roles.includes('admin');
    const isStaff = roles.includes('staff');
    const isCustomer = roles.includes('customer') || (!isAdmin && !isStaff);

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const roleBadgeLabel = isAdmin ? 'Admin' : isStaff ? 'Staff' : 'Customer';
    const roleBadgeColor = isAdmin
        ? 'bg-rose-100 text-rose-800 border-rose-200'
        : isStaff
        ? 'bg-amber-100 text-amber-800 border-amber-200'
        : 'bg-emerald-100 text-emerald-800 border-emerald-200';

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 antialiased flex flex-col justify-between selection:bg-emerald-600 selection:text-white">
            <div>
                {/* ─── NAVBAR ─────────────────────────────────────────────── */}
                <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between items-center">
                            {/* Brand Logo & Main Nav */}
                            <div className="flex items-center gap-8">
                                <Link href="/" className="flex items-center gap-3 group">
                                    <ApplicationLogo className="h-10 w-auto object-contain rounded-lg shadow-xs group-hover:scale-105 transition duration-200" />
                                </Link>

                                <div className="hidden md:flex items-center space-x-1 sm:-my-px sm:ms-4">
                                    <NavLink
                                        href={route('dashboard')}
                                        active={route().current('dashboard')}
                                    >
                                        Dashboard
                                    </NavLink>

                                    {/* Link untuk Customer */}
                                    {isCustomer && (
                                        <>
                                            <NavLink
                                                href={route('schedules.search')}
                                                active={route().current('schedules.*')}
                                            >
                                                Cari Jadwal
                                            </NavLink>
                                            <NavLink
                                                href={route('bookings.index')}
                                                active={route().current('bookings.*') || route().current('tickets.*')}
                                            >
                                                Pesanan Saya
                                            </NavLink>
                                        </>
                                    )}

                                    {/* Link untuk Staff & Admin */}
                                    {(isStaff || isAdmin) && (
                                        <NavLink
                                            href={route('staff.payments.index')}
                                            active={route().current('staff.payments.*')}
                                        >
                                            Verifikasi Pembayaran
                                        </NavLink>
                                    )}

                                    {/* Link Khusus Admin */}
                                    {isAdmin && (
                                        <>
                                            <NavLink
                                                href={route('admin.schedules.index')}
                                                active={route().current('admin.schedules.*')}
                                            >
                                                Jadwal Kereta
                                            </NavLink>
                                            <NavLink
                                                href={route('admin.stations.index')}
                                                active={route().current('admin.stations.*')}
                                            >
                                                Stasiun
                                            </NavLink>
                                            <NavLink
                                                href={route('admin.trains.index')}
                                                active={route().current('admin.trains.*') || route().current('admin.coaches.*') || route().current('admin.seats.*')}
                                            >
                                                Armada
                                            </NavLink>
                                            <NavLink
                                                href={route('admin.users.index')}
                                                active={route().current('admin.users.*')}
                                            >
                                                Pengguna
                                            </NavLink>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* User Profile Dropdown */}
                            <div className="hidden sm:flex sm:items-center sm:gap-3">
                                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${roleBadgeColor}`}>
                                    {roleBadgeLabel}
                                </span>

                                <div className="relative">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <button
                                                type="button"
                                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition focus:outline-none shadow-xs"
                                            >
                                                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold uppercase">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <span>{user.name}</span>
                                                <svg
                                                    className="h-4 w-4 text-slate-400"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <div className="px-4 py-2 border-b border-slate-100 text-xs text-slate-500">
                                                Login sebagai <strong className="text-slate-800 font-bold">{user.email}</strong>
                                            </div>
                                            <Dropdown.Link href={route('profile.edit')}>
                                                Pengaturan Profil
                                            </Dropdown.Link>
                                            <Dropdown.Link href={route('home')}>
                                                Halaman Utama
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                                className="text-rose-600 font-semibold"
                                            >
                                                Keluar (Log Out)
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>

                            {/* Mobile Hamburger Button */}
                            <div className="-me-2 flex items-center sm:hidden">
                                <button
                                    onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                    className="inline-flex items-center justify-center rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none transition"
                                >
                                    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                        <path
                                            className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                        <path
                                            className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Navigation Menu */}
                    <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden border-t border-slate-100 bg-white'}>
                        <div className="space-y-1 pb-3 pt-2">
                            <ResponsiveNavLink
                                href={route('dashboard')}
                                active={route().current('dashboard')}
                            >
                                Dashboard
                            </ResponsiveNavLink>

                            {isCustomer && (
                                <>
                                    <ResponsiveNavLink
                                        href={route('schedules.search')}
                                        active={route().current('schedules.*')}
                                    >
                                        Cari Jadwal
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        href={route('bookings.index')}
                                        active={route().current('bookings.*')}
                                    >
                                        Pesanan Saya
                                    </ResponsiveNavLink>
                                </>
                            )}

                            {(isStaff || isAdmin) && (
                                <ResponsiveNavLink
                                    href={route('staff.payments.index')}
                                    active={route().current('staff.payments.*')}
                                >
                                    Verifikasi Pembayaran
                                </ResponsiveNavLink>
                            )}

                            {isAdmin && (
                                <>
                                    <ResponsiveNavLink
                                        href={route('admin.schedules.index')}
                                        active={route().current('admin.schedules.*')}
                                    >
                                        Jadwal Kereta
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        href={route('admin.stations.index')}
                                        active={route().current('admin.stations.*')}
                                    >
                                        Stasiun
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        href={route('admin.trains.index')}
                                        active={route().current('admin.trains.*')}
                                    >
                                        Armada Kereta
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        href={route('admin.users.index')}
                                        active={route().current('admin.users.*')}
                                    >
                                        Pengguna
                                    </ResponsiveNavLink>
                                </>
                            )}
                        </div>

                        <div className="border-t border-slate-100 pb-3 pt-3 bg-slate-50/50">
                            <div className="px-4 flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-bold text-slate-800">{user.name}</div>
                                    <div className="text-xs text-slate-500">{user.email}</div>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${roleBadgeColor}`}>
                                    {roleBadgeLabel}
                                </span>
                            </div>

                            <div className="mt-3 space-y-1">
                                <ResponsiveNavLink href={route('profile.edit')}>
                                    Pengaturan Profil
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('home')}>
                                    Halaman Utama
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    method="post"
                                    href={route('logout')}
                                    as="button"
                                    className="text-rose-600 font-semibold"
                                >
                                    Keluar (Log Out)
                                </ResponsiveNavLink>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Optional Page Header */}
                {header && (
                    <header className="bg-white border-b border-slate-200/80 shadow-2xs">
                        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                {/* Main Content */}
                <main className="py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
                <p>&copy; {new Date().getFullYear()} GoRail. Hak Cipta Dilindungi. Sistem Reservasi Tiket Kereta Api Modern.</p>
            </footer>
        </div>
    );
}

