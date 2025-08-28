// components/CheckinSystem.tsx
"use client";
import { fetchActiveCheckins, registerCheckin, registerCheckout } from '@/hooks/reducers/checkins';
import { membersThunks } from '@/hooks/reducers/members';
import { AppDispatch, RootState } from '@/hooks/store';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const CheckinSystem: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { activeCheckins, loading } = useSelector((state: RootState) => state.checkins);
    const { items: members } = useSelector((state: RootState) => state.members);
    const [memberCode, setMemberCode] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchActiveCheckins());
        dispatch(membersThunks.fetchAll());
    }, [dispatch]);

    const handleCheckin = async (memberId: string, memberName: string) => {
        await dispatch(registerCheckin({ memberId, memberName }));
        setMemberCode('');
    };

    const handleCheckout = async (memberId: string) => {
        await dispatch(registerCheckout(memberId));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const member = members.find(m => m.id === memberCode || m.email === memberCode);
        if (member) {
            handleCheckin(member.id, member.name);
        } else {
            alert('Miembro no encontrado');
        }
    };

    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Sistema de Entradas y Salidas</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Panel de registro rápido */}
                <div className="bg-gray-50 p-4 rounded">
                    <h3 className="text-lg font-semibold mb-4">Registro Rápido</h3>
                    <form onSubmit={handleSubmit} className="mb-4">
                        <div className="flex">
                            <input
                                type="text"
                                value={memberCode}
                                onChange={(e) => setMemberCode(e.target.value)}
                                placeholder="ID o email del miembro"
                                className="flex-grow p-2 border border-gray-200 rounded-l"
                                required
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-500 text-white px-4 py-2 rounded-r disabled:bg-blue-300"
                            >
                                {loading ? 'Procesando...' : 'Entrada'}
                            </button>
                        </div>
                    </form>

                    <div className="mb-6">
                        <h4 className="font-medium mb-2">Check-ins Activos: {activeCheckins.length}</h4>
                        <div className="max-h-60 overflow-y-auto">
                            {activeCheckins.map(checkin => (
                                <div key={checkin.id} className="flex justify-between items-center p-2 border-b">
                                    <div>
                                        <p className="font-medium">{checkin.memberName}</p>
                                        <p className="text-sm text-gray-500">
                                            Entrada: {checkin.checkInTime.toLocaleTimeString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleCheckout(checkin.memberId)}
                                        disabled={loading}
                                        className="bg-red-500 text-white px-3 py-1 rounded text-sm disabled:bg-red-300"
                                    >
                                        Salida
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Panel de búsqueda de miembros */}
                <div className="bg-gray-50 p-4 rounded">
                    <h3 className="text-lg font-semibold mb-4">Buscar Miembros</h3>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por nombre o email"
                        className="w-full p-2 border border-gray-200 rounded mb-4"
                    />

                    <div className="max-h-96 overflow-y-auto">
                        {filteredMembers.map(member => (
                            <div key={member.id} className="flex justify-between items-center p-3 border-b border-gray-200">
                                <div>
                                    <p className="font-medium">{member.name}</p>
                                    <p className="text-sm text-gray-500">{member.email}</p>
                                    <span className={`text-xs px-2 py-1 rounded ${member.isActive
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {member.isActive ? 'Activo' : 'Inactivo'}
                                    </span>
                                </div>
                                {member.isActive && (
                                    <button
                                        onClick={() => handleCheckin(member.id, member.name)}
                                        disabled={loading || activeCheckins.some(c => c.memberId === member.id)}
                                        className="bg-green-500 text-white px-3 py-1 rounded text-sm disabled:bg-gray-300"
                                    >
                                        {activeCheckins.some(c => c.memberId === member.id) ? 'Dentro' : 'Entrada'}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckinSystem;