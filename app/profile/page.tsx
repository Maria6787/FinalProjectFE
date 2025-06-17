'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  Wallet, 
  Plus, 
  ArrowLeft 
} from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateBalance, isAuthenticated } = useAuth();
  const [topUpAmount, setTopUpAmount] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-muted-foreground mb-8">
              Please log in to view your profile.
            </p>
            <Button onClick={() => router.push('/login')}>
              Log In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleTopUp = async () => {
    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amount > 1000) {
      toast.error('Maximum top-up amount is $1,000');
      return;
    }

    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      updateBalance(amount);
      setTopUpAmount('');
      toast.success(`Successfully added $${amount.toFixed(2)} to your wallet!`);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <Button variant="outline" onClick={() => router.push('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>First Name</Label>
                  <Input value={user.firstName} disabled />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input value={user.lastName} disabled />
                </div>
              </div>
              
              <div>
                <Label>Username</Label>
                <Input value={user.username} disabled />
              </div>

              <div>
                <Label>Email Address</Label>
                <Input value={user.email} disabled />
              </div>

              <div>
                <Label>Member Since</Label>
                <Input value={new Date().toLocaleDateString()} disabled />
              </div>

              <Separator />

              <div className="text-sm text-muted-foreground">
                <p>To update your profile information, please contact support.</p>
              </div>
            </CardContent>
          </Card>

          {/* Wallet */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wallet className="h-5 w-5" />
                  <span>Wallet Balance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                    ${user.balance.toFixed(2)}
                  </div>
                  <p className="text-muted-foreground">Available Balance</p>
                </div>
              </CardContent>
            </Card>

            {/* Top Up Wallet */}
            <Card>
              <CardHeader>
                <CardTitle>Top Up Wallet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="topUpAmount">Amount to Add</Label>
                  <Input
                    type="number"
                    id="topUpAmount"
                    placeholder="Enter amount"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    min="1"
                    max="1000"
                    step="0.01"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {[10, 25, 50, 100].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => setTopUpAmount(amount.toString())}
                    >
                      +${amount}
                    </Button>
                  ))}
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleTopUp}
                  disabled={loading || !topUpAmount}
                >
                  {loading ? 'Processing...' : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add to Wallet
                    </>
                  )}
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                  <p>This is a demo feature. No real payment is processed.</p>
                  <p>Maximum top-up amount: $1,000</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push('/orders')}
                >
                  View Order History
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push('/cart')}
                >
                  View Shopping Cart
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push('/')}
                >
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}