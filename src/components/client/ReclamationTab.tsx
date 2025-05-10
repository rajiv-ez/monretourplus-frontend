import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import axios from 'axios';
import { Badge } from '../ui/badge';
import { format } from 'date-fns';
import { AlertCircle } from 'lucide-react';

export default function ReclamationsTabs({ userId }: { userId: string }) {
    const [reclamations, setReclamations] = useState<{ id: string; objet: string; message: string; statut: string; date_creation: string; }[]>([]);

    useEffect(() => {
        axios.get(`/api/reclamations/?client_id=${userId}`)
            .then(res => setReclamations(res.data))
            .catch(err => console.error(err));
    }, [userId]);

    const getStatusBadge = (status: any) => {
        switch (status) {
            case 'résolue':
                return <Badge className="bg-green-500 text-white">Résolue</Badge>;
            case 'active':
                return <Badge className="bg-yellow-500 text-white">Active</Badge>;
            default:
                return <Badge className="bg-gray-500 text-white">Inconnue</Badge>;
        }
    };

    const renderReclamations = (filter: string) => {
        const filtered = filter === 'all'
            ? reclamations
            : reclamations.filter(r => r.statut === filter);

        return (
            <div className="grid gap-4">
                {filtered.length === 0 ? (
                    <p className="text-gray-500 italic text-sm">Aucune réclamation.</p>
                ) : (
                    filtered.map((r) => (
                        <div key={r.id} className="bg-white p-4 rounded-xl shadow-md border">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-lg font-semibold">{r.objet}</h4>
                                {getStatusBadge(r.statut)}
                            </div>
                            <p className="text-sm text-gray-600">{r.message}</p>
                            <p className="text-xs text-right text-gray-400 mt-2">
                                Envoyée le {format(new Date(r.date_creation), 'dd/MM/yyyy à HH:mm')}
                            </p>
                        </div>
                    ))
                )}
            </div>
        );
    };

    return (
        <div className="mt-6">
            <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-4 bg-gray-100 rounded-xl">
                    <TabsTrigger value="all">Toutes</TabsTrigger>
                    <TabsTrigger value="active">Actives</TabsTrigger>
                    <TabsTrigger value="résolue">Résolues</TabsTrigger>
                </TabsList>

                <TabsContent value="all">{renderReclamations('all')}</TabsContent>
                <TabsContent value="active">{renderReclamations('active')}</TabsContent>
                <TabsContent value="résolue">{renderReclamations('résolue')}</TabsContent>
            </Tabs>
        </div>
    );
}
