'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <Card>
            <CardContent className="p-8">
              <div className="mb-6">
                <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                <h1 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">
                  Order Placed Successfully!
                </h1>
                <p className="text-muted-foreground">
                  Thank you for your purchase. Your order has been confirmed and will be processed soon.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span>Expected delivery: 3-5 business days</span>
                </div>

                <div className="space-y-3">
                  <Link href="/orders" className="block">
                    <Button className="w-full">
                      View Order History
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  
                  <Link href="/" className="block">
                    <Button variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="mt-8 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  This is a demo e-commerce site. No real products were purchased and no payment was processed.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}