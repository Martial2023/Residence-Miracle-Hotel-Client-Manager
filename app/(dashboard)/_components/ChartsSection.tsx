'use client'
import { getOrdersCategoriesData } from '@/app/actions/statistics'
import { OrdersCategoriesData, PeriodTypes } from '@/lib/types'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { ResponsivePie } from '@nivo/pie'


type Props = {
    period: PeriodTypes
}
const ChartsSection = ({ period }: Props) => {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<OrdersCategoriesData>()

    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await getOrdersCategoriesData(period)
            setData(response)
        } catch (error) {
            toast.error('Erreur lors de la récupération des données pour les graphiques')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [period])
    return (
        <section className="md:px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className='col-span-1 md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-4'>
                Commandes
            </div>
            <div className="col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-96"   >
                <h4>Catégories</h4>
                {
                    loading ? (
                        <div className="flex items-center justify-center h-48">
                            <p className="text-gray-500">Chargement...</p>
                        </div>
                    ) : (
                        <ResponsivePie
                            data={data?.categoriesData || []}
                            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                            innerRadius={0.5}
                            padAngle={0.6}
                            cornerRadius={2}
                            activeOuterRadiusOffset={8}
                            arcLinkLabelsSkipAngle={10}
                            arcLinkLabelsTextColor="#333333"
                            arcLinkLabelsThickness={2}
                            arcLinkLabelsColor={{ from: 'color' }}
                            arcLabelsSkipAngle={10}
                            arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                            legends={[
                                {
                                    anchor: 'bottom',
                                    direction: 'row',
                                    translateY: 56,
                                    itemWidth: 100,
                                    itemHeight: 18,
                                    symbolShape: 'circle'
                                }
                            ]}
                        />
                    )
                }
            </div>
                
                <p>Taille: {data?.categoriesData.length} Categories</p>
            {
                data?.categoriesData && (
                    <div>
                        <h4 className="text-lg font-semibold mb-2">Détails des catégories</h4>
                        <ul className="list-disc pl-5">
                            {data.categoriesData.map((category) => (
                                <li key={category.id} className="mb-2">
                                    <span className="font-medium">rt:{category.label}:</span> {category.value} commandes
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            }
        </section>
    )
}

export default ChartsSection