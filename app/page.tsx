'use client'
import React, { useState } from 'react';

export default function Home() {

  return (
    <main className='min-h-screen px-2 md:px-4'>
      <Link href="/sign-in" className='flex items-center justify-center h-screen text-2xl font-bold text-primary'>
        Se connecter
      </Link>
    </main>
  );
}
