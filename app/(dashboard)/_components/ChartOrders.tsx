'use client'
import React, { useEffect, useState } from 'react'
import { ResponsiveBar } from '@nivo/bar'
import { PeriodTypes } from '@/lib/types'
import { toast } from 'sonner'

type Props = {
    period: PeriodTypes
}
const ChartOrders = ({ period }: Props) => {
    const [loading, setLoading] = useState(true)
    
    const fetchData = async () => {
        try {
            setLoading(true)
            // const response = await getOrdersEvolutionData(period)
            // setData(response)
        } catch (error) {
            toast.error('Erreur lors de la récupération des données pour les graphiques')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [period])

    const dataTest = [
        {
            time: 'J1',
            count: 10
        },
        {
            time: 'J 2',
            count: 15
        },
        {
            time: 'J 3',
            count: 20
        },
        {
            time: 'J 4',
            count: 6
        },
        {            time: 'J 5',
            count: 12
        }
    ]
    return (
        <div className='min-h-96'>
            <div className='min-h-96'>
                <ResponsiveBar
                    data={dataTest}
                    indexBy="time"
                    keys={['count']}
                    margin={{
                        bottom: 20,
                        left: 60,
                        right: 10,
                        top: 0,
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
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                    }}
                    enableGridY={true}
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
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
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
            </div>
        </div>
    )
}

export default ChartOrders