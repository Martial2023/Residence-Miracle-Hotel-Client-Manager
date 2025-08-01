'use client'
import React, { useEffect, useState } from 'react'
import { useCurrentUser } from "@/lib/useCurrentUser"
import { useRouter } from "next/navigation";
import { createRestaurant, fetchRestaurant } from '@/app/actions/actions'
import IsLoading from '@/components/IsLoading'
import { motion } from 'motion/react'
import Image from 'next/image'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import LogoUpload from '@/components/LogoUpload'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import PhoneNumberInput from '@/components/PhoneNumberInput'
import { Loader } from 'lucide-react'
import { generateReactHelpers } from '@uploadthing/react';

const { uploadFiles } = generateReactHelpers();


const OnBoarding = () => {
  const user = useCurrentUser()
  const router = useRouter()
  const [restaurantLoading, setRestaurantLoading] = useState<boolean>(true)
  const [restaurantCreating, setRestaurantCreating] = useState<boolean>(false)
  const [restaurantName, setRestaurantName] = useState<string>('')
  const [restaurantAddress, setRestaurantAddress] = useState<string>('')
  const [restaurantEmail, setRestaurantEmail] = useState<string[]>([])
  const [restaurantPhone, setRestaurantPhone] = useState<string>('')
  const [logoFile, setLogoFile] = useState<File | null>(null)

  useEffect(() => {
    const checkRoleAndRedirect = async () => {
      if (user) {
        const existingRestaurant = await fetchRestaurant();
        if (existingRestaurant) {
          router.push('/dashboard')
        } else {
          setRestaurantLoading(false)
        }
      }
    };
    checkRoleAndRedirect();
  }, [user, router]);

  const handleCreateRestaurant = async () => {
    try {
      setRestaurantCreating(true)
      let logoUrl = ''
      if (logoFile) {
        const [uploadedFile] = await uploadFiles('image', { files: [logoFile] });
        logoUrl = uploadedFile.ufsUrl;
      }
      const restaurantId = await createRestaurant({
        name: restaurantName,
        address: restaurantAddress,
        email: restaurantEmail,
        phone: restaurantPhone,
        logoUrl,
      })

      if (restaurantId) {
        toast.success('Etablissement créé avec succès !')
        router.push('/dashboard')
      } else {
        toast.error('Erreur lors de la création de l\'établissement. Veuillez réessayer.')
        window.location.reload()
      }
    } catch (error) {
      toast.error('Erreur lors de la création du restaurant. Veuillez réessayer.')
    } finally {
      setRestaurantCreating(false)
    }
  }

  if (user === undefined || restaurantLoading) {
    return <IsLoading />
  }

  return (
    <main className="relative overflow-x-hidden min-h-screen flex gap-4 flex-col items-center justify-center p-2">
      {/* <Spotlight /> */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700"
      >
        <div className="flex items-center justify-center mb-6">
          <h2 className="text-3xl font-bold flex items-center">
            <Image
              src="/logo.png"
              width={40}
              height={40}
              alt="Prolinkeet Logo"
              className="text-blue-500"
            />
            <span className="text-primary">{process.env.NEXT_PUBLIC_NAME_FIRST}</span>
            <span className="text-gray-900 dark:text-white">{process.env.NEXT_PUBLIC_NAME_SECOND}</span>
          </h2>
        </div>

        <p className="text-gray-500 dark:text-gray-400 text-center">
          Complétez les informations de votre établissement
        </p>

        <div className='w-full space-y-2 mt-4'>
          <div className='mt-4'>
            <LogoUpload
              setMediaFile={setLogoFile}
              label='Logo'
            />
          </div>

          <div>
            <Label htmlFor="restaurantName">Nom</Label>
            <Input
              id="restaurantName"
              type="text"
              placeholder="Nom du restaurant ou hotel"
              className="w-full"
              onChange={(e) => setRestaurantName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="restaurantAddress">Adresse</Label>
            <Input
              id="restaurantAddress"
              type="text"
              placeholder="Adresse du restauranSt ou hotel"
              className="w-full"
              onChange={(e) => setRestaurantAddress(e.target.value)}
            />
          </div>

          <div>
            <PhoneNumberInput
              setRestaurantPhone={setRestaurantPhone}
            />
          </div>

          <div className='mt-4'>
            <Button
              className='w-full'
              onClick={handleCreateRestaurant}
              disabled={restaurantCreating || !restaurantName || !restaurantAddress || !restaurantPhone}
            >
              {restaurantCreating ? <Loader className='size-4 animate-spin' /> : "Créer l'établissement"}
            </Button>
          </div>

        </div>
      </motion.div>
      {user?.email}

      <ThemeToggle />
    </main>
  )
}

export default OnBoarding