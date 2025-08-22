'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { OrdersCategoriesData, PeriodTypes } from '@/lib/types'
import React, { useState } from 'react'
import Statistics from '../_components/Statistics'
import ChartsSection from '../_components/ChartsSection'
import AIAnalysis from '../reports/_components/AIAnalysis'

const Dashboard = () => {
  const [period, setPeriod] = useState<PeriodTypes>("TODAY")
  const [data, setData] = useState<OrdersCategoriesData>()


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
        <h4 className="text-2xl font-bold">Tableau de bord</h4>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {new Date().toLocaleDateString('fr-FR', {
            weekday: 'short',
            day: '2-digit',
            month: 'long',
            year: '2-digit'
          })}
        </p>
      </div>
      <div className='px-6'>
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

      <Statistics period={period} />

      <ChartsSection
        period={period}
        data={data}
        setData={setData}
      />

      <AIAnalysis
        period={period}
        data={data}
      />
      {/* <RecentOrders period={period} /> */}
    </main>
  )
}

export default Dashboard