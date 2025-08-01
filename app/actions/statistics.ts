'use server'
import { Category, FirstStatTypes, OrderDetails, OrderProps, OrdersCategoriesData, PeriodTypes, Product, Restaurant, Table } from '@/lib/types';
import { prisma } from '../../lib/prisma';
import { getUser } from '@/lib/auth-session';
import { totalmem } from 'os';
import { startOfDay, endOfDay, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { OrderStatus } from '@prisma/client';
import { table } from 'console';


const getBoundaries = (period: PeriodTypes) => {
    const now = new Date();
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    switch (period) {
        case 'TODAY':
            startDate = startOfDay(now);
            endDate = endOfDay(now);
            break;
        case 'YESTERDAY':
            startDate = startOfDay(subDays(now, 1));
            endDate = endOfDay(subDays(now, 1));
            break;
        case 'LAST_7_DAYS':
            startDate = startOfDay(subDays(now, 7));
            endDate = endOfDay(now);
            break;
        case 'LAST_30_DAYS':
            startDate = startOfDay(subDays(now, 30));
            endDate = endOfDay(now);
            break;
        case 'LAST_90_DAYS':
            startDate = startOfDay(subDays(now, 90));
            endDate = endOfDay(now);
            break;
        case 'LAST_365_DAYS':
            startDate = startOfDay(subDays(now, 365));
            endDate = endOfDay(now);
            break;
        case 'ALL_TIME':
            startDate = undefined;
            endDate = undefined;
            break;
        default:
            throw new Error('Invalid period type');
    }

    return { startDate, endDate };
}

export async function getFirstStatistic(period: PeriodTypes): Promise<FirstStatTypes> {
    try {
        const user = await getUser();
        if (!user) {
            throw new Error('User not found');
        }

        const { startDate, endDate } = getBoundaries(period);

        const restaurant = await prisma.restaurant.findFirst({
            select: {
                id: true,
                name: true,
                tables: {
                    select: {
                        Orders: {
                            where: startDate && endDate ? {
                                createdAt: {
                                    gte: startDate,
                                    lte: endDate,
                                }
                            } : undefined
                        }
                    }
                },
                products: {
                    select: {
                        id: true,
                    }
                }
            }
        }); // Removed timeout argument

        if (!restaurant) {
            throw new Error('Restaurant not found');
        }

        const data = {
            totalOrders: restaurant.tables.reduce((acc, table) => acc + table.Orders.length, 0),
            CA: restaurant.tables.reduce((acc, table) => {
                return acc + table.Orders.reduce((sum, order) => sum + (order.total !== null && order.total !== undefined ? order.total : 0), 0);
            }, 0),
            totalCustomers: restaurant.tables.reduce((acc, table) => acc + table.Orders.length, 0),
            totalProducts: restaurant.products.length
        };

        return data;
    } catch (error) {
        console.error('Error fetching statistics:', error);
        throw new Error('Failed to fetch statistics');
    }
}

export async function getOrdersCategoriesData(period: PeriodTypes): Promise<OrdersCategoriesData> {
    try {
        const user = await getUser();
        if (!user) {
            throw new Error('User not found');
        }

        const { startDate, endDate } = getBoundaries(period);

        const categories = await prisma.category.findMany({
            where: {
                products: {
                    some: {
                        orderItems: {
                            some: {
                                createdAt: {
                                    gte: startDate,
                                    lte: endDate,
                                }
                            }
                        }
                    }
                }
            },
            select: {
                id: true,
                name: true,
                products: {
                    select: {
                        id: true,
                        name: true,
                        orderItems: {
                            where: startDate && endDate ? {
                                createdAt: {
                                    gte: startDate,
                                    lte: endDate,
                                }
                            } : undefined
                        }
                    }
                }
            }
        });

        const response = {
            categoriesData: categories.map(category => ({
                id: category.name,
                label: category.name,
                value: category.products.reduce((acc, product) => {
                    return acc + product.orderItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
                }, 0)
            })),

            ordersData: categories.flatMap(category =>
                category.products.map(product => ({
                    id: product.name,
                    label: product.name,
                    value: product.orderItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
                }))
            )
        };

        console.log('Orders Categories Data:', response);

        return response
    } catch (error) {
        console.error('Error fetching orders categories data:', error);
        throw new Error('Failed to fetch orders categories data');
    }
}


/* Orders */
export async function getOrders(period: PeriodTypes): Promise<OrderProps[]> {
    try {
        const user = await getUser();
        if (!user) {
            throw new Error('User not found');
        }

        const { startDate, endDate } = getBoundaries(period);

        const orders = await prisma.order.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                }
            },
            select: {
                id: true,
                tableId: true,
                total: true,
                clientName: true,
                updatedAt: true,
                status: true,
                table: {
                    select: {
                        name: true
                    }
                }
            }
        });

        return orders.map(order => ({
            id: order.id,
            tableId: order.tableId,
            tableName: order.table?.name,
            clientName: order.clientName,
            total: order.total,
            status: order.status,
            updatedAt: order.updatedAt,
        }));
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw new Error('Failed to fetch orders');
    }
}

