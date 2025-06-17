import axios from 'axios';
import { Product, ApiResponse } from '@/types';

const API_BASE_URL = 'https://dummyjson.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const productApi = {
  // Get all products with pagination
  getAllProducts: async (limit = 100, skip = 0): Promise<ApiResponse<Product>> => {
    const response = await api.get(`/products?limit=${limit}&skip=${skip}`);
    return response.data;
  },

  // Get product by ID
  getProduct: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Search products
  searchProducts: async (query: string): Promise<ApiResponse<Product>> => {
    const response = await api.get(`/products/search?q=${query}`);
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (category: string): Promise<ApiResponse<Product>> => {
    const response = await api.get(`/products/category/${category}`);
    return response.data;
  },

  // Get all categories
  getCategories: async (): Promise<string[]> => {
    const response = await api.get('/products/categories');
    return response.data;
  },
};

export default api;