// components/AttendanceReports.tsx
"use client";
import { fetchCheckins } from '@/hooks/reducers/checkins';
import { AppDispatch, RootState } from '@/hooks/store';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface AttendanceStats {
    totalCheckins: number;
    averageDuration: number;
    peakHour: string;
    activeMembers: number;
}

const AttendanceReports: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { checkins } = useSelector((state: RootState) => state.checkins);
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });
    const [stats, setStats] = useState<AttendanceStats>({
        totalCheckins: 0,
        averageDuration: 0,
        peakHour: '',
        activeMembers: 0
    });

    useEffect(() => {
        dispatch(fetchCheckins());
    }, [dispatch]);

    useEffect(() => {
        calculateStats();
    }, [checkins, dateRange]);

    const calculateStats = () => {
        const filteredCheckins = checkins.filter(checkin => {
            const checkinDate = checkin.checkInTime.toISOString().split('T')[0];
            return checkinDate >= dateRange.start && checkinDate <= dateRange.end && checkin.duration;
        });

        // Calcular estadísticas
        const totalCheckins = filteredCheckins.length;

        const totalDuration = filteredCheckins.reduce((sum, checkin) =>
            sum + (checkin.duration || 0), 0);
        const averageDuration = totalCheckins > 0 ? Math.round(totalDuration / totalCheckins) : 0;

        // Encontrar hora pico
        const hourCounts: Record<string, number> = {};
        filteredCheckins.forEach(checkin => {
            const hour = checkin.checkInTime.getHours();
            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        });

        let peakHour = '';
        let maxCount = 0;
        Object.entries(hourCounts).forEach(([hour, count]) => {
            if (count > maxCount) {
                maxCount = count;
                peakHour = `${hour}:00`;
            }
        });

        // Miembros únicos
        const uniqueMembers = new Set(filteredCheckins.map(checkin => checkin.memberId)).size;

        setStats({
            totalCheckins,
            averageDuration,
            peakHour,
            activeMembers: uniqueMembers
        });
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Reportes de Asistencia</h2>

            {/* Filtros */}
            <div className="mb-6 flex gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Desde</label>
                    <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        className="p-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Hasta</label>
                    <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        className="p-2 border rounded"
                    />
                </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded text-center">
                    <p className="text-2xl font-bold">{stats.totalCheckins}</p>
                    <p className="text-sm">Total de visitas</p>
                </div>
                <div className="bg-green-50 p-4 rounded text-center">
                    <p className="text-2xl font-bold">{stats.averageDuration}</p>
                    <p className="text-sm">Minutos promedio</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded text-center">
                    <p className="text-2xl font-bold">{stats.peakHour}</p>
                    <p className="text-sm">Hora pico</p>
                </div>
                <div className="bg-purple-50 p-4 rounded text-center">
                    <p className="text-2xl font-bold">{stats.activeMembers}</p>
                    <p className="text-sm">Miembros activos</p>
                </div>
            </div>

            {/* Lista de check-ins */}
            <div>
                <h3 className="text-xl font-semibold mb-4">Registros recientes</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 text-left">Miembro</th>
                                <th className="py-2 px-4 text-left">Entrada</th>
                                <th className="py-2 px-4 text-left">Salida</th>
                                <th className="py-2 px-4 text-left">Duración</th>
                            </tr>
                        </thead>
                        <tbody>
                            {checkins.slice(0, 10).map((checkin) => (
                                <tr key={checkin.id} className="border-b">
                                    <td className="py-2 px-4">{checkin.memberName}</td>
                                    <td className="py-2 px-4">{checkin.checkInTime.toLocaleString()}</td>
                                    <td className="py-2 px-4">
                                        {checkin.checkOutTime ? checkin.checkOutTime.toLocaleString() : 'En curso'}
                                    </td>
                                    <td className="py-2 px-4">
                                        {checkin.duration ? `${checkin.duration} min` : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AttendanceReports;