'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Package, 
  ArrowLeft, 
  Calendar,
  DollarSign
} from 'lucide-react';

export default function OrdersPage() {
  const router = useRouter();
  const { user, getPurchaseHistory, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-muted-foreground mb-8">
              Please log in to view your order history.
            </p>
            <Button onClick={() => router.push('/login')}>
              Log In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const purchaseHistory = getPurchaseHistory();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Order History</h1>
          <Button variant="outline" onClick={() => router.push('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>

        {purchaseHistory.length === 0 ? (
          <div className="text-center py-16">
            <Package className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
            <h2 className="text-2xl font-bold mb-4">No Orders Yet</h2>
            <p className="text-muted-foreground mb-8">
              You haven't placed any orders yet. Start shopping to see your order history here.
            </p>
            <Button onClick={() => router.push('/')}>
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {purchaseHistory.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Order #{order.id.slice(-8)}
                    </CardTitle>
                    <Badge 
                      variant={
                        order.status === 'completed' ? 'default' :
                        order.status === 'pending' ? 'secondary' : 'destructive'
                      }
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(order.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4" />
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Package className="h-4 w-4" />
                      <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index}>
                        <div className="flex items-center space-x-4">
                          <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={item.thumbnail}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium line-clamp-1">{item.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              ${((item.price - (item.price * item.discountPercentage / 100)) * item.quantity).toFixed(2)}
                            </p>
                            {item.discountPercentage > 0 && (
                              <p className="text-xs text-muted-foreground line-through">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                        {index < order.items.length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}