'use client'
import { getOrdersCategoriesData } from '@/app/actions/statistics'
import { OrdersCategoriesData, PeriodTypes } from '@/lib/types'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { ResponsivePie } from '@nivo/pie'
import MinLoader from '@/components/MinLoader'
import { ResponsiveBar } from '@nivo/bar'


type Props = {
    period: PeriodTypes
    data: OrdersCategoriesData | undefined,
    setData: React.Dispatch<React.SetStateAction<OrdersCategoriesData | undefined>>
}
const ChartsSection = ({ period, data, setData }: Props) => {
    const [loading, setLoading] = useState(true)
    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await getOrdersCategoriesData(period)
            response.ordersData = response?.ordersData.map((item, index) => ({
                ...item,
                chartLabel: item.label.length > 3 ? `${item.label.slice(0, 3)}${index}` : `${item.label}${index}`
            }))
            console.log(period, response)
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
        <section className="md:px-6 py-4 grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className='border border-gray-100 dark:border-zinc-700 col-span-1 md:col-span-3 bg-white dark:bg-zinc-800 rounded-lg shadow p-4 min-h-98 overflow-hidden'>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Ventes par produit</h4>
                {
                    loading ? (
                        <div className="flex items-center justify-center h-full w-full">
                            <MinLoader />
                        </div>
                    ) : (
                        <ResponsiveBar
                            data={data?.ordersData || []}
                            indexBy="label"
                            keys={['value']}
                            margin={{
                                bottom: 40,
                                left: 40,
                                right: 10,
                                top: 5,
                            }}
                            padding={0.4}
                            valueScale={{ type: 'linear' }}
                            indexScale={{ type: 'band', round: true }}
                            borderRadius={4}
                            borderWidth={1}
                            borderColor={{
                                from: 'color',
                                modifiers: [['darker', 0.3]]
                            }}
                            axisBottom={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                            }}
                            enableGridY={false}
                            enableLabel={true}
                            label={d => `${d.value}`}
                            labelTextColor={{
                                from: 'color',
                                modifiers: [['darker', 2]]
                            }}
                            labelSkipWidth={16}
                            labelSkipHeight={16}
                            animate={true}
                            motionConfig="gentle"
                            theme={{
                                tooltip: {
                                    container: {
                                        backgroundColor: 'var(--tooltip-bg)',
                                        color: 'var(--tooltip-color)',
                                        fontSize: '12px',
                                        borderRadius: '6px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.8), 0 2px 4px -1px rgba(0, 0, 0, 0.6)',
                                        padding: '10px 12px',
                                        border: '1px solid var(--tooltip-border)'
                                    }
                                },
                                grid: {
                                    line: {
                                        stroke: 'var(--grid-line-color)',
                                        strokeWidth: 1,
                                        strokeDasharray: '4 4'
                                    }
                                },
                                axis: {
                                    domain: {
                                        line: {
                                            stroke: 'var(--axis-color)',
                                            strokeWidth: 1
                                        }
                                    },
                                    ticks: {
                                        line: {
                                            stroke: 'var(--axis-color)',
                                            strokeWidth: 1
                                        },
                                        text: {
                                            fill: 'var(--color-text)'
                                        }
                                    }
                                }
                            }}
                        />
                    )
                }
            </div>
            <div className="border border-gray-100 dark:border-zinc-700 col-span-1 md:col-span-2 bg-white dark:bg-zinc-800 rounded-lg shadow p-4 min-h-96"   >
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Commandes par catégorie</h4>
                {
                    loading ? (
                        <div className="flex items-center justify-center h-full w-full">
                            <MinLoader />
                        </div>
                    ) : (
                        <ResponsivePie
                            data={data?.categoriesData || []}
                            margin={{ top: 20, right: 20, bottom: 90, left: 20 }}
                            innerRadius={0.5}
                            padAngle={0.6}
                            cornerRadius={2}
                            activeOuterRadiusOffset={8}
                            arcLinkLabelsSkipAngle={10}
                            enableArcLinkLabels={false}
                            arcLinkLabelsTextColor='var(--tooltip-color)'
                            arcLinkLabelsColor={{ from: 'color' }}
                            arcLabelsSkipAngle={10}
                            arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                            legends={[
                                {
                                    anchor: 'bottom',
                                    direction: 'row',
                                    translateY: 56,
                                    itemWidth: 80,
                                    itemHeight: 12,
                                    symbolShape: 'circle',
                                    itemTextColor: 'var(--tooltip-color)'
                                }
                            ]}
                            theme={{
                                tooltip: {
                                    container: {
                                        backgroundColor: 'var(--tooltip-bg)',
                                        color: 'var(--tooltip-color)',
                                        fontSize: '12px',
                                        borderRadius: '6px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.8), 0 2px 4px -1px rgba(0, 0, 0, 0.6)',
                                        padding: '10px 12px',
                                        border: '1px solid var(--tooltip-border)'
                                    }
                                },
                            }}
                        />
                    )
                }
            </div>


        </section>
    )
}

export default ChartsSection