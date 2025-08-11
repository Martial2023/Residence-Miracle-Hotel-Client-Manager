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
import { CreateCategory } from '@/app/actions/actions'
import { Input } from '@/components/ui/input'
import { Loader, SquareStack } from 'lucide-react'
import { Category } from '@/lib/types'
import { Textarea } from '@/components/ui/textarea'


type Props = {
    children: React.ReactNode,
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>,
}
const CreateCategoryForm = ({ children, setCategories }: Props) => {
    const [categoryName, setCategoryName] = useState<string>('');
    const [categoryDescription, setCategoryDescription] = useState<string>('');
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    const handleCreateCategory = async () => {
        try {
            setIsCreating(true)
            const category = await CreateCategory({
                categoryName,
                categoryDescription
            })
            setCategories(prevTables => [...prevTables, category]);
            setCategoryName('');
            setCategoryDescription('');
            toast.success("Categorie créée avec succès");
            setOpen(false);
        } catch (error) {
            toast.error("Erreur lors de la création de la catégorie");
        } finally {
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
                        Créer une Catégorie
                    </CredenzaTitle>
                    <CredenzaDescription>
                        Créer une nouvelle catégorie pour vos produits
                    </CredenzaDescription>
                </CredenzaHeader>
                <CredenzaBody>
                    <div>
                        <Input
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
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
                            onClick={handleCreateCategory}
                            disabled={isCreating || !categoryName.trim()}
                            className="w-full"
                        >
                            {isCreating ? <Loader className='size-4 animate-spin' /> : "Créer la catégorie"}
                        </Button>
                    </div>
                </CredenzaBody>
            </CredenzaContent>
        </Credenza>
    )
}

export default CreateCategoryForm