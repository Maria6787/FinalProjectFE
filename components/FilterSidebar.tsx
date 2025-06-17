'use client';

import React, { useState } from 'react';
import { FilterOptions, SortOptions } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { X, SlidersHorizontal } from 'lucide-react';

interface FilterSidebarProps {
  categories: string[];
  onFilterChange: (filters: FilterOptions) => void;
  onSortChange: (sort: SortOptions) => void;
  onReset: () => void;
}

export function FilterSidebar({ 
  categories, 
  onFilterChange, 
  onSortChange, 
  onReset 
}: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    category: '',
    minPrice: 0,
    maxPrice: 1000,
    minRating: 0,
    inStock: false,
  });

  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [ratingFilter, setRatingFilter] = useState([0]);

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    const newFilters = { 
      ...filters, 
      minPrice: value[0], 
      maxPrice: value[1] 
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRatingChange = (value: number[]) => {
    setRatingFilter(value);
    const newFilters = { ...filters, minRating: value[0] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      category: '',
      minPrice: 0,
      maxPrice: 1000,
      minRating: 0,
      inStock: false,
    };
    setFilters(resetFilters);
    setPriceRange([0, 1000]);
    setRatingFilter([0]);
    onReset();
  };

  const handleSortChange = (value: string) => {
    const [field, order] = value.split('-') as [SortOptions['field'], SortOptions['order']];
    onSortChange({ field, order });
  };

  const handleCategoryChange = (value: string) => {
    const categoryValue = value === 'all' ? '' : value;
    handleFilterChange('category', categoryValue);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <X className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>

      {/* Sort */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Sort By</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={handleSortChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select sorting" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating-desc">Rating: High to Low</SelectItem>
              <SelectItem value="discountPercentage-desc">Highest Discount</SelectItem>
              <SelectItem value="stock-desc">Most Stock</SelectItem>
              <SelectItem value="title-asc">Name: A to Z</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories
                .filter((category) => category && typeof category === 'string')
                .map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={handlePriceChange}
            max={1000}
            min={0}
            step={10}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </CardContent>
      </Card>

      {/* Rating Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Minimum Rating</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={ratingFilter}
            onValueChange={handleRatingChange}
            max={5}
            min={0}
            step={0.5}
            className="w-full"
          />
          <div className="text-sm text-muted-foreground">
            {ratingFilter[0]} stars and above
          </div>
        </CardContent>
      </Card>

      {/* Stock Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="inStock"
              checked={filters.inStock}
              onCheckedChange={(checked) => handleFilterChange('inStock', checked)}
            />
            <Label htmlFor="inStock" className="text-sm">
              In Stock Only
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}