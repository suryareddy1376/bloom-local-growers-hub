
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PaymentMethod } from '@/types';
import { toast } from '@/components/ui/sonner';
import { ArrowLeft } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const PlantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { plants, createOrder } = useData();
  const { user } = useAuth();
  
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Pickup');
  const [address, setAddress] = useState('');
  
  const plant = plants.find(p => p.id === id);
  
  if (!plant) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">Plant not found</p>
        <Button variant="link" onClick={() => navigate('/explore')}>Back to Explore</Button>
      </div>
    );
  }
  
  const isCurrentUserSeller = user?.id === plant.userId;
  
  const handleOrder = () => {
    if (!user) {
      toast.error("Please sign in to place an order");
      return;
    }
    
    // If user is the seller, they can't order their own plant
    if (isCurrentUserSeller) {
      toast.error("You can't order your own plant");
      return;
    }
    
    // If COD is selected, we need an address
    if (paymentMethod === 'COD' && !address.trim()) {
      toast.error("Please enter a delivery address");
      return;
    }
    
    // Create the order
    createOrder(plant.id, paymentMethod, paymentMethod === 'COD' ? address : undefined);
    
    // Reset form and navigate to profile (orders)
    setShowOrderForm(false);
    navigate('/profile');
  };

  return (
    <div className="py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-semibold">{plant.title}</h1>
      </div>
      
      <div className="aspect-square w-full overflow-hidden rounded-lg">
        <img 
          src={plant.image} 
          alt={plant.title} 
          className="h-full w-full object-cover"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={plant.sellerPhotoURL} alt={plant.sellerName} />
            <AvatarFallback>{plant.sellerName.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{plant.sellerName}</p>
            <p className="text-xs text-muted-foreground">{plant.location.address}</p>
          </div>
        </div>
        <p className="text-2xl font-bold text-leaf-600">${plant.price}</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <h2 className="font-medium">Description</h2>
          <p className="text-muted-foreground">{plant.description}</p>
        </div>
        
        <div>
          <h2 className="font-medium">Growth Conditions</h2>
          <p className="text-muted-foreground">{plant.growthConditions}</p>
        </div>
        
        <div>
          <h2 className="font-medium">Payment Methods</h2>
          <div className="flex gap-2 mt-1">
            {plant.paymentMethods.map((method) => (
              <span key={method} className="text-xs bg-secondary px-2 py-1 rounded">
                {method === 'COD' ? 'Cash on Delivery' : 'Pickup'}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {!isCurrentUserSeller && !showOrderForm && (
        <Button 
          className="w-full"
          onClick={() => setShowOrderForm(true)}
        >
          Order Now
        </Button>
      )}
      
      {!isCurrentUserSeller && showOrderForm && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <h2 className="font-medium">Complete Your Order</h2>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Payment Method</h3>
              <RadioGroup 
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                className="flex flex-col space-y-2"
              >
                {plant.paymentMethods.map((method) => (
                  <div key={method} className="flex items-center space-x-2">
                    <RadioGroupItem value={method} id={method} />
                    <Label htmlFor={method}>
                      {method === 'COD' ? 'Cash on Delivery' : 'Pickup'}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            {paymentMethod === 'COD' && (
              <div className="space-y-2">
                <Label htmlFor="address">Delivery Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter your full address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            )}
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowOrderForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleOrder}>
                Confirm Order
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlantDetail;
