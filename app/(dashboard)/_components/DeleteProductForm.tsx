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
import { deleteProduct } from '@/app/actions/actions'
import { Loader, ShoppingBasket, TriangleAlert } from 'lucide-react'
import { Product } from '@/lib/types'


type Props = {
    children: React.ReactNode,
    setRestaurantProducts: React.Dispatch<React.SetStateAction<Product[]>>,
    productId: string,
    name: string
}
const DeleteProductForm = ({ children, productId, setRestaurantProducts, name }: Props) => {
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    const handleDeleteProduct = async () => {
        try {
            if (!productId) {
                toast.error("ID du produit manquant");
                return;
            }

            setIsDeleting(true)
            await deleteProduct({
                productId: productId,
            })
            toast.success("Catégorie supprimée avec succès");
            setRestaurantProducts(prevTables => prevTables.filter(table => table.id !== productId));
            // setOpen(false);

        } catch (error) {
            toast.error("Erreur lors de la suppression du produit");
            setIsDeleting(false)
        }
    }
    return (
        <Credenza open={open} onOpenChange={setOpen}>
            <CredenzaTrigger asChild>
                {children}
            </CredenzaTrigger>
            <CredenzaContent className='dark:bg-zinc-900 pb-6 md:pb-2'>
                <CredenzaHeader>
                    <CredenzaTitle className='flex items-center gap-2'>
                        <ShoppingBasket className='size-5 inline-block' />
                        Supprimer le produit: {name}
                    </CredenzaTitle>
                </CredenzaHeader>
                <CredenzaBody>
                    <div>
                        <div className='w-full mb-4 flex flex-col items-center gap-2'>
                            <TriangleAlert />
                            <div className='text-center'>
                                <p className='text-sm text-red-500'>Cette action est irréversible.</p>
                                <p className='text-sm text-red-500'>Êtes-vous sûr de vouloir supprimer ce produit ?</p>
                            </div>
                        </div>

                        <div className='flex items-center justify-center gap-2'>
                            <Button
                                variant="outline"
                                onClick={() => setOpen(false)}
                                className='flex-1/2'
                            >
                                Annuler
                            </Button>

                            <Button
                                onClick={handleDeleteProduct}
                                className='flex-1/2'
                            >
                                {isDeleting ? <Loader className='size-4 animate-spin' /> : `Oui, supprimer ${name}`}
                            </Button>
                        </div>
                    </div>
                </CredenzaBody>
            </CredenzaContent>
        </Credenza>
    )
}

export default DeleteProductForm