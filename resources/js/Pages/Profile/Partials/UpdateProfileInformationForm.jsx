import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <form onSubmit={submit} className="space-y-5">
                {/* Nama */}
                <div>
                    <label htmlFor="name" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                        Nama Lengkap
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoFocus
                        autoComplete="name"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 focus:bg-white transition"
                        placeholder="Nama lengkap Anda"
                    />
                    <InputError className="mt-1.5" message={errors.name} />
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                        Alamat Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 focus:bg-white transition"
                        placeholder="email@contoh.com"
                    />
                    <InputError className="mt-1.5" message={errors.email} />
                </div>

                {/* Verifikasi email */}
                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
                        Email Anda belum terverifikasi.{' '}
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="font-bold underline hover:text-amber-900"
                        >
                            Kirim ulang email verifikasi.
                        </Link>

                        {status === 'verification-link-sent' && (
                            <p className="mt-2 font-semibold text-emerald-700">
                                Link verifikasi baru telah dikirim ke email Anda.
                            </p>
                        )}
                    </div>
                )}

                {/* Tombol Simpan */}
                <div className="flex items-center gap-4 pt-1">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs font-bold shadow-sm shadow-emerald-600/20 active:scale-95 transition"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
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
                            Tersimpan!
                        </span>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
