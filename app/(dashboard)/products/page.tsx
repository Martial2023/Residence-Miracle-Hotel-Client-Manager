'use client'
import { getRestaurantProducts } from '@/app/actions/actions'
import { Button } from '@/components/ui/button'
import { Product } from '@/lib/types'
import { Edit, ShoppingBasket, Trash } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import CreateProductForm from '../_components/CreateProductForm'
import MinLoader from '@/components/MinLoader'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import DeleteProductForm from '../_components/DeleteProductForm'
import { Badge } from '@/components/ui/badge'

const Page = () => {
    const [restaurantProducts, setRestaurantProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const fetchRestaurantProducts = async () => {
        try {
            setLoading(true)
            const products = await getRestaurantProducts();
            setRestaurantProducts(products)
        } catch (error) {
            toast.error("Erreur lors de la récupération des produits du restaurant")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRestaurantProducts()
    }, [])
    return (
        <main className='min-h-screen px-4 md:px-8 py-6 space-y-4'>
            <div className="flex items-center justify-between p-4">
                <h4 className="text-2xl font-bold">Menu</h4>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {new Date().toLocaleDateString('fr-FR', {
                        weekday: 'short',
                        day: '2-digit',
                        month: 'long',
                        year: '2-digit'
                    })}
                </p>
            </div>

            <div className='flex items-center justify-between p-4 pt-0'>
                <CreateProductForm setRestaurantProducts={setRestaurantProducts}>
                    <Button className='text-white'>
                        Créer un produit
                    </Button>
                </CreateProductForm>
            </div>

            {
                loading && (
                    <div className='flex flex-col items-center justify-center h-96'>
                        <MinLoader />
                        <p>Chargement...</p>
                    </div>
                )
            }

            {
                !loading && restaurantProducts.length === 0 && (
                    <div className='flex flex-col items-center justify-center h-96'>
                        <div className='flex flex-col items-center justify-center'>
                            <ShoppingBasket className='size-8 text-gray-500' />
                            <p className='text-gray-500'>Aucun produit trouvé</p>
                        </div>
                        <CreateProductForm setRestaurantProducts={setRestaurantProducts}>
                            <Button variant={"outline"} className='mt-4 text-primary/70 hover:text-primary/80'>
                                Créer un produit
                            </Button>
                        </CreateProductForm>
                    </div>
                )
            }

            {
                restaurantProducts.length > 0 && !loading && (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4'>
                        {
                            restaurantProducts.map((product) => (
                                <Card key={product.id} className='p-2 hover:shadow-lg transition-shadow grid grid-cols-5 gap-3 dark:bg-zinc-800 cursor-pointer h-40 w-full overflow-hidden'>
                                    <div className='col-span-2 w-full h-full overflow-hidden'>
                                        <Image
                                            src={product.images[0] || '/placeholder.png'}
                                            alt={product.name}
                                            width={100}
                                            height={120}
                                            className='object-cover rounded-xl w-full h-full'
                                        />
                                    </div>

                                    <div className='col-span-3 flex flex-col justify-between overflow-hidden'>
                                        <div className='overflow-hidden'>
                                            <div className='flex items-center justify-between gap-2 mb-2'>
                                                <h5 className='font-semibold truncate'>{product.name}</h5>
                                                <div className="flex items-center gap-2">
                                                    {product.stock === 0 ? (
                                                        <Badge variant="destructive">
                                                            <ShoppingBasket className="size-4 text-red-500" />
                                                            Rupture
                                                        </Badge>
                                                    ) : product.stock < product.outOfStock ? (
                                                        <Badge variant="destructive" className="animate-pulse">
                                                            <ShoppingBasket className="size-4 text-orange-500" />
                                                            Stock faible
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline">
                                                            <ShoppingBasket className="size-4 text-green-500" />
                                                            En stock
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <p className='text-sm font-medium mt-2 truncate'>Prix: {product.price} {process.env.NEXT_PUBLIC_DEVISE}</p>
                                            <p className='text-sm text-gray-500 line-clamp-1 truncate'>{product.description}</p>
                                            <p className='text-sm text-gray-500 truncate'>Stock: {product.stock}</p>
                                        </div>
                                        <div className='mt-2 flex items-center gap-2'>
                                            <DeleteProductForm
                                                setRestaurantProducts={setRestaurantProducts}
                                                productId={product.id} name={product.name}>
                                                <Button size={"sm"} variant={"destructive"} className='text-white bg-red-400 hover:bg-red-500'>
                                                    <Trash className='size-4' />
                                                </Button>
                                            </DeleteProductForm>

                                            <CreateProductForm
                                                setRestaurantProducts={setRestaurantProducts}
                                                isUpdate={true}
                                                oldProduct={product}
                                            >
                                                <Button size={"sm"} className='bg-blue-500 text-white hover:bg-blue-600'>
                                                    <Edit className='size-4' />
                                                </Button>
                                            </CreateProductForm>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        }
                    </div>
                )
            }
        </main>
    )
}

export default Page