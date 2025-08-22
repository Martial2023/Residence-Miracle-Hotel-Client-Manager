'use server'
import { FirstStatTypes, OrderDetails, OrderProps, OrdersCategoriesData, PeriodTypes } from '@/lib/types';
import { prisma } from '../../lib/prisma';
import { getUser } from '@/lib/auth-session';
import { getBoundaries } from '@/lib/getBoudaries';




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
                createdAt: true,
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
            createdAt: order.createdAt
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
            createdAt: order.createdAt,
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
        //Validation des paramètres
        if (!products || !Array.isArray(products) || products.length === 0) {
            throw new Error("Aucun produit valide fourni pour la commande");
        }

        //Vérifier ou créer la table
        if (!tableId) {
            let table = await prisma.table.findFirst({
                where: { name: process.env.DEFAULT_TABLE_NAME || "Générale" },
            });

            if (!table) {
                const restaurant = await prisma.restaurant.findFirst();
                if (!restaurant) throw new Error("Restaurant introuvable");

                table = await prisma.table.create({
                    data: {
                        name: process.env.DEFAULT_TABLE_NAME || "Générale",
                        restaurant: { connect: { id: restaurant.id } },
                    },
                });
            }
            tableId = table.id;
        }

        //Vérifier stock (en dehors de la transaction)
        const productIds = products.map(p => p.productId);
        const stockData = await prisma.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true, stock: true }
        });

        for (const item of products) {
            const product = stockData.find(p => p.id === item.productId);
            if (!product) throw new Error(`Produit introuvable: ${item.productId}`);
            if (product.stock < item.quantity) {
                throw new Error(`Stock insuffisant pour le produit: ${item.productId}`);
            }
        }

        //Transaction atomique (non interactive) pour éviter P2028
        const totalPrice = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

        const [newOrder] = await prisma.$transaction([
            prisma.order.create({
                data: {
                    clientName: clientName || "Client",
                    status: "PENDING",
                    table: { connect: { id: tableId } },
                    total: totalPrice,
                    orderItems: {
                        create: products.map(item => ({
                            product: { connect: { id: item.productId } },
                            quantity: item.quantity,
                            price: item.price,
                        })),
                    },
                },
                include: {
                    orderItems: { include: { product: true } },
                },
            }),
            ...products.map(item =>
                prisma.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } },
                })
            )
        ]);

        return newOrder;

    } catch (error: any) {
        console.error("Error launching order:", error);
        throw new Error(error.message || "Impossible de créer la commande");
    }
}

export async function getOrderStatusById(orderId: string) {
    try {
        const orderStatus = await prisma.order.findFirst({
            where: {
                id: orderId,
            }
        })

        return orderStatus?.status
    } catch (error) {
        console.error('Error fetching order statuses:', error);
        throw new Error('Failed to fetch order statuses');
    }
}