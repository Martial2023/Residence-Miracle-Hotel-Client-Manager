'use client'
import { Card } from '@/components/ui/card'
import { Product } from '@/lib/types'
import React from 'react'
import Image from 'next/image'
import { Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'


type Props = {
    product: Product
    handleRemoveProduct: (productId: string) => void
    handleAddProduct: (product: Product) => void
    orderProducts: { productId: string; quantity: number }[]
    handleQuantityChange: (productId: string, quantity: number) => void
}

const ProductCard = ({ product, handleRemoveProduct, handleAddProduct, orderProducts, handleQuantityChange }: Props) => {
    const [quantity, setQuantity] = React.useState<number>(1)
    const [isAdded, setIsAdded] = React.useState<boolean>(false)
    const orderProduct = orderProducts.find((p) => p.productId === product.id)

    const handleQuantityUpdate = (newQuantity: number) => {
        if (newQuantity >= 0 && newQuantity <= product.stock) {
            setQuantity(newQuantity)
            handleQuantityChange(product.id, newQuantity)
        }
    }

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    }

    return (
        <Card key={product.id} className='p-2 hover:shadow-lg transition-shadow grid grid-cols-5 gap-3 dark:bg-zinc-800 cursor-pointer h-32 w-full overflow-hidden'>
            <div className='col-span-2 w-full h-full overflow-hidden'>
                <Image
                    src={product.images[0] || '/images/default-product.png'}
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
                    </div>
                    <p className='text-sm font-medium mt-2 truncate'>Prix: {product.price} {process.env.NEXT_PUBLIC_DEVISE}</p>
                    <p className='text-sm text-gray-500 line-clamp-1 truncate'>{product.description}</p>
                    <p className='text-sm text-gray-500 truncate'>Stock: {product.stock}</p>
                </div>
                {
                    isAdded ? (
                        <div className='mt-2 flex items-center gap-2'>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    handleQuantityUpdate(quantity - 1)
                                    if (quantity <= 1) {
                                        setIsAdded(false)
                                    }
                                }}
                                disabled={quantity <= 0}
                            >
                                <Minus className="size-4" />
                            </Button>
                            <input
                                type="number"
                                className="w-12 text-center border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                                value={quantity}
                                onChange={(e) => handleQuantityUpdate(parseInt(e.target.value) || 0)}
                                min={0}
                                max={product.stock}
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuantityUpdate(quantity + 1)}
                                disabled={quantity >= product.stock}
                            >
                                <Plus className="size-4" />
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="outline"
                            size="sm"
                            className='mt-2'
                            onClick={() => {
                                handleAddProduct(product)
                                setIsAdded(true)
                                setQuantity(1)
                                handleQuantityChange(product.id, 1)
                            }}
                            disabled={quantity < 0 || quantity > product.stock}
                        >
                            Ajouter à votre plat
                        </Button>
                    )
                }
            </div>
        </Card>
    )
}

export default ProductCard