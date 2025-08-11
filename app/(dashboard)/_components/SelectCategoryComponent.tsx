'use client'
import { getRestaurantCategories } from '@/app/actions/actions'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Category } from '@/lib/types'
import { Loader } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

type Props = {
    categoryId: string
    setCategoryId: (id: string) => void
}
const SelectCategoryComponent = ({ categoryId, setCategoryId }: Props) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchCategories = async () => {
        try {
            setLoading(true)
            const categories = await getRestaurantCategories();
            setCategories(categories)
        } catch (error) {
            toast.error("Erreur lors de la récupération des catégories du restaurant")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    return (
        <Select onValueChange={setCategoryId} value={categoryId}>
            <SelectTrigger className="w-full cursor-pointer">
                <SelectValue placeholder="Choisissez une catégorie" />
            </SelectTrigger>
            <SelectContent className="w-full cursor-pointer">
                <SelectGroup className="w-full">
                    <SelectLabel>{categories.length > 0 ? "Catégories" : "Aucune catégorie disponible"}</SelectLabel>
                    {loading ? (
                        <SelectItem className='w-full' value="placeholder" disabled>
                            <div>
                                <span>Chargement...</span>
                                <Loader className="w-4 h-4 animate-spin"/>   
                            </div>
                        </SelectItem>
                    ) : categories.length === 0 ? (
                        <SelectItem className='w-full' value="no-category" disabled>
                            Aucune catégorie disponible
                        </SelectItem>
                    ) : null}
                    {
                        categories.map((category) => {
                            return (
                                <SelectItem className='w-full' key={category.id} value={category.id}>
                                    {category.name}
                                </SelectItem>
                            )
                        })
                    }
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

export default SelectCategoryComponent