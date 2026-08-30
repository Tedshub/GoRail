import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Settings, Lock, Trash2, User } from 'lucide-react';

export default function Edit({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;

    return (
        <AuthenticatedLayout>
            <Head title="Pengaturan Profil" />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* ─── Page Header ─── */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <Settings className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-900">Pengaturan Profil</h1>
                        <p className="text-xs text-slate-500">Kelola informasi akun dan keamanan akun Anda</p>
                    </div>
                </div>

                {/* ─── Card: Info Profil ─── */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <User className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900">Informasi Profil</h2>
                            <p className="text-[11px] text-slate-500">Perbarui nama dan alamat email akun Anda</p>
                        </div>
                    </div>
                    <div className="p-6">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </div>
                </div>

                {/* ─── Card: Ganti Password ─── */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                            <Lock className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900">Ubah Kata Sandi</h2>
                            <p className="text-[11px] text-slate-500">Gunakan kata sandi yang panjang dan acak agar akun tetap aman</p>
                        </div>
                    </div>
                    <div className="p-6">
                        <UpdatePasswordForm />
                    </div>
                </div>

                {/* ─── Card: Hapus Akun ─── */}
                <div className="bg-white rounded-2xl border border-rose-200/80 shadow-xs overflow-hidden">
                    <div className="px-6 py-4 border-b border-rose-100 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                            <Trash2 className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-rose-700">Hapus Akun</h2>
                            <p className="text-[11px] text-rose-500">Tindakan ini permanen dan tidak dapat dibatalkan</p>
                        </div>
                    </div>
                    <div className="p-6">
                        <DeleteUserForm />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
