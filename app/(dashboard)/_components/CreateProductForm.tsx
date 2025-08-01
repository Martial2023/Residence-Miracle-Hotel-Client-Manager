'use client'
import React, { useState } from 'react'
import {
    Credenza,
    CredenzaBody,
    CredenzaContent,
    CredenzaFooter,
    CredenzaHeader,
    CredenzaTitle,
    CredenzaTrigger,
} from "@/components/Credenza"
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { CreateProduct } from '@/app/actions/actions'
import { Input } from '@/components/ui/input'
import { Loader, ShoppingBasket } from 'lucide-react'
import { Product } from '@/lib/types'
import { Textarea } from '@/components/ui/textarea'
import ImageUploaderComponent from '@/components/ImageUploaderComponent'
import NumberInput from '@/components/NumberInput'
import PriceInput from '@/components/PriceInput'
import { Label } from '@/components/ui/label'
import { generateReactHelpers } from '@uploadthing/react';
import SelectCategoryComponent from './SelectCategoryComponent'

const { uploadFiles } = generateReactHelpers();

type Props = {
    children: React.ReactNode,
    setRestaurantProducts: React.Dispatch<React.SetStateAction<Product[]>>,
}
const CreateProductForm = ({ children, setRestaurantProducts }: Props) => {
    const [productName, setProductName] = useState<string>('');
    const [productDescription, setProductDescription] = useState<string>('');
    const [price, setPrice] = useState<number>(0);
    const [categoryId, setCategoryId] = useState<string>('');
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const [stock, setStock] = useState<number>(0);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);


    const handleCreateProduct = async () => {
        try {
            setIsCreating(true)

            let imageUrls: string[] = [];
            if (mediaFiles.length > 0) {
                const uploadedFiles = await uploadFiles('image', { files: mediaFiles });
                imageUrls = uploadedFiles.map(file => file.ufsUrl);
            }
            const product = await CreateProduct({
                categoryId,
                name: productName,
                description: productDescription,
                price,
                images: imageUrls,
                stock
            })
            setRestaurantProducts(prev => [...prev, product]);
            setCategoryId('');
            setProductName('');
            setProductDescription('');
            setPrice(0);
            setMediaFiles([]);
            setStock(0);
            toast.success("Produit créé avec succès");
            setOpen(false);
        } catch (error) {
            toast.error("Erreur lors de la création du produit");
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
                        <ShoppingBasket className='size-5 inline-block' />
                        Créer un produit
                    </CredenzaTitle>
                </CredenzaHeader>
                <CredenzaBody className='h-full overflow-y-auto'>
                    <div className='space-y-4 overflow-y-auto w-full md:max-h-[75vh]'>
                        <Input
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            placeholder="Nom du produit"
                            className="mb-4"
                        />

                        <SelectCategoryComponent
                            categoryId={categoryId}
                            setCategoryId={setCategoryId}
                        />

                        <Textarea
                            value={productDescription}
                            onChange={(e) => setProductDescription(e.target.value)}
                            placeholder="Description du produit"
                            className="mb-4 resize-none"
                        />

                        <div className='w-full flex flex-col gap-2 md:flex-row'>
                            <PriceInput
                                label="Prix unitaire"
                                defaultValue={price}
                                minValue={0}
                                setValue={setPrice}
                            />

                            <NumberInput
                                label="Quantité en stock"
                                defaultValue={stock}
                                minValue={0}
                                setValue={setStock}
                            />
                        </div>

                        <div>
                            <Label>Images du produit</Label>
                            <ImageUploaderComponent setMediaFiles={setMediaFiles} />
                        </div>


                    </div>
                </CredenzaBody>
                <CredenzaFooter>
                    <Button
                        onClick={handleCreateProduct}
                        disabled={isCreating || !productName.trim() || price <= 0 || stock < 0}
                        className="w-full"
                    >
                        {isCreating ? <Loader className='size-4 animate-spin' /> : "Créer le produit"}
                    </Button>
                </CredenzaFooter>
            </CredenzaContent>
        </Credenza >
    )
}

export default CreateProductForm