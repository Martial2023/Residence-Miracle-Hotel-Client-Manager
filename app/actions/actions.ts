'use server'
import { Category, Product, Restaurant, Table } from '@/lib/types';
import { prisma } from '../../lib/prisma';
import { getUser } from '@/lib/auth-session';

export async function fetchRestaurant(): Promise<Restaurant | null> {
  try {
    const restaurant = await prisma.restaurant.findFirst();
    return restaurant;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    throw new Error("Failed to fetch restaurants");
  }
}

type CreateRestaurantParams = {
  name: string;
  address?: string | null;
  phone?: string | null;
  email: string[];
  website?: string | null;
  logoUrl?: string | null;
}
export async function createRestaurant({ name, address, phone, email, website, logoUrl }: CreateRestaurantParams): Promise<string> {
  try {
    const connectedUser = await getUser();
    if (!connectedUser || !connectedUser.id) {
      throw new Error("User not authenticated");
    }

    const existingRestaurant = await prisma.restaurant.findFirst();
    if (existingRestaurant) {
      return existingRestaurant.id;
    }

    const newRestaurant = await prisma.restaurant.create({
      data: {
        name,
        address: address || '',
        phone: phone || null,
        email: email || [],
        website: website || null,
        logo: logoUrl || null,
      }
    });
    await prisma.table.create({
      data: {
        name: process.env.NEXT_PUBLIC_DEFAULT_TABLE || "Générale",
        restaurantId: newRestaurant.id,
      }
    });
    return newRestaurant.id;
  } catch (error) {
    console.error("Error creating restaurant:", error);
    throw new Error("Failed to create restaurant");
  }
}

type RestaurantTablesParams = {
  start?: Date | null;
  end?: Date | null;
};

