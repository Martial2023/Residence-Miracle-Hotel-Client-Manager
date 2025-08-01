'use client'
import React, { useState } from 'react'
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


type Props = {
    children: React.ReactNode,
    clientOrder: OrderDetails,
    calculateTotalPrice: () => number
    handleQuantityChange: (productId: string, newQuantity: number) => void
    handleRemoveProduct: (productId: string) => void
}

const ClientOrderComponent = ({ children, clientOrder, calculateTotalPrice, handleQuantityChange, handleRemoveProduct }: Props) => {
    const [clientName, setClientName] = useState<string>('');
    const [isLaunching, setIsLaunching] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    const handleLaunchOrder = async () => {
        try {
            setIsLaunching(true);
            // const order = await CreateOrder(clientOrder);
            toast.success("Commande lancée avec succès");
        } catch (error) {
            toast.error("Une erreur s'est produite lors du lancement de la commande.");
        } finally {
            setIsLaunching(false);
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
                        <div className='flex items-center gap-4'>
                            <ShoppingBasket className='size-6 text-primary' />
                            <div>
                                <Input
                                    type="text"
                                    placeholder='Votre nom de client'
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
                            <div key={item.product.id} className="flex items-center justify-between p-4 border rounded-lg dark:border-zinc-700">
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
                        {isLaunching ? <Loader size='size-4 animate-spin' /> : "Lancer la commande"}
                    </Button>
                </CredenzaFooter>
            </CredenzaContent>
        </Credenza>
    )
}

export default ClientOrderComponent