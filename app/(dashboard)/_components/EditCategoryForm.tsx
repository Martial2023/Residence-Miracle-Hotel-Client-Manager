'use client'
import React, { useState } from 'react'
import {
    Credenza,
    CredenzaBody,
    CredenzaContent,
    CredenzaDescription,
    CredenzaHeader,
    CredenzaTitle,
    CredenzaTrigger,
} from "@/components/Credenza"
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { UpdateCategory } from '@/app/actions/actions'
import { Input } from '@/components/ui/input'
import { Loader, SquareStack } from 'lucide-react'
import { Category } from '@/lib/types'
import { Textarea } from '@/components/ui/textarea'


type Props = {
    children: React.ReactNode,
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>,
    categoryId: string,
    name: string,
    description: string
}
const EditCategoryForm = ({ children, categoryId, name, description }: Props) => {
    const [categorieName, setCategorieName] = useState<string>(name);
    const [categoryDescription, setCategoryDescription] = useState<string>(description)
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    const handleUpdateCategory = async () => {
        try {
            if(!categoryId){
                toast.error("ID de la catégorie manquant");
                return;
            }
            if(!categorieName.trim() || categorieName.trim() === name.trim() && categoryDescription.trim() === description.trim()){
                setOpen(false);
                return;
            }

            setIsCreating(true)
            await UpdateCategory({
                id: categoryId,
                name: categorieName,
                description: categoryDescription
            })
            window.location.reload();
            toast.success("Categorie mise à jour avec succès");
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
            <CredenzaContent className='dark:bg-zinc-900'>
                <CredenzaHeader>
                    <CredenzaTitle className='flex items-center gap-2'>
                        <SquareStack className='size-5 inline-block' />
                        Mettre à jour une categorie
                    </CredenzaTitle>
                    <CredenzaDescription>
                        Mettre à jour la categorie pour votre restaurant
                    </CredenzaDescription>
                </CredenzaHeader>
                <CredenzaBody className='pb-6 md:pb-2'>
                    <div>
                        <Input
                            value={categorieName}
                            onChange={(e) => setCategorieName(e.target.value)}
                            placeholder="Nom de la catégorie"
                            className="mb-4"
                        />

                        <Textarea
                            value={categoryDescription}
                            onChange={(e) => setCategoryDescription(e.target.value)}
                            placeholder="Description de la catégorie"
                            className="mb-4 resize-none" 
                        /> 

                        <Button
                            onClick={handleUpdateCategory}
                            disabled={isCreating || !categorieName.trim() || (categorieName.trim() === name.trim() && categoryDescription.trim() === description.trim())}
                            className="w-full"
                        >
                            {isCreating ? <Loader className='size-4 animate-spin' /> : "Mettre à jour la catégorie"}
                        </Button>
                    </div>
                </CredenzaBody>
            </CredenzaContent>
        </Credenza>
    )
}

export default EditCategoryForm