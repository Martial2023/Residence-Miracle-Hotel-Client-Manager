'use client'
import React, { useEffect, useState } from 'react'
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
import { getRestaurantCategories, getRestaurantProducts } from '@/app/actions/actions'
import { Loader, ShoppingBasket, Plus, Minus } from 'lucide-react'
import { Category, Product } from '@/lib/types'
import { launchOrder } from '@/app/actions/statistics'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

type Props = {
    children: React.ReactNode
    tableId?: string
}

const AddOrderComponent = ({ children, tableId }: Props) => {
    const [open, setOpen] = useState<boolean>(false)
    const [restaurantProducts, setRestaurantProducts] = useState<Product[]>([])
    const [orderProducts, setOrderProducts] = useState<{ productId: string, quantity: number; price: number }[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [isLaunching, setIsLaunching] = useState<boolean>(false)
    const [restaurantCategories, setRestaurantCategories] = useState<Category[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    const devise = process.env.NEXT_PUBLIC_DEVISE || 'FCFA'

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

    const fetchRestaurantProducts = async () => {
        try {
            setLoading(true)
            const products = await getRestaurantProducts()
            setRestaurantProducts(products)
        } catch (error) {
            toast.error("Erreur lors de la récupération des produits du restaurant")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (restaurantProducts.length === 0) {
            fetchRestaurantProducts()
            fetchRestaurantCategories()
        }
    }, [open])

    const handleAddProduct = (product: Product) => {
        setOrderProducts((prev) => {
            const existingProduct = prev.find((p) => p.productId === product.id)
            if (existingProduct) {
                return prev.map((p) =>
                    p.productId === product.id
                        ? { ...p, quantity: p.quantity + 1 }
                        : p
                )
            }
            return [...prev, { productId: product.id, quantity: 1, price: product.price }]
        })
    }

    const handleRemoveProduct = (productId: string) => {
        setOrderProducts((prev) =>
            prev
                .map((p) =>
                    p.productId === productId
                        ? { ...p, quantity: p.quantity - 1 }
                        : p
                )
                .filter((p) => p.quantity > 0)
        )
    }

    const handleQuantityChange = (productId: string, quantity: number) => {
        setOrderProducts((prev) =>
            prev.map((p) =>
                p.productId === productId
                    ? { ...p, quantity: Math.max(0, quantity) }
                    : p
            ).filter((p) => p.quantity > 0)
        )
    }

    const calculateTotalPrice = () => {
        return orderProducts.reduce((total, product) => total + product.quantity * product.price, 0)
    }

    const handleLaunchOrder = async () => {
        try {
            if (orderProducts.length === 0) {
                toast.error("Veuillez ajouter des produits à la commande")
                return
            }
            setIsLaunching(true)
            await launchOrder({
                tableId: tableId || '',
                products: orderProducts
            })
            toast.success("Commande lancée avec succès")
            setOpen(false)
            setOrderProducts([])
        } catch (error) {
            toast.error("Réessayez!! Erreur lors de la création de la commande")
        } finally {
            setIsLaunching(false)
        }
    }

    const filteredProducts = selectedCategory
        ? restaurantProducts.filter(product => product.categoryId === selectedCategory)
        : restaurantProducts

    return (
        <Credenza open={open} onOpenChange={setOpen}>
            <CredenzaTrigger asChild>
                {children}
            </CredenzaTrigger>
            <CredenzaContent className='dark:bg-zinc-900'>
                <CredenzaHeader>
                    <CredenzaTitle className='flex items-center gap-2'>
                        <ShoppingBasket className='size-5 inline-block' />
                        <span>Créer une commande</span>
                    </CredenzaTitle>
                    <div className="flex max-w-2xl gap-2 overflow-x-scroll">
                        <Button
                            variant={selectedCategory === null ? "default" : "outline"}
                            size={"sm"}
                            onClick={() => setSelectedCategory(null)}
                        >
                            Tous
                        </Button>
                        {restaurantCategories.map((category) => (
                            <Button
                                key={category.id}
                                size={"sm"}
                                variant={selectedCategory === category.id ? "default" : "outline"}
                                onClick={() => setSelectedCategory(category.id)}
                            >
                                {category.name}
                            </Button>
                        ))}
                    </div>
                </CredenzaHeader>
                <CredenzaBody className='h-full overflow-y-auto'>
                    <div className='space-y-2 overflow-y-auto h-full w-full md:max-h-[70vh]'>
                        {loading ? (
                            <div className="flex justify-center items-center">
                                <Loader className="size-6 animate-spin" />
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 gap-4 px-2'>
                                {
                                    filteredProducts.length === 0 && (
                                        <div className='flex flex-col items-center justify-center h-96'>
                                            <p>Aucun produit trouvé</p>
                                            <p>dans "{selectedCategory ? restaurantCategories.find(category => category.id === selectedCategory)?.name : "toutes les catégories"}"</p>
                                        </div>
                                    )
                                }
                                {
                                    filteredProducts.map((product) => (
                                        <Card key={product.id} className='p-2 hover:shadow-lg transition-shadow grid grid-cols-5 gap-3 dark:bg-zinc-800 cursor-pointer h-32 w-full overflow-hidden'>
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
                                                                    <ShoppingBasket className="size-4 text-white" />
                                                                    Non disponible
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant="outline">
                                                                    <ShoppingBasket className="size-4 text-green-500" />
                                                                    Disponible
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className='text-sm font-medium mt-2 truncate'>Prix: {product.price} {process.env.NEXT_PUBLIC_DEVISE}</p>
                                                    <p className='text-sm text-gray-500 line-clamp-1 truncate'>{product.description}</p>
                                                    <p className='text-sm text-gray-500 truncate'>Stock: {product.stock}</p>
                                                </div>
                                                {
                                                    product.stock > 0 && (
                                                        <div className='mt-2 flex items-center gap-2'>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleRemoveProduct(product.id)}
                                                                disabled={!orderProducts.find((p) => p.productId === product.id)}
                                                            >
                                                                <Minus className="size-4" />
                                                            </Button>
                                                            <input
                                                                type="number"
                                                                className="w-12 text-center border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                                                                value={orderProducts.find((p) => p.productId === product.id)?.quantity || 0}
                                                                onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 0)}
                                                                min={0}
                                                                max={product.stock}
                                                            />
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleAddProduct(product)}
                                                            >
                                                                <Plus className="size-4" />
                                                            </Button>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </Card>
                                    ))
                                }
                            </div>
                        )}
                        <div className="mt-4 p-4 border-t dark:border-zinc-700" id="order-summary">
                            <h4 className="font-semibold">Résumé de la commande</h4>
                            <ul className="space-y-2">
                                {orderProducts.map((product) => {
                                    const productDetails = restaurantProducts.find((p) => p.id === product.productId)
                                    return (
                                        <li key={product.productId} className="flex justify-between">
                                            <span>{productDetails?.name} x {product.quantity}</span>
                                            <span>{(product.quantity * product.price).toFixed(2)} {devise}</span>
                                        </li>
                                    )
                                })}
                            </ul>
                            <div className="mt-2 font-bold text-lg">
                                Total : {calculateTotalPrice().toFixed(2)} {devise}
                            </div>
                        </div>
                    </div>
                </CredenzaBody>
                <CredenzaFooter>
                    <Button
                        onClick={handleLaunchOrder}
                        disabled={orderProducts.length === 0 || loading || isLaunching}
                        className="w-full"
                    >
                        {isLaunching ? <Loader className='size-4 animate-spin' /> : "Lancer la commande"}
                    </Button>
                </CredenzaFooter>
            </CredenzaContent>
        </Credenza>
    )
}

export default AddOrderComponent