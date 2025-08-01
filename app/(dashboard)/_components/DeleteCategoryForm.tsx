'use client'
import React, { useState } from 'react'
import {
    Credenza,
    CredenzaBody,
    CredenzaContent,
    CredenzaHeader,
    CredenzaTitle,
    CredenzaTrigger,
} from "@/components/Credenza"
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { deleteCategory } from '@/app/actions/actions'
import { Loader, Table2, TriangleAlert } from 'lucide-react'
import { Category } from '@/lib/types'


type Props = {
    children: React.ReactNode,
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>,
    categoryId: string,
    name: string
}
const DeleteCategoryForm = ({ children, categoryId, setCategories, name }: Props) => {
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    const handleDeleteCategory = async () => {
        try {
            if (!categoryId) {
                toast.error("ID de la catégorie manquant");
                return;
            }

            setIsCreating(true)
            await deleteCategory({
                id: categoryId,
            })
            toast.success("Catégorie supprimée avec succès");
            setCategories(prevTables => prevTables.filter(table => table.id !== categoryId));
            // setOpen(false);

        } catch (error) {
            toast.error("Erreur lors de la mise à jour de la table");
            setIsCreating(false)
        }
    }
    return (
        <Credenza open={open} onOpenChange={setOpen}>
            <CredenzaTrigger asChild>
                {children}
            </CredenzaTrigger>
            <CredenzaContent>
                <CredenzaHeader>
                    <CredenzaTitle className='flex items-center gap-2'>
                        <Table2 className='size-5 inline-block' />
                        Supprimer la catégorie: {name}
                    </CredenzaTitle>
                </CredenzaHeader>
                <CredenzaBody>
                    <div>
                        <div className='w-full mb-4 flex flex-col items-center gap-2'>
                            <TriangleAlert />
                            <div className='text-center'>
                                <p className='text-sm text-red-500'>Cette action est irréversible.</p>
                                <p className='text-sm text-red-500'>Êtes-vous sûr de vouloir supprimer cette catégorie ?</p>
                                <p>Les produits de la catégorie seront perdus.</p>
                            </div>
                        </div>

                        <Button
                            onClick={handleDeleteCategory}
                            className="w-full"
                        >
                            {isCreating ? <Loader className='size-4 animate-spin' /> : `Oui, supprimer ${name}`}
                        </Button>
                    </div>
                </CredenzaBody>
            </CredenzaContent>
        </Credenza>
    )
}

export default DeleteCategoryForm