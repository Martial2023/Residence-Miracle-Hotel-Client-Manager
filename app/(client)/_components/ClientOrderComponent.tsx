'use client'
import React, { useCallback, useState } from 'react'
import {
    Credenza,
    CredenzaBody,
    CredenzaContent,
    CredenzaDescription,
    CredenzaFooter,
    CredenzaHeader,
    CredenzaTitle,
    CredenzaTrigger,
} from "@/components/Credenza"
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Loader, ShoppingBasket, Trash } from 'lucide-react'
import { OrderDetails } from '@/lib/types'
import { launchOrder } from '@/app/actions/statistics'


type Props = {
    children: React.ReactNode,
    clientOrder: OrderDetails,
    tableId: string | null,
    calculateTotalPrice: () => number
    handleQuantityChange: (productId: string, newQuantity: number) => void
    handleRemoveProduct: (productId: string) => void
    isLaunching?: boolean
    setIsLaunching: (isLaunching: boolean) => void
    clientOrders: OrderDetails[]
    setClientOrders: (orders: OrderDetails[]) => void
}

const ClientOrderComponent = ({
    children,
    clientOrder,
    tableId,
    calculateTotalPrice,
    handleQuantityChange,
    handleRemoveProduct,
    setIsLaunching,
    isLaunching,
    setClientOrders,
    clientOrders
}: Props) => {
    const [clientName, setClientName] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);

    const handleLaunchOrder = useCallback(async () => {
        try {
            if (clientOrder.orderItems.length === 0) {
                toast.error("Veuillez ajouter des produits à la commande")
                return
            }
            setIsLaunching(true)
            const params = {
                tableId: clientOrder.tableId || '',
                products: clientOrder?.orderItems.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                    price: item.product.price,
                })),
                productsCount: clientOrder.orderItems.length,
                clientName: clientName || undefined,
            };

            const order = await launchOrder(params)
            toast.success("Commande lancée avec succès")
            setClientOrders([...clientOrders, { ...order, tableName: clientOrder.tableName, clientName: clientName }])
            setOpen(false)

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            localStorage.setItem("clientOrders", JSON.stringify([...clientOrders, { ...order, tableName: clientOrder.tableName, clientName: clientName }]
                .filter((order) => order.status !== "COMPLETED" && new Date(order.createdAt) >= yesterday)
                .map((order) => ({
                    orderId: order.id,
                    createdAt: order.createdAt,
                    status: order.status
                }))));

            window.location.href = `/menu/${tableId}/client-order`;

        } catch (error) {
            toast.error("Réessayez!! Erreur lors de la création de la commande")
        } finally {
            setIsLaunching(false)
        }
    }, [clientOrder, clientName, clientOrders, tableId, setClientOrders, setIsLaunching, isLaunching])
    return (
        <Credenza open={open} onOpenChange={setOpen}>
            <CredenzaTrigger asChild>
                {children}
            </CredenzaTrigger>
            <CredenzaContent className='dark:bg-zinc-900'>
                <CredenzaHeader>
                    <CredenzaTitle className='flex items-center gap-2 w-full'>
                        <div className='flex items-center gap-4 w-full'>
                            <ShoppingBasket className='size-6 text-primary' />
                            <div className='w-full'>
                                <Input
                                    type="text"
                                    placeholder='Entrez votre nom de client'
                                    className='w-full'
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                />
                            </div>
                        </div>
                    </CredenzaTitle>
                    <CredenzaDescription>
                        {!isLaunching && (
                            <>
                                {clientOrder?.orderItems.length} produits - Total : {calculateTotalPrice().toFixed(2)}{process.env.NEXT_PUBLIC_DEVISE || "FCFA"}
                            </>
                        )}
                    </CredenzaDescription>
                </CredenzaHeader>
                <CredenzaBody className='h-full overflow-y-auto'>
                    <div className="grid flex-1 auto-rows-min gap-2 md:px-4 px-2 overflow-y-auto h-full w-full md:max-h-[70vh]">
                        {clientOrder?.orderItems.map(item => (
                            <div key={item.product.id} className="flex items-center justify-between p-4 border rounded-lg dark:border-zinc-800 dark:bg-zinc-800">
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
                                        max={item.product.maxQuantity}
                                        onChange={(e) => handleQuantityChange(item.product.id, parseInt(e.target.value))}
                                        className="w-16"
                                    />
                                    <Button variant="destructive" onClick={() => handleRemoveProduct(item.product.id)}>
                                        <Trash className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CredenzaBody>
                <CredenzaFooter>
                    <Button
                        onClick={handleLaunchOrder}
                        disabled={isLaunching}
                        className='w-full'
                    >
                        {isLaunching ? <Loader className='w-4 h-4 animate-spin' /> : "Lancer la commande"}
                    </Button>
                </CredenzaFooter>
            </CredenzaContent>
        </Credenza>
    )
}

export default ClientOrderComponent