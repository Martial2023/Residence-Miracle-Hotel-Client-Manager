'use client'
import { getFirstStatistic } from '@/app/actions/statistics'
import { FirstStatTypes, PeriodTypes } from '@/lib/types'
import { Code, Loader2, PiggyBank, ShoppingBasket } from 'lucide-react'
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

    return (
        <section className='p-4 px-0 md:px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
            <div className='dark:bg-zinc-800 p-4 rounded-lg shadow-md flex items-center gap-2'>
                <div className='bg-primary p-2 h-full flex items-center justify-center text-white rounded-lg'>
                    <Code className='text-white w-4' />
                </div>
                <div>
                    <h4 className='font-bold'>Commandes</h4>
                    { isLoading? <Loader2 className='w-4 animate-spin text-gray-500' /> : <p>{data.totalOrders}</p> }
                </div>
            </div>
            <div className='dark:bg-zinc-800 p-4 rounded-lg shadow-md flex items-center gap-2'>
                <div className='bg-primary p-2 h-full flex items-center justify-center text-white rounded-lg'>
                    <ShoppingBasket className='text-white w-4' />
                </div>
                <div>
                    <h4 className='font-bold'>Produits</h4>
                    { isLoading? <Loader2 className='animate-spin w-4 text-gray-500' /> : <p>{data.totalProducts}</p> }
                </div>
            </div>
            <div className='dark:bg-zinc-800 p-4 rounded-lg shadow-md flex items-center gap-2'>
                <div className='bg-primary p-2 h-full flex items-center justify-center text-white rounded-lg'>
                    <PiggyBank className='text-white w-4' />
                </div>
                <div>
                    <h4 className='font-bold'>Chiffre d'affaires</h4>
                    { isLoading? <Loader2 className='animate-spin w-4 text-gray-500' /> : <p>{data.CA}{process.env.NEXT_PUBLIC_DEVISE}</p> }
                </div>
            </div>
        </section>
    )
}

export default Statistics