export async function getRestaurantTables({ start, end }: RestaurantTablesParams): Promise<Table[]> {
  try {
    const connectedUser = await getUser();
    if (!connectedUser || !connectedUser.id) {
      throw new Error("User not authenticated");
    }

    const userRestaurant = await prisma.restaurant.findFirst();
    if (!userRestaurant) {
      throw new Error("Restaurant not found");
    }

    const tables = await prisma.table.findMany({
      where: { restaurantId: userRestaurant.id },
      include: {
        orderItems: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return tables.map(table => {
      const filteredOrderItems = table.orderItems.filter(orderItem => {
        const orderDate = orderItem.createdAt;
        if (start && end) {
          return orderDate >= start && orderDate <= end;
        } else if (start) {
          return orderDate >= start;
        } else if (end) {
          return orderDate <= end;
        }
        return true; // Include all orderItems if no date filters are provided
      });

      const totalPrice = filteredOrderItems.reduce((sum, orderItem) => sum + orderItem.price, 0);

      return {
        ...table,
        numberOfOrders: filteredOrderItems.length,
        totalPrice
      };
    });
  } catch (error) {
    console.error("Error fetching restaurant tables:", error);
    throw new Error("Failed to fetch restaurant tables");
  }
}

export async function CreateTable({ tableName }: { tableName: string }): Promise<Table> {
  try {
    const connectedUser = await getUser();
    if (!connectedUser || !connectedUser.id) {
      throw new Error("User not authenticated");
    }

    const userRestaurant = await prisma.restaurant.findFirst();
    if (!userRestaurant) {
      throw new Error("Restaurant not found");
    }

    const newTable = await prisma.table.create({
      data: {
        name: tableName,
        restaurantId: userRestaurant.id,
      }
    });

    return {
      ...newTable,
      numberOfOrders: 0,
      totalPrice: 0
    };
  } catch (error) {
    console.error("Error creating table:", error);
    throw new Error("Failed to create table");
  }
}

export async function UpdateTable({ id, name }: { id: string; name: string }): Promise<Table> {
  try {
    const connectedUser = await getUser();
    if (!connectedUser || !connectedUser.id) {
      throw new Error("User not authenticated");
    }

    const userRestaurant = await prisma.restaurant.findFirst();
    if (!userRestaurant) {
      throw new Error("Restaurant not found");
    }

    const updatedTable = await prisma.table.update({
      where: { id },
      data: { name },
    });

    return {
      ...updatedTable,
      numberOfOrders: 0,
      totalPrice: 0
    };
  } catch (error) {
    console.error("Error updating table:", error);
    throw new Error("Failed to update table");
  }
}

export async function deleteTable({ id }: { id: string }) {
  try {
    const connectedUser = await getUser();
    if (!connectedUser || !connectedUser.id) {
      throw new Error("User not authenticated");
    }

    const userRestaurant = await prisma.restaurant.findFirst();
    if (!userRestaurant) {
      throw new Error("Restaurant not found");
    }

    await prisma.table.delete({
      where: { id }
    });

    return true;
  } catch (error) {
    console.error("Error deleting table:", error);
    throw new Error("Failed to delete table");
  }
}


export async function CreateCategory({ categoryName, categoryDescription }: { categoryName: string, categoryDescription?: string }) {
  try {
    const connectedUser = await getUser();
    if (!connectedUser || !connectedUser.id) {
      throw new Error("User not authenticated");
    }

    const userRestaurant = await prisma.restaurant.findFirst();
    if (!userRestaurant) {
      throw new Error("Restaurant not found");
    }

    const newCategory = await prisma.category.create({
      data: {
        name: categoryName,
        restaurantId: userRestaurant.id,
        description: categoryDescription || null,
      }
    });

    return newCategory;
  } catch (error) {
    console.error("Error creating category:", error);
    throw new Error("Failed to create category");
  }
}

export async function getRestaurantCategories(): Promise<Category[]> {
  try {
    const connectedUser = await getUser();
    if (!connectedUser || !connectedUser.id) {
      throw new Error("User not authenticated");
    }

    const userRestaurant = await prisma.restaurant.findFirst();
    if (!userRestaurant) {
      throw new Error("Restaurant not found");
    }

    const categories = await prisma.category.findMany({
      where: { restaurantId: userRestaurant.id },
      include: {
        products: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return categories.map(category => ({
      ...category,
      numberOfProducts: category.products.length
    }));
  } catch (error) {
    console.error("Error fetching restaurant categories:", error);
    throw new Error("Failed to fetch restaurant categories");
  }
}

export async function UpdateCategory({ id, name, description }: { id: string; name: string; description?: string }): Promise<Category> {
  try {
    const connectedUser = await getUser();
    if (!connectedUser || !connectedUser.id) {
      throw new Error("User not authenticated");
    }

    const userRestaurant = await prisma.restaurant.findFirst();
    if (!userRestaurant) {
      throw new Error("Restaurant not found");
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name, description: description || null },
    });

    return updatedCategory;
  } catch (error) {
    console.error("Error updating category:", error);
    throw new Error("Failed to update category");
  }
}

export async function deleteCategory({ id }: { id: string }) {
  try {
    const connectedUser = await getUser();
    if (!connectedUser || !connectedUser.id) {
      throw new Error("User not authenticated");
    }

    const userRestaurant = await prisma.restaurant.findFirst();
    if (!userRestaurant) {
      throw new Error("Restaurant not found");
    }

    await prisma.category.delete({
      where: { id }
    });

    return true;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw new Error("Failed to delete category");
  }
}

export async function getCategoryProducts(categoryId: string): Promise<Product[]> {
  try {
    if (!categoryId) {
      throw new Error("Category ID is required");
    }
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: { products: true },
    });
    if (!category) {
      throw new Error("Category not found");
    }
    return category.products.map(product => ({
      ...product,
      sold: 0
    }));
  } catch (error) {
    console.error("Error fetching category products:", error);
    throw new Error("Failed to fetch category products");

  }
}

/* Products */
export async function getRestaurantProducts(): Promise<Product[]> {
  try {
    const connectedUser = await getUser();
    if (!connectedUser || !connectedUser.id) {
      throw new Error("User not authenticated");
    }

    const userRestaurant = await prisma.restaurant.findFirst();
    if (!userRestaurant) {
      throw new Error("Restaurant not found");
    }

    const products = await prisma.product.findMany({
      where: { restaurantId: userRestaurant.id },
      include: {
        category: true,
        orderItems: true
      },
      orderBy: {
        updatedAt: 'asc'
      }
    });

    return products.map(product => ({
      ...product,
      images: product.images || null,
      sold: product.orderItems.reduce((acc, item) => acc + item.quantity, 0) || 0
    }));

  } catch (error) {
    console.error("Error fetching restaurant products:", error);
    throw new Error("Failed to fetch restaurant products");
  }
}

export async function CreateProduct({ name, description, price, images, stock, categoryId }: { name: string; description?: string; price: number; images?: string[]; stock: number; categoryId: string }): Promise<Product> {
  try {
    const connectedUser = await getUser();
    if (!connectedUser || !connectedUser.id) {
      throw new Error("User not authenticated");
    }

    const userRestaurant = await prisma.restaurant.findFirst();
    if (!userRestaurant) {
      throw new Error("Restaurant not found");
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price,
        images: images || [],
        stock,
        restaurantId: userRestaurant.id,
        categoryId: categoryId
      }
    });

    return {
      ...newProduct,
      sold: 0
    };
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product");
  }
}


export async function deleteProduct({ productId }: { productId: string }) {
  try {
    const connectedUser = await getUser();
    if (!connectedUser || !connectedUser.id) {
      throw new Error("User not authenticated");
    }

    const userRestaurant = await prisma.restaurant.findFirst();
    if (!userRestaurant) {
      throw new Error("Restaurant not found");
    }

    await prisma.product.delete({
      where: {
        id: productId
      }
    });

  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Failed to delete product");
  }
}