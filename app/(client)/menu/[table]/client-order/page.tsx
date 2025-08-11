'use client'
import Navbar from '@/app/(client)/_components/Navbar'
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { OrderDetails, OrderStatus } from '@/lib/types'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, HamburgerIcon } from 'lucide-react'
import { getOrderStatusById } from '@/app/actions/statistics'
import MinLoader from '@/components/MinLoader'
import OrderPreparing from "@/components/OrderPreparing"
import OrderPrepared from "@/components/OrderPrepared"

const page = () => {
    const params = useParams();
    const table = params.table;
    const tableId = typeof table === 'string' ? table : null;
    const [latestOrderId, setLatestOrderId] = useState<string | null>(null);
    const [clientOrderStatus, setClientOrderStatus] = useState<OrderStatus>();
    const [loading, setLoading] = useState<boolean>(false);
    const [counterRefresh, setCounterRefresh] = useState<number>(10);
    const REFRESH_TIME = process.env.NEXT_PUBLIC_REFRESH_TIME ? parseInt(process.env.NEXT_PUBLIC_REFRESH_TIME) : 5;

    // Précharger le son et le garder en mémoire
    const audioRef = useRef<HTMLAudioElement | null>(null);
    useEffect(() => {
        audioRef.current = new Audio("/sounds/client.mp3");
    }, []);

    const playSound = () => {
        audioRef.current?.play().catch(err => {
            console.warn("Le son est bloqué par le navigateur :", err);
        });
    };

    const fetchClientOrdersStatus = async (orderId: string) => {
        try {
            setLoading(true);
            const ordersStatus = await getOrderStatusById(orderId);
            setClientOrderStatus(ordersStatus);

            if (ordersStatus === "COMPLETED") {
                const playButton = document.getElementById("play-sound-button");
                if (playButton) {
                    playButton.click();
                }

                const savedOrdersIds = localStorage.getItem("clientOrders");
                if (savedOrdersIds) {
                    let savedOrders = JSON.parse(savedOrdersIds);
                    savedOrders = savedOrders.map((order: { orderId: string, status: OrderStatus }) =>
                        order.orderId === orderId ? { ...order, status: "COMPLETED" } : order
                    );
                    localStorage.setItem("clientOrders", JSON.stringify(savedOrders));
                }
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des commandes du client", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            const savedOrdersIds = localStorage.getItem("clientOrders");
            if (savedOrdersIds) {
                let savedOrders = JSON.parse(savedOrdersIds);
                savedOrders.sort((a: { createdAt: Date }, b: { createdAt: Date }) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );

                const latestOrder = savedOrders[0];
                setLatestOrderId(latestOrder?.orderId);

                if (latestOrder && latestOrder.status !== "COMPLETED") {
                    await fetchClientOrdersStatus(latestOrder.orderId);
                } else if (latestOrder?.status === "COMPLETED") {
                    setClientOrderStatus("COMPLETED");
                }
            }
        };
        fetchOrders();
    }, [tableId]);

    useEffect(() => {
        const interval = setInterval(async () => {
            setCounterRefresh((prev) => prev - 1);
            if (counterRefresh <= 1 && clientOrderStatus !== "COMPLETED") {
                setCounterRefresh(REFRESH_TIME);
                if (latestOrderId) {
                    const ordersStatus = await getOrderStatusById(latestOrderId);
                    setClientOrderStatus(ordersStatus);
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [counterRefresh]);
    return (
        <main className='min-h-screen px-2 md:px-4 pb-20'>
            <Navbar />

            <div className='w-full flex items-center justify-center my-20 mb-10'>
                <Link
                    href={`/menu/${tableId}`}
                >
                    <Button>
                        <ArrowLeft className="size-6" /> Menu
                    </Button>
                </Link>

                <Button
                    onClick={() => {
                        if (audioRef.current) {
                            audioRef.current.play();
                        }
                    }}
                    className='hidden'
                    id="play-sound-button"
                >
                    Son
                </Button>
            </div>

            {
                loading ? (
                    <div className='w-full h-full flex items-center justify-center'>
                        <MinLoader />
                    </div>
                ) : clientOrderStatus === "PENDING" ? (
                    <div className='w-full h-full'>
                        <h3 className='text-2xl font-bold text-center'>Cher client, votre commande est en cours de traitement</h3>
                        <p className='text-center text-gray-500'>Veuillez patienter pendant que nous préparons votre commande.</p>

                        <div className='flex items-center justify-center mt-4'>
                            <div className="w-64 h-64">
                                <OrderPreparing />
                            </div>
                        </div>
                    </div>
                ) : clientOrderStatus === "COMPLETED" && (
                    <div className='w-full h-full'>
                        <h3 className='text-2xl font-bold text-center'>Votre commande est prête</h3>
                        <p className='text-center text-gray-500'>Le serveur vous l&apos;apporte dans un instant</p>
                        <p className='text-center text-gray-500'>Merci de votre patience !</p>

                        <div className='flex items-center justify-center mt-4'>
                            <div className="w-64 h-64">
                                <OrderPrepared />
                            </div>
                        </div>

                        <p className="text-center mt-4 text-xl text-gray-500">Bon appétit !</p>
                    </div>
                )
            }

            <div className='w-full flex items-center justify-center my-10'>
                <Link
                    href={`/menu/${tableId}`}
                >
                    <Button>
                        <HamburgerIcon className="size-6" /> Nouvelle commande
                    </Button>
                </Link>
            </div>
        </main>
    )
}

export default page