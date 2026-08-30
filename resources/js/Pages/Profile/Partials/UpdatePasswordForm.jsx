import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

function PasswordInput({ id, value, onChange, autoComplete, placeholder, refProp }) {
    const [show, setShow] = useState(false);
    return (
        <div className="relative">
            <input
                id={id}
                ref={refProp}
                type={show ? 'text' : 'password'}
                value={value}
                onChange={onChange}
                autoComplete={autoComplete}
                placeholder={placeholder}
                className="w-full px-4 py-2.5 pr-11 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 focus:bg-white transition"
            />
            <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400 hover:text-slate-700 transition"
                tabIndex={-1}
            >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
        </div>
    );
}

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // Validasi Password Real-Time
    const validasiPanjang = data.password.length >= 8;
    const validasiHurufKecil = /[a-z]/.test(data.password);
    const validasiHurufBesar = /[A-Z]/.test(data.password);
    const validasiSimbol = /[!@#$%]/.test(data.password);
    const passwordSemuaValid = validasiPanjang && validasiHurufKecil && validasiHurufBesar && validasiSimbol;

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }
                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <form onSubmit={updatePassword} className="space-y-5">
                {/* Kata Sandi Saat Ini */}
                <div>
                    <label htmlFor="current_password" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                        Kata Sandi Saat Ini
                    </label>
                    <PasswordInput
                        id="current_password"
                        refProp={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        autoComplete="current-password"
                        placeholder="••••••••"
                    />
                    <InputError message={errors.current_password} className="mt-1.5" />
                </div>

                {/* Kata Sandi Baru */}
                <div>
                    <label htmlFor="password" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                        Kata Sandi Baru
                    </label>
                    <PasswordInput
                        id="password"
                        refProp={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        autoComplete="new-password"
                        placeholder="Minimal 8 karakter"
                    />

                    {/* Syarat Kata Sandi (Live Indicator Checklist) */}
                    <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                        <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                            Syarat Kata Sandi Baru:
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 text-xs">
                            {/* Minimal 8 Karakter */}
                            <div className={`flex items-center gap-1.5 transition ${validasiPanjang ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                                {validasiPanjang ? (
                                    <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 ml-1 mr-1 shrink-0"></span>
                                )}
                                <span>Minimal 8 Karakter</span>
                            </div>

                            {/* Huruf Kecil */}
                            <div className={`flex items-center gap-1.5 transition ${validasiHurufKecil ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                                {validasiHurufKecil ? (
                                    <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 ml-1 mr-1 shrink-0"></span>
                                )}
                                <span>Huruf Kecil (a-z)</span>
                            </div>

                            {/* Huruf Besar */}
                            <div className={`flex items-center gap-1.5 transition ${validasiHurufBesar ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                                {validasiHurufBesar ? (
                                    <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 ml-1 mr-1 shrink-0"></span>
                                )}
                                <span>Huruf Besar (A-Z)</span>
                            </div>

                            {/* Simbol */}
                            <div className={`flex items-center gap-1.5 transition ${validasiSimbol ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                                {validasiSimbol ? (
                                    <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 ml-1 mr-1 shrink-0"></span>
                                )}
                                <span>Simbol (!@#$%)</span>
                            </div>
                        </div>
                    </div>

                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                {/* Konfirmasi Kata Sandi */}
                <div>
                    <label htmlFor="password_confirmation" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                        Konfirmasi Kata Sandi Baru
                    </label>
                    <PasswordInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        autoComplete="new-password"
                        placeholder="••••••••"
                    />
                    <InputError message={errors.password_confirmation} className="mt-1.5" />
                </div>

                {/* Tombol Simpan */}
                <div className="flex items-center gap-4 pt-1">
                    <button
                        type="submit"
                        disabled={processing || (!passwordSemuaValid && data.password.length > 0)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold shadow-sm shadow-sky-600/20 active:scale-95 transition"
                    >
                        {processing ? 'Menyimpan...' : 'Ubah Kata Sandi'}
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0 translate-y-1"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0"
                    >
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                            Kata sandi berhasil diperbarui!
                        </span>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
