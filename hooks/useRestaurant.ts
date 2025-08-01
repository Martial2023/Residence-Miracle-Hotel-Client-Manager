'use client'

import { fetchRestaurant } from "@/app/actions/actions";
import { Restaurant } from "@/lib/types";
import { useEffect, useState } from "react";

export function useRestaurant() {
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [isRestaurantLoading, setIsRestaurantLoading] = useState<boolean>(true);
    
    useEffect(() => {
        const getExistingRestaurant = async () => {
            setIsRestaurantLoading(true);
            try {
                const restaurant = await fetchRestaurant();
                setRestaurant(restaurant);
            } catch (error) {
                console.error("Erreur lors de la récupération du restaurant");
            }finally{
                setIsRestaurantLoading(false);
            }
        };
        getExistingRestaurant();
    }, []);
    return { isRestaurantLoading, restaurant };
}