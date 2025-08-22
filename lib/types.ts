
export interface Restaurant {
    id: string;
    name: string;
    address?: string | null;
    phone?: string | null;
    email: string[];
    website?: string | null;
    logo?: string | null;
    description?: string | null;
    geoLongitude?: number | null;
    geoLatitude?: number | null;
    sendReportsClock?: Date | null;
    radius?: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Table {
    id: string;
    name: string;
    restaurantId: string;
    numberOfOrders?: number;
    totalPrice?: number;
    createdAt: Date;
    updatedAt: Date;
}


export interface Category {
    id: string;
    name: string;
    description?: string | null;
    numberOfProducts?: number;
    restaurantId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Product {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    images: string[];
    stock: number;
    outOfStock: number;
    sold: number;
    categoryId: string;
    restaurantId: string;
    updatedAt: Date;
}

export type PeriodTypes = "TODAY" | "ALL_TIME" | "YESTERDAY" | "LAST_7_DAYS" | "LAST_30_DAYS" | "LAST_90_DAYS" | "LAST_365_DAYS";

export interface FirstStatTypes {
    totalOrders: number,
    CA: number,
    totalCustomers: number,
    totalProducts: number
}

export interface OrdersCategoriesData {
    categoriesData: {
        id: string;
        label: string;
        value: number;
    }[],
    ordersData: {
        id: string;
        label: string;
        chartLabel?: string;
        value: number;
    }[]
}


/* Oder Types */
export interface FirstOrdersStatTypes {
    totalOrders: number,
    completedOrders: number,
    pendingOrders: number,
}

export type OrderStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED"


export interface OrderProps {
    id: string;
    tableId: string;
    tableName: string;
    clientName?: string | null;
    total: number | null;
    status: OrderStatus;
    updatedAt?: Date;
    createdAt: Date;
}

export interface OrderItemProps {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    product: {
        id: string;
        name: string;
        image?: string | null;
        price: number;
        maxQuantity?: number;
    }
}

export interface OrderDetails extends OrderProps {
    orderItems: OrderItemProps[];
}