export async function getOrderDetails(orderId: string): Promise<OrderDetails> {
    try {
        const user = await getUser();
        if (!user) {
            throw new Error('User not found');
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                table: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!order) {
            throw new Error('Order not found');
        }

        return {
            id: order.id,
            tableId: order.table?.id || '',
            tableName: order.table?.name || '',
            clientName: order.clientName,
            total: order.total,
            status: order.status,
            updatedAt: order.updatedAt,
            orderItems: order.orderItems.map(orderItem => ({
                id: orderItem.id,
                productId: orderItem.product.id,
                quantity: orderItem.quantity,
                price: orderItem.price,
                product: {
                    id: orderItem.product.id,
                    name: orderItem.product.name,
                    price: orderItem.product.price,
                    image: orderItem.product.images[0] || null,
                },
            })),
        };
    } catch (error) {
        console.error('Error fetching order details:', error);
        throw new Error('Failed to fetch order details');
    }
}

type ValidateOrderProps = {
    orderId: string;
    orderItems: {
        productId: string;
        quantity: number;
    }[];
}
export async function validateOrder({ orderId, orderItems }: ValidateOrderProps): Promise<{ validate: boolean }> {
    try {
        const user = await getUser();
        if (!user) {
            throw new Error('User not found');
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!order) {
            throw new Error('Order not found');
        }

        // Prepare updated order items and calculate stock adjustments
        const stockAdjustments: { productId: string; adjustment: number }[] = [];
        const updatedOrderItems = orderItems.map(item => {
            const existingItem = order.orderItems.find(oi => oi.product.id === item.productId);
            const existingQuantity = existingItem ? existingItem.quantity : 0;
            const adjustment = item.quantity - existingQuantity;

            if (adjustment !== 0) {
                stockAdjustments.push({ productId: item.productId, adjustment });
            }

            return {
                productId: item.productId,
                quantity: item.quantity,
                price: existingItem ? existingItem.product.price : 0, // Use existing price if available
            };
        });

        // Validate stock availability
        for (const adjustment of stockAdjustments) {
            const product = await prisma.product.findUnique({
                where: { id: adjustment.productId },
                select: { stock: true },
            });

            if (!product) {
                throw new Error(`Product with ID ${adjustment.productId} not found`);
            }

            if (product.stock + adjustment.adjustment < 0) {
                throw new Error(`Insufficient stock for product with ID ${adjustment.productId}`);
            }
        }

        // Update order and stock
        await prisma.$transaction(async (prisma) => {
            // Update order
            await prisma.order.update({
                where: { id: orderId },
                data: {
                    status: 'COMPLETED',
                    orderItems: {
                        deleteMany: {}, // Clear existing items
                        create: updatedOrderItems, // Add updated items
                    },
                    total: updatedOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                },
            });

            // Update stock
            for (const adjustment of stockAdjustments) {
                await prisma.product.update({
                    where: { id: adjustment.productId },
                    data: {
                        stock: {
                            increment: adjustment.adjustment, // Adjust stock
                        },
                    },
                });
            }
        });

        return { validate: true };
    } catch (error) {
        console.error('Error validating order:', error);
        throw new Error('Failed to validate order');
    }
}

type LaunchOrderProps = {
    tableId: string;
    clientName?: string;
    products: { 
        productId: string; 
        quantity: number;
        price: number
    }[];
};

export async function launchOrder({ tableId, clientName, products }: LaunchOrderProps) {
    try {
        if(!tableId) {
            let table = await prisma.table.findFirst({
                where: { name: process.env.DEFAULT_TABLE_NAME || "Générale" },
            })
            if (!table) {
                const restaurant = await prisma.restaurant.findFirst();
                if (!restaurant) {
                    throw new Error('Restaurant not found');
                }
                table = await prisma.table.create({
                    data: {
                        name: process.env.DEFAULT_TABLE_NAME || "Générale",
                        restaurant: { connect: { id: restaurant.id } },
                    },
                });
            }
            tableId = table.id
        }
        // Validate stock availability for each product
        for (const item of products) {
            const product = await prisma.product.findUnique({
                where: { id: item.productId },
                select: { stock: true },
            });

            if (!product) {
                throw new Error(`Product with ID ${item.productId} not found`);
            }

            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for product with ID ${item.productId}`);
            }
        }

        // Create the order and adjust stock in a transaction
        const order = await prisma.$transaction(async (prisma) => {
            // Create the order
            const newOrder = await prisma.order.create({
                data: {
                    clientName: clientName || "Client",
                    status: "PENDING",
                    table: { connect: { id: tableId } },
                    orderItems: {
                        create: products.map(item => ({
                            product: { connect: { id: item.productId } },
                            quantity: item.quantity,
                            price: item.price,
                        })),
                    },
                    total: products.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                },
                include: {
                    orderItems: {
                        include: {
                            product: true,
                        },
                    },
                },
            });

            // Update the price for each order item and adjust stock
            for (const orderItem of newOrder.orderItems) {
                await prisma.product.update({
                    where: { id: orderItem.productId },
                    data: {
                        stock: {
                            decrement: orderItem.quantity,
                        },
                    },
                });
            }

            return newOrder;
        });

        return order;
    } catch (error) {
        console.error('Error launching order:', error);
        throw new Error('Failed to launch order');
    }
}