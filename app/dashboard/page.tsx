// components/UsersCrud.tsx
"use client";
import { Member, membersThunks } from '@/hooks/reducers/members';
import { AppDispatch, RootState } from '@/hooks/store';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Save, X, Edit2, Trash2, Loader2, UserCog } from "lucide-react";

const UsersCrud: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items, loading, error } = useSelector((state: RootState) => state.members);
    const [editingUser, setEditingUser] = useState<Member | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<Member | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'member' as const,
        isActive: true
    });

    useEffect(() => {
        dispatch(membersThunks.fetchAll());
    }, [dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            // Implementar update
        } else {
            await dispatch(membersThunks.createItem(formData));
        }
        resetForm();
    };

    const resetForm = () => {
        setEditingUser(null);
        setFormData({
            name: '',
            email: '',
            role: 'member',
            isActive: true
        });
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <UserCog className="w-7 h-7 text-blue-600" /> Gestión de Usuarios
            </h1>

            {/* FORM */}
            <form
                onSubmit={handleSubmit}
                className="mb-8 bg-white p-6 rounded-xl shadow-md border space-y-4"
            >
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">Nombre</label>
                        <input
                            type="text"
                            placeholder="Ej. Juan Pérez"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="correo@ejemplo.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">Rol</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                            className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="member">Miembro</option>
                            <option value="trainer">Entrenador</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>
                    <label className="flex items-center mt-6">
                        <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="mr-2"
                        />
                        Usuario activo
                    </label>
                </div>
                <div className="flex gap-3">
                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
                    >
                        {editingUser ? <Save size={18} /> : <Plus size={18} />}
                        {editingUser ? 'Actualizar Usuario' : 'Crear Usuario'}
                    </button>
                    {editingUser && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow"
                        >
                            <X size={18} /> Cancelar
                        </button>
                    )}
                </div>
            </form>

            {/* LOADING / ERROR */}
            {loading && (
                <div className="flex justify-center items-center py-10 text-gray-600">
                    <Loader2 className="animate-spin mr-2" /> Cargando usuarios...
                </div>
            )}
            {error && (
                <div className="text-red-600 font-medium">Error: {error}</div>
            )}

            {/* TABLE */}
            {!loading && items.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    No hay usuarios registrados.
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700 text-left">
                                <th className="p-3">Nombre</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Rol</th>
                                <th className="p-3">Estado</th>
                                <th className="p-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-t hover:bg-gray-50 transition-colors"
                                >
                                    <td className="p-3">{user.name}</td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                                            ${user.role === "admin" ? "bg-purple-100 text-purple-700" :
                                                user.role === "trainer" ? "bg-blue-100 text-blue-700" :
                                                    "bg-gray-100 text-gray-700"}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${user.isActive
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                                }`}
                                        >
                                            {user.isActive ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="p-3 text-center space-x-2">
                                        <button
                                            onClick={() => {
                                                setEditingUser(user);
                                                setFormData({
                                                    name: user.name,
                                                    email: user.email,
                                                    role: "member",
                                                    isActive: user.isActive
                                                });
                                            }}
                                            className="inline-flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg"
                                        >
                                            <Edit2 size={16} /> Editar
                                        </button>
                                        <button
                                            onClick={() => setConfirmDelete(user)}
                                            className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                                        >
                                            <Trash2 size={16} /> Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* CONFIRM DELETE */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80 space-y-4">
                        <h2 className="text-lg font-bold text-gray-800">Confirmar eliminación</h2>
                        <p>¿Seguro que deseas eliminar a <b>{confirmDelete.name}</b>?</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    // implementar delete
                                    setConfirmDelete(null);
                                }}
                                className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersCrud;
