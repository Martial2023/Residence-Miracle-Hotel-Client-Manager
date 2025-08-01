'use client'
import { Code, Loader2, PiggyBank, ShoppingBasket } from 'lucide-react'
import React from 'react'

type OrdersStatsProps = {
    loading: boolean;
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
}
const OrdersStatsComponent = ({ loading, totalOrders, completedOrders, pendingOrders }: OrdersStatsProps) => {
    return (
        <section className='p-4 px-0 md:px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
            <div className='dark:bg-zinc-800 p-4 rounded-lg shadow-md flex items-center gap-2'>
                <div className='bg-primary p-2 h-full flex items-center justify-center text-white rounded-lg'>
                    <Code className='text-white w-4' />
                </div>
                <div>
                    <h4 className='font-bold'>Total</h4>
                    { loading? <Loader2 className='w-4 animate-spin text-gray-500' /> : <p>{totalOrders}</p> }
                </div>
            </div>

            <div className='dark:bg-zinc-800 p-4 rounded-lg shadow-md flex items-center gap-2'>
                <div className='bg-primary p-2 h-full flex items-center justify-center text-white rounded-lg'>
                    <ShoppingBasket className='text-white w-4' />
                </div>
                <div>
                    <h4 className='font-bold'>Traitées</h4>
                    { loading? <Loader2 className='animate-spin w-4 text-gray-500' /> : <p>{completedOrders}</p> }
                </div>
            </div>
            <div className='dark:bg-zinc-800 p-4 rounded-lg shadow-md flex items-center gap-2'>
                <div className='bg-primary p-2 h-full flex items-center justify-center text-white rounded-lg'>
                    <PiggyBank className='text-white w-4' />
                </div>
                <div>
                    <h4 className='font-bold'>Non Traitées</h4>
                    { loading? <Loader2 className='animate-spin w-4 text-gray-500' /> : <p>{pendingOrders}</p> }
                </div>
            </div>
        </section>
    )
}

export default OrdersStatsComponent