'use client';
import { Button } from '@/components/ui/button'
import React, { useState, useEffect } from 'react'
import CreateCategoryForm from '../_components/CreateCategoryForm'
import { Category, Restaurant } from '@/lib/types'
import { toast } from 'sonner';
import { getRestaurantCategories } from '@/app/actions/actions';
import { Card } from '@/components/ui/card';
import { Edit, ShoppingBasket, SquareStack, Trash } from 'lucide-react';
import MinLoader from '@/components/MinLoader'
import EditCategoryForm from '../_components/EditCategoryForm';
import DeleteCategoryForm from '../_components/DeleteCategoryForm';
import { CategoryProducts } from '../_components/CategoryProducts';

const Page = () => {
    const [restaurantCategories, setRestaurantCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState<boolean>(true)


    const fetchRestaurantCategories = async () => {
        try {
            setLoading(true)
            const categories = await getRestaurantCategories();
            setRestaurantCategories(categories)
        } catch (error) {
            toast.error("Erreur lors de la récupération des catégories du restaurant")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRestaurantCategories()
    }, [])

    return (
        <main className='min-h-screen px-4 md:px-8 py-6 space-y-6'>
            <div className="flex items-center justify-between p-4">
                <h4 className="text-2xl font-bold">Catégories</h4>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {new Date().toLocaleDateString('fr-FR', {
                        weekday: 'short',
                        day: '2-digit',
                        month: 'long',
                        year: '2-digit'
                    })}
                </p>
            </div>

            <div className='w-full'>
                <CreateCategoryForm
                    setCategories={setRestaurantCategories}
                >
                    <Button className='text-white'>
                        Créer une catégorie
                    </Button>
                </CreateCategoryForm>

                {
                    loading && (
                        <div className='flex flex-col items-center justify-center h-96'>
                            <MinLoader />
                            <p>Chargement...</p>
                        </div>
                    )
                }

                {
                    !loading && restaurantCategories.length === 0 && (
                        <div className='flex flex-col items-center justify-center h-96'>
                            <div className='flex flex-col items-center justify-center'>
                                <SquareStack className='size-8 text-gray-500' />
                                <p className='text-gray-500'>Aucune catégorie trouvée</p>
                            </div>
                            <CreateCategoryForm setCategories={setRestaurantCategories}>
                                <Button variant={"outline"} className='mt-4 text-primary/70 hover:text-primary/80'>
                                    Créer une catégorie
                                </Button>
                            </CreateCategoryForm>
                        </div>
                    )
                }

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4'>
                    {restaurantCategories.map((category) => (
                        <Card key={category.id} className='cursor-pointer p-4 pb-2 shadow-md border rounded-lg hover:shadow-lg transition-shadow'>
                            <CategoryProducts
                                categoryId={category.id}
                                categoryName={category.name}
                            >
                                <div>
                                    <div className='flex items-center gap-4'>
                                        <SquareStack className='size-6 text-primary' />
                                        <div>
                                            <h5 className='text-xl font-semibold text-primary'>{category.name}</h5>
                                            <p className='text-sm text-gray-500'>{category.description || 'Aucune description disponible'}</p>
                                        </div>
                                    </div>
                                    <div className='mt-4 flex items-center gap-2 text-sm text-gray-400'>
                                        <span className='flex items-center gap-1'>
                                            <ShoppingBasket className='size-4 text-gray-400' />
                                            Produits: {category.numberOfProducts || 0}
                                        </span>
                                    </div>
                                </div>
                            </CategoryProducts>
                            <div className='flex items-center flex-wrap gap-2'>
                                <EditCategoryForm
                                    categoryId={category.id}
                                    setCategories={setRestaurantCategories}
                                    name={category.name}
                                    description={category.description || ''}
                                >
                                    <Button variant="outline" size="sm" className='flex items-center gap-2 text-primary'>
                                        <Edit className='size-4' />
                                    </Button>
                                </EditCategoryForm>

                                <DeleteCategoryForm
                                    categoryId={category.id}
                                    setCategories={setRestaurantCategories}
                                    name={category.name}
                                >
                                    <Button variant="destructive" size="sm" className='flex items-center gap-2 text-white'>
                                        <Trash className='size-4' />
                                    </Button>
                                </DeleteCategoryForm>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </main>
    )
}

export default Page