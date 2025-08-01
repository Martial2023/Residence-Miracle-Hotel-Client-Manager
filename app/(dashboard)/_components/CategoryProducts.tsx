'use client'
import React, { useEffect, useState } from 'react'

import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { toast } from 'sonner'
import { getCategoryProducts } from '@/app/actions/actions'
import { Product } from '@/lib/types'
import { Edit, ShoppingBasket, SquareStack, Trash } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import DeleteProductForm from './DeleteProductForm'
import MinLoader from '@/components/MinLoader'
import CreateProductForm from './CreateProductForm'

type Props = {
    children: React.ReactNode
    categoryId: string
    categoryName: string
}
export function CategoryProducts({ children, categoryId, categoryName }: Props) {
    const [open, setOpen] = React.useState(false)
    const [categoryProducts, setCategoryProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const fetchCategoryProducts = async () => {
        try {
            setLoading(true)
            if (!categoryId) {
                toast.error("ID de la catégorie manquant");
                return;
            }
            const response = await getCategoryProducts(categoryId)
            setCategoryProducts(response)
        } catch (error) {
            toast.error("Erreur lors de la récupération des produits de la catégorie")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (open && categoryProducts.length === 0) {
            fetchCategoryProducts()
        }
    }, [open, categoryId]) // Trigger fetch when `open` changes

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent className='dark:bg-zinc-900'>
                <SheetHeader>
                    <SheetTitle>
                        <div className='flex items-center gap-4'>
                            <SquareStack className='size-6 text-primary' />
                            <div>
                                <h5 className='text-xl font-semibold text-primary'>{categoryName}</h5>
                            </div>
                        </div>
                    </SheetTitle>
                    <SheetDescription>
                        {!loading && (
                            <>
                                <ShoppingBasket className="inline-block mr-2" /> {categoryProducts.length} produits
                            </>
                        )}
                    </SheetDescription>
                </SheetHeader>
                <div className="grid flex-1 auto-rows-min gap-6 px-4 overflow-y-auto">
                    {
                        categoryProducts.map((product) => (
                            <Card key={product.id} className='p-2 hover:shadow-lg transition-shadow grid grid-cols-5 gap-3 dark:bg-zinc-800 cursor-pointer'>
                                <div className='col-span-2 w-full h-full'>
                                    <Image
                                        src={product.images[0] || '/placeholder.png'}
                                        alt={product.name}
                                        width={100}
                                        height={100}
                                        className='object-cover rounded-xl w-full h-full'
                                    />
                                </div>

                                <div className='col-span-3'>
                                    <div className='flex items-center justify-between gap-2 mb-2'>
                                        <h5 className='font-semibold'>{product.name}</h5>
                                        <div className="flex items-center gap-2">
                                            {product.stock === 0 ? (
                                                <>
                                                    <Badge variant="destructive">
                                                        <ShoppingBasket className="size-4 text-red-500" />
                                                        Rupture
                                                    </Badge>
                                                </>
                                            ) : product.stock < product.outOfStock ? (
                                                <>
                                                    <Badge variant="destructive" className="animate-pulse">
                                                        <ShoppingBasket className="size-4 text-orange-500" />
                                                        Stock faible
                                                    </Badge>
                                                </>
                                            ) : (
                                                <>
                                                    <Badge variant="outline">
                                                        <ShoppingBasket className="size-4 text-green-500" />
                                                        En stock
                                                    </Badge>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <p className='text-sm font-medium mt-2'>Prix: {product.price} {process.env.NEXT_PUBLIC_DEVISE}</p>

                                    <p className='text-sm text-gray-500 line-clamp-1'>{product.description}</p>
                                    <p className='text-sm text-gray-500'>Stock: {product.stock}</p>
                                    <div className='mt-2 flex items-center gap-2'>
                                        <DeleteProductForm
                                            setRestaurantProducts={setCategoryProducts}
                                            productId={product.id} name={product.name}>
                                            <Button size={"sm"} variant={"destructive"} className='text-white bg-red-400 hover:bg-red-500'>
                                                <Trash className='size-4' />
                                            </Button>
                                        </DeleteProductForm>

                                        <DeleteProductForm
                                            setRestaurantProducts={setCategoryProducts}
                                            productId={product.id} name={product.name}>
                                            <Button size={"sm"} className='bg-blue-500 text-white hover:bg-blue-600'>
                                                <Edit className='size-4' />
                                            </Button>
                                        </DeleteProductForm>
                                    </div>
                                </div>
                            </Card>
                        ))
                    }

                    {
                        loading && (
                            <div className='flex flex-col items-center justify-center h-96'>
                                <MinLoader />
                                <p>Chargement...</p>
                            </div>
                        )
                    }

                    {
                        !loading && categoryProducts.length === 0 && (
                            <div className='flex flex-col items-center justify-center h-96'>
                                <div className='flex flex-col items-center justify-center'>
                                    <ShoppingBasket className='size-8 text-gray-500' />
                                    <p className='text-gray-500'>Aucun produit trouvé</p>
                                </div>
                                <CreateProductForm setRestaurantProducts={setCategoryProducts}>
                                    <Button variant={"outline"} className='mt-4 text-primary/70 hover:text-primary/80'>
                                        Créer un produit
                                    </Button>
                                </CreateProductForm>
                            </div>
                        )
                    }
                </div>
                <SheetFooter>
                    {
                        !loading && categoryProducts.length !== 0 && (
                            <CreateProductForm setRestaurantProducts={setCategoryProducts}>
                                <Button variant={"outline"} className='flex items-center text-primary/70 hover:text-primary/80 dark:text-white w-full'>
                                   <ShoppingBasket className='w-5 h-5'/> Ajouter un produit
                                </Button>
                            </CreateProductForm>
                        )
                    }
                    <SheetClose asChild>
                        <Button variant="outline">Fermer</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
