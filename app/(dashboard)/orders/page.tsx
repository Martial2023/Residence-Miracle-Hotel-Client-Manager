'use client'
import { Button } from '@/components/ui/button'
import { OrderProps, PeriodTypes } from '@/lib/types'
import { ShoppingBasket } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import OrdersStatsComponent from './_components/OrdersStatsComponent'
import { getOrders } from '@/app/actions/statistics'
import ShowOrders from './_components/ShowOrders'
import AddOrderComponent from './_components/AddOrderComponent'

const REFRESH_TIME = 4 // seconds;
const Page = () => {
    const [period, setPeriod] = useState<PeriodTypes>("TODAY")
    const [restaurantOrders, setRestaurantOrders] = useState<OrderProps[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)

    const prevOrdersRef = useRef<any[]>([]);
    // Charger un son
    const playSound = () => {
        const audio = new Audio("/sounds/admin.mp3"); // chemin vers ton fichier dans public/sounds
        audio.play();
    };

    const fetchRestaurantOrders = async () => {
        try {
            setLoading(true);
            const orders = await getOrders(period);

            // Comparer avec les commandes précédentes
            if (prevOrdersRef.current.length > 0) {
                const prevIds = prevOrdersRef.current.map(o => o.id);
                const newOrders = orders.filter(o => !prevIds.includes(o.id));

                if (newOrders.length > 0) {
                    playSound(); // Jouer le son seulement si nouvelle commande
                }
            }

            // Mettre à jour les données
            prevOrdersRef.current = orders;
            setRestaurantOrders(orders);

        } catch (error) {
            toast.error("Erreur lors de la récupération des commandes du restaurant");
        } finally {
            setLoading(false);
        }
    };


    // const fetchRestaurantOrders = async () => {
    //     try {
    //         setLoading(true)
    //         const orders = await getOrders(period);
    //         setRestaurantOrders(orders)
    //     } catch (error) {
    //         toast.error("Erreur lors de la récupération des commandes du restaurant")
    //     } finally {
    //         setLoading(false)
    //     }
    // }

    useEffect(() => {
        fetchRestaurantOrders()
    }, [startDate, endDate, period])



    const periodItems = [
        { value: 'TODAY', label: "Aujourd'hui", style: "bg-blue-100 text-blue-900" },
        { value: 'YESTERDAY', label: "Hier", style: "bg-green-100 text-green-900" },
        { value: 'LAST_7_DAYS', label: "7 Derniers Jours", style: "bg-yellow-100 text-yellow-900" },
        { value: 'LAST_30_DAYS', label: "30 Derniers Jours", style: "bg-orange-100 text-orange-900" },
        { value: 'LAST_90_DAYS', label: "90 Derniers Jours", style: "bg-red-100 text-red-900" },
        { value: 'LAST_365_DAYS', label: "365 Derniers Jours", style: "bg-purple-100 text-purple-900" },
        { value: 'ALL_TIME', label: "TOUT", style: "bg-gray-100 text-gray-900" }
    ]

    return (
        <main className='min-h-screen px-2 md:px-4'>
            <div className="flex items-center justify-between p-4 px-0">
                <h4 className="text-2xl font-bold">Commandes</h4>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {new Date().toLocaleDateString('fr-FR', {
                        weekday: 'short',
                        day: '2-digit',
                        month: 'long',
                        year: '2-digit'
                    })}
                </p>
            </div>
            <div className=''>
                <Select value={period} onValueChange={(value: string) => setPeriod(value as PeriodTypes)}>
                    <SelectTrigger className="cursor-pointer w-48 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                        <SelectValue placeholder="Période" />
                    </SelectTrigger>
                    <SelectContent className=''>
                        {periodItems.map((item) => (
                            <SelectItem key={item.value} value={item.value} className={item.style + " cursor-pointer my-1"}>
                                {item.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>


            <OrdersStatsComponent
                loading={loading}
                totalOrders={restaurantOrders.length}
                completedOrders={restaurantOrders.filter(order => order.status === 'COMPLETED').length}
                pendingOrders={restaurantOrders.filter(order => order.status === 'PENDING').length}
            />

            <div>
                <AddOrderComponent>
                    <Button>
                        <ShoppingBasket className='w-4 mr-2' />
                        Ajouter une Commande
                    </Button>
                </AddOrderComponent>
            </div>

            <div className="w-full overflow-x-auto mt-4">
                <ShowOrders
                    period={period}
                    setRestaurantOrdersForStats={setRestaurantOrders}
                />
            </div>
        </main>
    )
}

export default Page