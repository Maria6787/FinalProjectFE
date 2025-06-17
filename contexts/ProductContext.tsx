'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product, ApiResponse } from '@/types';
import { productApi } from '@/lib/api';

interface ProductContextType {
  products: Product[];
  categories: string[];
  loading: boolean;
  error: string | null;
  searchProducts: (query: string) => Promise<Product[]>;
  getProductById: (id: number) => Product | undefined;
  refetchProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [productsResponse, categoriesResponse] = await Promise.all([
        productApi.getAllProducts(100, 0),
        productApi.getCategories(),
      ]);
      
      setProducts(productsResponse.products || []);
      setCategories(categoriesResponse);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (query: string): Promise<Product[]> => {
    try {
      if (!query.trim()) return products;
      
      const response = await productApi.searchProducts(query);
      return response.products || [];
    } catch (err) {
      console.error('Error searching products:', err);
      return [];
    }
  };

  const getProductById = (id: number): Product | undefined => {
    return products.find(product => product.id === id);
  };

  const refetchProducts = async () => {
    await fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const value: ProductContextType = {
    products,
    categories,
    loading,
    error,
    searchProducts,
    getProductById,
    refetchProducts,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};