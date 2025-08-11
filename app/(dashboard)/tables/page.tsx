'use client'

import { fetchRestaurant, getRestaurantTables } from '@/app/actions/actions'
import MinLoader from '@/components/MinLoader'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import CreateTableForm from '../_components/CreateTableForm'
import { Button } from '@/components/ui/button'
import { Edit, QrCode, Table2, Trash } from 'lucide-react'
import { Card } from '@/components/ui/card'
import EditTableForm from '../_components/EditTableForm'
import DeleteTableForm from '../_components/DeleteTable'
import { Restaurant, Table } from '@/lib/types'
import ShowTableQRCode from '../_components/ShowTableQRCode'

const Tables = () => {
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
    const [restaurantTables, setRestaurantTables] = useState<Table[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    
    useEffect(() => {
        const getExistingRestaurant = async () => {
            try {
                const restaurant = await fetchRestaurant()
                setRestaurant(restaurant)
            } catch {
                toast.error("Erreur lors de la récupération du restaurant")
            }
        }
        getExistingRestaurant()
    }, [])

    const fetchRestaurantTables = async () => {
        try {
            setLoading(true)
            const tables = await getRestaurantTables({ start: null, end: null })
            setRestaurantTables(tables)
        } catch {
            toast.error("Erreur lors de la récupération des tables du restaurant")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRestaurantTables()
    }, [])

    return (
        <main className="min-h-screen px-4 md:px-8 py-6 space-y-6">
            <div className="flex items-center justify-between">
                <h4 className="text-3xl font-bold tracking-tight text-primary dark:text-white">Tables</h4>

                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {new Date().toLocaleDateString('fr-FR', {
                        weekday: 'short',
                        day: '2-digit',
                        month: 'long',
                        year: '2-digit'
                    })}
                </p>
            </div>

            <CreateTableForm setTables={setRestaurantTables}>
                <Button className="text-white">
                    + Nouvelle table
                </Button>
            </CreateTableForm>

            {!loading && restaurantTables.length > 0 && (
                <div className="bg-white dark:bg-zinc-800 shadow rounded-lg p-4">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        Tables disponibles: {restaurantTables.length}
                    </h2>
                </div>
            )}

            {loading && (
                <div className="flex flex-col items-center justify-center h-96 space-y-2">
                    <MinLoader />
                    <p className="text-gray-500">Chargement des tables...</p>
                </div>
            )}

            {!loading && restaurantTables.length === 0 && (
                <div className="flex flex-col items-center justify-center h-96 space-y-4">
                    <Table2 className="w-12 h-12 text-gray-400" />
                    <p className="text-gray-500">Aucune table trouvée</p>
                    <CreateTableForm setTables={setRestaurantTables}>
                        <Button className="bg-primary text-white hover:bg-primary/90">
                            + Créer une table
                        </Button>
                    </CreateTableForm>
                </div>
            )}

            {restaurantTables.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {restaurantTables.map((table) => (
                        <Card
                            key={table.id}
                            className="p-5 bg-white dark:bg-zinc-800 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-white">
                                    <Table2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <h5 className="font-semibold text-lg">{table.name}</h5>
                                    <p className="text-xs text-gray-500">Commandes : {table.numberOfOrders}</p>
                                    <p className="text-xs text-gray-500">
                                        Total : {table?.totalPrice?.toFixed(2) || 0}
                                        {process.env.NEXT_PUBLIC_DEVISE}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-4">
                                {table.name !== process.env.NEXT_PUBLIC_DEFAULT_TABLE && (
                                    <>
                                        <EditTableForm setTables={setRestaurantTables} tableId={table.id} name={table.name}>
                                            <Button size="sm" variant="secondary" className="flex items-center gap-1">
                                                <Edit className="w-4 h-4" /> Modifier
                                            </Button>
                                        </EditTableForm>

                                        <DeleteTableForm setTables={setRestaurantTables} tableId={table.id} name={table.name}>
                                            <Button size="sm" variant="destructive" className="flex items-center gap-1">
                                                <Trash className="w-4 h-4" /> Supprimer
                                            </Button>
                                        </DeleteTableForm>
                                    </>
                                )}

                                <ShowTableQRCode
                                    key={table.id}
                                    name={table.name}
                                    tableId={table.id}
                                    logoUrl={restaurant?.logo || '/logo.png'}
                                >
                                    <Button size="sm" className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white">
                                        <QrCode className="w-4 h-4" /> QR Code
                                    </Button>
                                </ShowTableQRCode>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </main>
    )
}

export default Tables