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
import { getOrderDetails, validateOrder } from '@/app/actions/statistics'
import { OrderDetails } from '@/lib/types'
import { Check, Loader, ShoppingBasket, Trash } from 'lucide-react'
import { Input } from '@/components/ui/input'
import MinLoader from '@/components/MinLoader'

type Props = {
    children: React.ReactNode
    orderId: string
    clientName: string
    newValidate?: boolean
    setNewValidate?: (value: boolean) => void
}

export function ShowOrderDetails({ children, orderId, clientName, newValidate, setNewValidate }: Props) {
    const [open, setOpen] = React.useState(false)
    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [validating, setValidating] = useState<boolean>(false)

    const fetchOrderDetails = async () => {
        try {
            setLoading(true)
            if (!orderId) {
                toast.error("Commande manquante")
                return
            }
            const response = await getOrderDetails(orderId)
            setOrderDetails(response)
        } catch (error) {
            toast.error("Erreur lors de la récupération des détails de la commande")
        } finally {
            setLoading(false)
        }
    }

    const handleQuantityChange = (productId: string, newQuantity: number) => {
        if (!orderDetails) return
        const updatedItems = orderDetails.orderItems.map(item =>
            item.product.id === productId
                ? { ...item, quantity: newQuantity }
                : item
        )
        setOrderDetails({ ...orderDetails, orderItems: updatedItems })
    }

    const handleRemoveProduct = (productId: string) => {
        if (!orderDetails) return
        const updatedItems = orderDetails.orderItems.filter(item => item.product.id !== productId)
        setOrderDetails({ ...orderDetails, orderItems: updatedItems })
    }

    const calculateTotalPrice = () => {
        if (!orderDetails) return 0
        return orderDetails.orderItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
    }

    const handleValidateOrder = async () => {
        try {
            setValidating(true)
            if (!orderDetails) {
                toast.error("Aucun détail de commande disponible")
                return
            }
            const isValidated = await validateOrder({
                orderId: orderDetails.id,
                orderItems: orderDetails.orderItems.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                    price: item.product.price
                })),
            })
            if (isValidated) {
                toast.success("Commande validée avec succès")
                setNewValidate && setNewValidate(!newValidate)
                setOpen(false)
                setOrderDetails(null)
            } else {
                toast.error("Échec de la validation de la commande")
            }
        } catch (error) {
            toast.error("Erreur lors de la validation de la commande")
        } finally {
            setValidating(false)
        }
    }

    useEffect(() => {
        if (open && !orderDetails) {
            fetchOrderDetails()
        }
    }, [open, orderId])

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent className='dark:bg-zinc-900 w-8/10'>
                <SheetHeader>
                    <SheetTitle>
                        <div className='flex items-center gap-4'>
                            <ShoppingBasket className='size-6 text-primary' />
                            <div>
                                <h5 className='text-xl font-semibold text-primary'>{clientName}</h5>
                            </div>
                        </div>
                    </SheetTitle>
                    <SheetDescription>
                        {!loading && (
                            <>
                                {orderDetails?.orderItems.length} produits - Total : {calculateTotalPrice().toFixed(2)}{process.env.NEXT_PUBLIC_DEVISE || "FCFA"}
                            </>
                        )}
                    </SheetDescription>
                </SheetHeader>
                <div className="grid flex-1 auto-rows-min gap-2 md:px-4 px-2 overflow-y-auto">
                    {loading && (
                        <div className='flex flex-col items-center justify-center h-96'>
                            <MinLoader />
                            <p>Chargement...</p>
                        </div>
                    )}
                    {!loading && orderDetails?.orderItems.length === 0 && (
                        <div className='flex flex-col items-center justify-center h-96'>
                            <p className='text-gray-500'>Aucun produit trouvé</p>
                        </div>
                    )}
                    {!loading && orderDetails?.orderItems.map(item => (
                        <div key={item.product.id} className="flex items-center justify-between p-2 border rounded-lg dark:border-zinc-700">
                            <div className="flex items-center gap-4">
                                <img src={item.product.image ?? ''} alt={item.product.name} className="w-16 h-16 rounded-lg object-cover" />
                                <div>
                                    <h5 className="font-semibold">{item.product.name}</h5>
                                    <p className="text-sm text-gray-500">{item.product.price.toFixed(2)} {process.env.NEXT_PUBLIC_DEVISE || "FCFA"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(item.product.id, parseInt(e.target.value))}
                                    className="w-16"
                                />
                                <Button variant="destructive" size={"sm"} onClick={() => handleRemoveProduct(item.product.id)}>
                                    <Trash className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                <SheetFooter>
                    <div className='flex flex-cols md:flex-rows items-center justify-between gap-2 w-full'>
                        {/* <Button variant={"outline"} className='flex-1'>
                            Ajouter un produit
                        </Button> */}

                        {
                            orderDetails?.status !== "COMPLETED" && (
                                <Button className='bg-green-400 hover:bg-green-500 flex-1'
                                    onClick={handleValidateOrder} 
                                    disabled={loading}
                                >
                                    {validating ? <Loader className="w-4 h-4 animate-spin" /> : <><Check className='w-5 h-5' /> Valider la commande</>}
                                </Button>
                            )
                        }
                    </div>
                    <SheetClose asChild>
                        <Button variant="outline">Fermer</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
