import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        setShowPassword(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-5 ${className}`}>
            <div className="rounded-xl bg-rose-50/70 border border-rose-200/80 px-4 py-3 text-sm text-rose-800 leading-relaxed">
                Setelah akun dihapus, semua data dan informasi akan <strong>dihapus secara permanen</strong>. Pastikan Anda telah mengunduh data yang diperlukan sebelum melanjutkan.
            </div>

            <button
                onClick={confirmUserDeletion}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-sm shadow-rose-600/20 active:scale-95 transition"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Hapus Akun Saya
            </button>

            {/* Modal Konfirmasi */}
            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6 space-y-5">
                    {/* Header Modal */}
                    <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900">Yakin ingin menghapus akun?</h2>
                            <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                                Semua data Anda akan <strong className="text-rose-600">dihapus permanen</strong> dan tidak dapat dipulihkan. Masukkan kata sandi Anda untuk mengkonfirmasi.
                            </p>
                        </div>
                    </div>

                    {/* Input Kata Sandi + Toggle Visibility */}
                    <div>
                        <label htmlFor="delete_password" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                            Kata Sandi
                        </label>
                        <div className="relative">
                            <input
                                id="delete_password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                autoFocus
                                placeholder="Masukkan kata sandi Anda"
                                className="w-full px-4 py-2.5 pr-11 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 focus:bg-white transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400 hover:text-slate-700 transition"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <InputError message={errors.password} className="mt-1.5" />
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex items-center justify-end gap-3 pt-1">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 active:scale-95 transition"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-60 text-white text-xs font-bold shadow-sm shadow-rose-600/20 active:scale-95 transition"
                        >
                            {processing ? 'Menghapus...' : 'Ya, Hapus Akun Saya'}
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
