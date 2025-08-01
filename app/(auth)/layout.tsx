import { Button } from '@/components/ui/button'
import { ArrowLeft, DatabaseZap } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { ThemeToggle } from '@/components/ThemeToggle'
// import { ScrollProgress } from '@/components/magicui/scroll-progress'
import Image from 'next/image'
import { Spotlight } from '@/components/ui/spotlight-new'

type Props = {
    children: React.ReactNode
}

const layout = ({ children }: Props) => {
    return (
        <main className=' relative w-full min-h-screen overflow-hidden'>
            <Spotlight />
            {/* <ScrollProgress className="top-0 h-1 z-[1000]" /> */}
            <div className='p-3 md:p-8 md:px-[8%] text-xl flex items-center justify-between'>
                <Link
                    href={"/"}
                    className='flex items-center rounded-full'
                >
                    <Button
                        className='rounded-full text-sm'
                        variant={"outline"}
                    >
                        <ArrowLeft />
                        Retour
                    </Button>
                </Link>

                <ThemeToggle />
            </div>

            <div className='flex flex-col items-center justify-center'>
                <div className='w-full flex items-center justify-center'>
                    <h2 className="text-2xl font-bold flex items-center">
                        <Image
                            src={"/logo.png"}
                            width={40}
                            height={40}
                            className="text-blue-500 -mr-1 mb-1"
                            alt="ClientManager"
                        />
                        <span className="text-primary">{process.env.NEXT_PUBLIC_NAME_FIRST}</span>
                        <span className="dark:text-white">{process.env.NEXT_PUBLIC_NAME_SECOND}</span>
                    </h2>
                </div>

                {children}

                <p className='text-center mb-4'>
                    En vous connectant, vous acceptez nos <br />
                    <a href="#" className='text-primary/40 hover:underline'>politiques de confidentialités</a> ainsi que <br />
                    nos <a href="#" className='text-primary/40 hover:underline'>conditions d&apos;utilisation</a>
                </p>
            </div>
        </main>
    )
}

export default layout