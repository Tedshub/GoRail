<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Tampilkan daftar user.
     */
    public function index()
    {
        $daftarUser = User::with('roles')->latest()->paginate(10);
        $daftarRole = Role::pluck('name');

        return Inertia::render('Admin/Users/Index', [
            'users' => UserResource::collection($daftarUser),
            'roles' => $daftarRole,
        ]);
    }

    /**
     * Simpan user baru beserta role.
     */
    public function store(StoreUserRequest $request)
    {
        $dataValid = $request->validated();

        $userBaru = User::create([
            'name' => $dataValid['name'],
            'email' => $dataValid['email'],
            'password' => Hash::make($dataValid['password']),
        ]);

        $userBaru->assignRole($dataValid['role']);

        return back()->with('sukses', 'Pengguna berhasil ditambahkan.');
    }

    /**
     * Update data user dan role.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $dataValid = $request->validated();

        $dataUpdate = [
            'name' => $dataValid['name'],
            'email' => $dataValid['email'],
        ];

        if (! empty($dataValid['password'])) {
            $dataUpdate['password'] = Hash::make($dataValid['password']);
        }

        $user->update($dataUpdate);
        $user->syncRoles([$dataValid['role']]);

        return back()->with('sukses', 'Pengguna berhasil diperbarui.');
    }

    /**
     * Hapus user.
     */
    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->withErrors(['error' => 'Tidak dapat menghapus akun sendiri.']);
        }

        $user->delete();

        return back()->with('sukses', 'Pengguna berhasil dihapus.');
    }
}
