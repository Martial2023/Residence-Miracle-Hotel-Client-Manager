// 'use client'
// import { Code, Loader2, PiggyBank, ShoppingBasket } from 'lucide-react'
// import React from 'react'

// type OrdersStatsProps = {
//     loading: boolean;
//     totalOrders: number;
//     completedOrders: number;
//     pendingOrders: number;
// }
// const OrdersStatsComponent = ({ loading, totalOrders, completedOrders, pendingOrders }: OrdersStatsProps) => {
//     return (
//         <section className='p-4 px-0 md:px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
//             <div className='dark:bg-zinc-800 p-4 rounded-lg shadow-md flex items-center gap-2'>
//                 <div className='bg-primary p-2 h-full flex items-center justify-center text-white rounded-lg'>
//                     <Code className='text-white w-4' />
//                 </div>
//                 <div>
//                     <h4 className='font-bold'>Total</h4>
//                     { loading? <Loader2 className='w-4 animate-spin text-gray-500' /> : <p>{totalOrders}</p> }
//                 </div>
//             </div>

//             <div className='dark:bg-zinc-800 p-4 rounded-lg shadow-md flex items-center gap-2'>
//                 <div className='bg-primary p-2 h-full flex items-center justify-center text-white rounded-lg'>
//                     <ShoppingBasket className='text-white w-4' />
//                 </div>
//                 <div>
//                     <h4 className='font-bold'>Traitées</h4>
//                     { loading? <Loader2 className='animate-spin w-4 text-gray-500' /> : <p>{completedOrders}</p> }
//                 </div>
//             </div>
//             <div className='dark:bg-zinc-800 p-4 rounded-lg shadow-md flex items-center gap-2'>
//                 <div className='bg-primary p-2 h-full flex items-center justify-center text-white rounded-lg'>
//                     <PiggyBank className='text-white w-4' />
//                 </div>
//                 <div>
//                     <h4 className='font-bold'>Non Traitées</h4>
//                     { loading? <Loader2 className='animate-spin w-4 text-gray-500' /> : <p>{pendingOrders}</p> }
//                 </div>
//             </div>
//         </section>
//     )
// }

// export default OrdersStatsComponent

'use client'
import { Loader2, ClipboardList, CheckCircle2, Clock } from 'lucide-react'
import React from 'react'

type OrdersStatsProps = {
    loading: boolean;
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
}

const OrdersStatsComponent = ({ loading, totalOrders, completedOrders, pendingOrders }: OrdersStatsProps) => {
    const stats = [
        {
            label: 'Total',
            value: totalOrders,
            icon: <ClipboardList className="w-5 h-5" />,
            bg: 'bg-blue-500',
        },
        {
            label: 'Traitées',
            value: completedOrders,
            icon: <CheckCircle2 className="w-5 h-5" />,
            bg: 'bg-green-500',
        },
        {
            label: 'Non Traitées',
            value: pendingOrders,
            icon: <Clock className="w-5 h-5" />,
            bg: 'bg-yellow-500',
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
                        {loading ? (
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

export default OrdersStatsComponent
