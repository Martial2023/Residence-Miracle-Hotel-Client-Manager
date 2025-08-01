'use client';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useRestaurant } from '@/hooks/useRestaurant';
import { CircleUserRoundIcon, Hamburger } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

const Navbar = () => {
  const { restaurant } = useRestaurant();
  const url = usePathname();
  return (
    <nav className='fixed top-0 left-0 right-0 z-50 h-16 md:h-14 flex items-center justify-center'>
      <div className='w-10/11 md:w-8/10 md:px-[6%] px-2 py-1  bg-white dark:bg-zinc-900 flex items-center justify-between shadow-md rounded-full'>
        <Link
          className='flex items-center gap-1'
          href={url}
        >
          {restaurant?.logo ? (
            <img
              className="size-full object-cover h-12 w-12 rounded-2xl"
              src={restaurant.logo}
              alt={restaurant.name || "Restaurant logo"}
              width={64}
              height={64}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div aria-hidden="true">
              <CircleUserRoundIcon className="size-8 opacity-60" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold line-clamp-1">{restaurant?.name || "Restaurant"}</h3>
            <p className="text-sm text-gray-500">{restaurant?.address}</p>
          </div>
        </Link>




        <div className='flex items-center gap-2 md:gap-4'>
          <Button
            className='ml-2'
            onClick={() => {
              const launchButton = document.getElementById('launch-order-button');
              if (launchButton) {
                launchButton.click();
              }
            }}
          >
            <Hamburger className="size-4" />
          </Button>

          <div className=''>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar