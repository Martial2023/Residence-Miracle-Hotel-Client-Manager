'use client'
import { getFirstStatistic } from '@/app/actions/statistics'
import { FirstStatTypes, PeriodTypes } from '@/lib/types'
import { Loader2, ShoppingBasket, PiggyBank, ClipboardList, Users } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

type StatisticsProps = {
    period: PeriodTypes
}

const Statistics = ({ period }: StatisticsProps) => {
    const [data, setData] = useState<FirstStatTypes>({
        totalOrders: 0,
        CA: 0,
        totalCustomers: 0,
        totalProducts: 0
    })
    const [isLoading, setIsLoading] = useState(true)

    const fetchData = async () => {
        try {
            setIsLoading(true)
            const response = await getFirstStatistic(period)
            setData(response)
        } catch {
            toast.error('Erreur lors de la récupération des statistiques')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [period])

    const stats = [
        {
            label: 'Commandes',
            value: data.totalOrders,
            icon: <ClipboardList className="w-5 h-5" />,
            bg: 'bg-blue-500',
        },
        {
            label: 'Produits',
            value: data.totalProducts,
            icon: <ShoppingBasket className="w-5 h-5" />,
            bg: 'bg-purple-500',
        },
        {
            label: 'Chiffre d’affaires',
            value: `${data.CA}${process.env.NEXT_PUBLIC_DEVISE || ''}`,
            icon: <PiggyBank className="w-5 h-5" />,
            bg: 'bg-green-500',
        },
    ]

    return (
        <section className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
                <div
                    key={i}
                    className="dark:bg-zinc-800 bg-white border border-gray-100 dark:border-zinc-700 
                               p-5 rounded-xl shadow-sm flex items-center gap-4 transition-all duration-200 
                               hover:shadow-md hover:scale-[1.02]"
                >
                    <div className={`${stat.bg} p-3 flex items-center justify-center text-white rounded-2xl`}>
                        {stat.icon}
                    </div>
                    <div className="flex flex-col">
                        <h4 className="text-gray-600 dark:text-gray-300 text-sm font-medium">{stat.label}</h4>
                        {isLoading ? (
                            <Loader2 className="animate-spin w-5 h-5 text-gray-400 mt-1" />
                        ) : (
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                        )}
                    </div>
                </div>
            ))}
        </section>
    )
}

export default Statistics