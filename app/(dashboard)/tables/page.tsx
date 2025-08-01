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
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)

    useEffect(() => {
        const getExistingRestaurant = async () => {
            try {
                const restaurant = await fetchRestaurant();
                setRestaurant(restaurant);
            } catch (error) {
                toast.error("Erreur lors de la récupération du restaurant");
            }
        };
        getExistingRestaurant();
    }, []);

    const fetchRestaurantTables = async () => {
        try {
            setLoading(true)
            const tables = await getRestaurantTables({
                start: startDate,
                end: endDate
            });
            setRestaurantTables(tables)
        } catch (error) {
            toast.error("Erreur lors de la récupération des tables du restaurant")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRestaurantTables()
    }, [startDate, endDate])

    return (
        <main className='min-h-screen'>
            <div className="flex items-center justify-between p-4">
                <h4 className="text-2xl font-bold">Tables</h4>
                <p>{new Date().toLocaleDateString('fr-FR')}</p>
            </div>

            <div className='w-full'>
                <CreateTableForm setTables={setRestaurantTables}>
                    <Button variant={"outline"} className='m-4 text-primary/70 hover:text-primary/80 dark:text-white dark:hover:text-white bg-primary/10 dark:bg-primary/20'>
                        Créer une table
                    </Button>
                </CreateTableForm>

                <div className='flex flex-col gap-2 items-center justify-center p-4'>
                    <div className='flex flex-col md:flex-row items-center gap-4 w-full md:max-w-8/10 rounded-xl bg-white dark:bg-zinc-800 p-6 shadow-md'>
                        <div className='flex flex-col md:flex-row items-center gap-2 w-full'>
                            <label htmlFor="startDate" className='text-sm font-medium md:whitespace-nowrap'>Date de début:</label>
                            <input
                                type="date"
                                id="startDate"
                                value={startDate ? startDate.toISOString().split('T')[0] : ''}
                                onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
                                className='border rounded-md p-2 w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-primary'
                            />
                        </div>

                        <div className='flex flex-col md:flex-row items-center gap-2 w-full'>
                            <label htmlFor="endDate" className='text-sm font-medium md:whitespace-nowrap'>Date de fin:</label>
                            <input
                                type="date"
                                id="endDate"
                                value={endDate ? endDate.toISOString().split('T')[0] : ''}
                                onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
                                className='border rounded-md p-2 w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-primary'
                            />
                        </div>
                    </div>
                </div>
            </div>

            {
                loading && (
                    <div className='flex flex-col items-center justify-center h-96'>
                        <MinLoader />
                        <p>Chargement...</p>
                    </div>
                )
            }

            {
                !loading && restaurantTables.length === 0 && (
                    <div className='flex flex-col items-center justify-center h-96'>
                        <div className='flex flex-col items-center justify-center'>
                            <Table2 className='size-8 text-gray-500' />
                            <p className='text-gray-500'>Aucune table trouvée</p>
                        </div>
                        <CreateTableForm setTables={setRestaurantTables}>
                            <Button variant={"outline"} className='mt-4 text-primary/70 hover:text-primary/80'>
                                Créer une table
                            </Button>
                        </CreateTableForm>
                    </div>
                )
            }

            {
                restaurantTables.length > 0 && (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4'>
                        {
                            restaurantTables.map((table) => (
                                <Card key={table.id} className='p-4 py-2 hover:shadow-lg transition-shadow grid grid-cols-4 gap-3 dark:bg-zinc-800 cursor-pointer'>
                                    <div className='col-span-1 w-full h-full'>
                                        <div className='flex items-center justify-center w-full h-full rounded-xl  bg-primary'>
                                            <Table2 className='size-6 text-white mb-2' />
                                        </div>
                                    </div>

                                    <div className='col-span-3'>
                                        <h5 className='font-semibold'>{table.name}</h5>
                                        <p className='text-sm text-gray-500'>Ventes: {table.numberOfOrders}</p>
                                        <p className='text-sm text-gray-500'>Total: {table?.totalPrice?.toFixed(2) || 0}{process.env.NEXT_PUBLIC_DEVISE} </p>

                                        <div className='mt-2 flex items-center gap-2'>
                                            {
                                                table.name !== process.env.NEXT_PUBLIC_DEFAULT_TABLE && (
                                                    <>
                                                        <EditTableForm setTables={setRestaurantTables} tableId={table.id} name={table.name}>
                                                            <Button size={"sm"} className='bg-blue-500 text-white hover:bg-blue-600'>
                                                                <Edit className='size-4' />
                                                            </Button>
                                                        </EditTableForm>

                                                        <DeleteTableForm setTables={setRestaurantTables} tableId={table.id} name={table.name}>
                                                            <Button size={"sm"} variant={"destructive"} className='text-white bg-red-400 hover:bg-red-500'>
                                                                <Trash className='size-4' />
                                                            </Button>
                                                        </DeleteTableForm>
                                                    </>
                                                )
                                            }

                                            <ShowTableQRCode
                                                key={table.id}
                                                name={table.name}
                                                tableId={table.id}
                                                logoUrl={restaurant?.logo || '/logo.png'}
                                            >
                                                <Button size={"sm"} className=' bg-green-500 text-white hover:bg-green-600'>
                                                    <QrCode className='size-4' />
                                                    QR Code
                                                </Button>
                                            </ShowTableQRCode>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        }
                    </div>
                )
            }
        </main>
    )
}

export default Tables