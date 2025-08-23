'use client'
import MinLoader from '@/components/MinLoader'
import { Button } from '@/components/ui/button'
import { getAiAnalysis } from '@/lib/AIAnalysisFunction'
import { OrdersCategoriesData, PeriodTypes } from '@/lib/types'
import { SparklesIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import ReactMarkdown from "react-markdown";
import { BorderBeam } from "@/components/magicui/border-beam";

type Props = {
  period: PeriodTypes
  data: OrdersCategoriesData | undefined
}
const AIAnalysis = ({ period, data }: Props) => {
  const [loading, setLoading] = useState(true)
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null)

  const handleAnalyse = async () => {
    try {
      if(data) {
        setLoading(true);
        const analysis = await getAiAnalysis({
          period,
          data
        });
        setAiAnalysis(analysis);
      }
    } catch {
      console.error("Analyse non obtenue");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleAnalyse()
  }, [period, data])

  return (
    <section className='md:p-4 py-4 p-2 border border-gray-100 dark:border-zinc-700 rounded-2xl my-4 md:m-4 relative shadow-md overflow-hidden'>
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Analyse Stratégique</h2>
      {
        loading ? (
          <div className="flex items-center justify-center h-full w-full">
            <MinLoader />
          </div>
        ) : (
          <div className='w-full'>
            {aiAnalysis ? (
              <div className="prose prose-sm max-w-none text-justify">
                <ReactMarkdown>{aiAnalysis}</ReactMarkdown>
              </div>
            ) : (
              <div className='w-full flex flex-col items-center justify-center gap-4'>
                <p className='text-gray-500'>Aucune analyse disponible</p>
                <Button
                  variant="outline"
                  onClick={handleAnalyse}
                  className='animate-pulse border-primary/500 text-primary-500 hover:bg-primary-500 hover:text-white transition-colors duration-300'
                >
                  <SparklesIcon className='mr-2' />
                  Analyser
                </Button>
              </div>
            )}
          </div>
        )
      }
      <BorderBeam duration={10} size={150} />
    </section>
  )
}

export default AIAnalysis