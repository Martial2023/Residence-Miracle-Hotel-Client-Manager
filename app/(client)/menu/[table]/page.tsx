'use client';
import { useRestaurant } from '@/hooks/useRestaurant';
import { useParams } from 'next/navigation';
import Navbar from '../../_components/Navbar';
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { Input } from 'react-aria-components';
import { Category, OrderDetails, Product } from '@/lib/types';
import { getRestaurantCategories, getRestaurantProducts } from '@/app/actions/actions';
import { toast } from 'sonner';
import { launchOrder } from '@/app/actions/statistics';
import { Button } from '@/components/ui/button';
import MinLoader from '@/components/MinLoader';
import ProductCard from '../../_components/ProductCard';
import ClientOrderComponent from '../../_components/ClientOrderComponent';
import Link from 'next/link';
import { Hamburger } from 'lucide-react';

const page = () => {
  const params = useParams();
  const table = params.table;
  const tableId = typeof table === 'string' ? table : null;
  const { isRestaurantLoading, restaurant } = useRestaurant();
  const [isLaunching, setIsLaunching] = useState<boolean>(false)
  const [restaurantCategories, setRestaurantCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [restaurantProducts, setRestaurantProducts] = useState<Product[]>([])
  const [orderProducts, setOrderProducts] = useState<{ productId: string; quantity: number; price: number }[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [clientOrders, setClientOrders] = useState<OrderDetails[]>([])
  const [isExistingSavedOrders, setIsExistingSavedOrders] = useState<boolean>(false)
  const [isInside, setIsInside] = useState<boolean>(false)
 
  const devise = process.env.NEXT_PUBLIC_DEVISE || 'FCFA'

  const restaurantLat = parseFloat(process.env.NEXT_PUBLIC_LATITUDE || '12.345678')
  const restaurantLng = parseFloat(process.env.NEXT_PUBLIC_LONGITUDE || '12.345678')
  const radius = parseFloat(process.env.NEXT_PUBLIC_RADIUS || '60')

  function getDistanceFromLatLonInM(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  useEffect(()=>{
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        const distance = getDistanceFromLatLonInM(userLat, userLng, restaurantLat, restaurantLng);
        setIsInside(distance <= radius);
      },
      (error) => {
        toast.error("Veuillez autoriser l'accès à votre localisation pour continuer.");
      }
      );
    } else {
      toast.error("La géolocalisation n'est pas prise en charge par votre navigateur.");
    }
  }, [])

  // Generate clientOrder from orderProducts and restaurantProducts
  const clientOrder: OrderDetails = useMemo(() => {
    if (!tableId || orderProducts.length === 0) {
      return {
        id: '',
        tableId: tableId || '',
        tableName: `Table ${tableId}`,
        clientName: null,
        total: 0,
        status: 'PENDING',
        createdAt: new Date(),
        orderItems: []
      }
    }

    const orderItems = orderProducts.map(orderProduct => {
      const product = restaurantProducts.find(p => p.id === orderProduct.productId)
      return {
        id: `${orderProduct.productId}-${Date.now()}`,
        productId: orderProduct.productId,
        quantity: orderProduct.quantity,
        price: orderProduct.price,
        product: {
          id: product?.id || orderProduct.productId,
          name: product?.name || 'Produit inconnu',
          image: product?.images?.[0] || null,
          price: product?.price || orderProduct.price,
          maxQuantity: product?.stock || 0,
        }
      }
    })

    const total = orderProducts.reduce((sum, product) => sum + (product.quantity * product.price), 0)

    return {
      id: `temp-order-${Date.now()}`,
      tableId: tableId,
      tableName: `Table ${tableId}`,
      clientName: null,
      total,
      status: 'PENDING' as const,
      createdAt: new Date(),
      orderItems
    }
  }, [orderProducts, restaurantProducts, tableId])

  const fetchRestaurantCategories = useCallback(async () => {
    try {
      setLoading(true)
      const categories = await getRestaurantCategories();
      setRestaurantCategories(categories)
    } catch (error) {
      toast.error("Erreur lors de la récupération des catégories du restaurant")
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchRestaurantProducts = useCallback(async () => {
    try {
      setLoading(true)
      const products = await getRestaurantProducts()
      setRestaurantProducts(products)
    } catch (error) {
      toast.error("Erreur lors de la récupération des produits du restaurant")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (restaurantProducts.length === 0) {
      fetchRestaurantProducts()
      fetchRestaurantCategories()
      const savedOrders = localStorage.getItem("clientOrders")
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders) as OrderDetails[]
        setClientOrders(parsedOrders)
        setIsExistingSavedOrders(parsedOrders.length > 0)
      }
    }
  }, [fetchRestaurantProducts, fetchRestaurantCategories])

  const handleAddProduct = useCallback((product: Product) => {
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
  }, [])

  const handleRemoveProduct = useCallback((productId: string) => {
    setOrderProducts((prev) =>
      prev
        .map((p) =>
          p.productId === productId
            ? { ...p, quantity: 0 }
            : p
        )
        .filter((p) => p.quantity > 0)
    )
  }, [])

  const handleQuantityChange = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveProduct(productId)
      return
    }

    setOrderProducts((prev) =>
      prev.map((p) =>
        p.productId === productId
          ? { ...p, quantity }
          : p
      )
    )
  }, [handleRemoveProduct])

  const calculateTotalPrice = useCallback(() => {
    return orderProducts.reduce((total, product) => total + product.quantity * product.price, 0)
  }, [orderProducts])


  const filteredProducts = useMemo(() => {
    return selectedCategory
      ? restaurantProducts.filter(product => product.categoryId === selectedCategory)
      : restaurantProducts
  }, [selectedCategory, restaurantProducts])
  return (
    <main className='min-h-screen px-2 md:px-4 pb-20'>
      <Navbar />

      <div className='w-full flex-col flex items-center justify-center mt-20'>
        <Link
          href={`/menu/${tableId}/client-order`}
        >
          <Button>
            <Hamburger className="size-6" /> Votre commande
          </Button>
        </Link>

        <p className="text-center text-2xl font-bold mt-4">Cher client, choisissez vos plats et boissons, puis lancez votre commande.</p>
      </div>

      <div className='w-full flex items-center justify-center my-8'>
        {
          !loading && (
            <div className="flex gap-2 overflow-x-auto">
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
          )
        }
      </div>
      <div className='w-full flex items-center justify-center mb-4'>
        <Input
          className='w-full max-w-md  rounded-full border-gray-300 dark:border-gray-600 focus:border-primary dark:focus:border-primary'
          type='text'
          placeholder={`Rechercher...`}
          disabled={isRestaurantLoading}
        />
      </div>

      <div className='space-y-2 overflow-y-auto h-full w-full md:max-h-[70vh]'>
        {loading ? (
          <div className="flex flex-col justify-center items-center">
            <MinLoader />
            <p className="text-gray-500">Chargement du menu...</p>
          </div>
        ) : (
          <>

            {
              filteredProducts.length === 0 && (
                <div className='flex flex-col items-center justify-center h-96'>
                  <p>Aucun produit trouvé</p>
                  <p>dans "{selectedCategory ? restaurantCategories.find(category => category.id === selectedCategory)?.name : "toutes les catégories"}"</p>
                </div>
              )
            }
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 px-2'>
              {
                filteredProducts.map((product) => {
                  if (product.stock > 0) {
                    return (
                      <ProductCard
                        key={product.id}
                        isInside={isInside}
                        product={product}
                        handleRemoveProduct={handleRemoveProduct}
                        handleAddProduct={handleAddProduct}
                        orderProducts={orderProducts}
                        handleQuantityChange={handleQuantityChange}
                      />
                    )
                  }
                })
              }
            </div>
          </>
        )}
      </div>

      {orderProducts.length > 0 && (
        <div className='mt-16 fixed bottom-0 left-0 right-0 pb-2 p-4 bg-white dark:bg-zinc-900 shadow-md flex items-center justify-center w-full md:mx-4 rounded-full'>
          <ClientOrderComponent
            clientOrder={clientOrder}
            tableId={tableId}
            calculateTotalPrice={calculateTotalPrice}
            handleQuantityChange={handleQuantityChange}
            handleRemoveProduct={handleRemoveProduct}
            isLaunching={isLaunching}
            setIsLaunching={setIsLaunching}
            setClientOrders={setClientOrders}
            clientOrders={clientOrders}
          >
            <Button
              className='w-full max-w-md p-4 rounded-full uppercase'
              id='launch-order-button'
              disabled={isLaunching}
            >
              <span className='text-sm'>Lancer la commande : {calculateTotalPrice().toFixed(2)} {devise}</span>
              {/* <span className='text-sm'></span> */}
            </Button>
          </ClientOrderComponent>
        </div>
      )}
    </main>
  )
}

export default page