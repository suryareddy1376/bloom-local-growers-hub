
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { PaymentMethod } from '@/types';
import { toast } from '@/components/ui/sonner';
import { IndianRupee } from 'lucide-react';

const Sell = () => {
  const navigate = useNavigate();
  const { addPlant } = useData();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [growthConditions, setGrowthConditions] = useState('');
  const [image, setImage] = useState('');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(['Pickup']);
  
  // Mock images to choose from
  const mockImages = [
    'https://images.unsplash.com/photo-1599751449628-8a7270d7e80a?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1596547609652-9cf9771a35a3?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1604762525953-f7fbcf61d3be?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1528476513691-07e6f563d97f?w=800&auto=format&fit=crop',
  ];
  
  // Toggle payment method
  const togglePaymentMethod = (method: PaymentMethod) => {
    if (paymentMethods.includes(method)) {
      setPaymentMethods(paymentMethods.filter(m => m !== method));
    } else {
      setPaymentMethods([...paymentMethods, method]);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please sign in to list a plant");
      return;
    }
    
    if (!user.location) {
      toast.error("Location is required. Please enable location services.");
      return;
    }
    
    if (!title.trim() || !description.trim() || !growthConditions.trim() || !image || !paymentMethods.length) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    
    // Add the new plant
    addPlant({
      title,
      description,
      price: numericPrice,
      growthConditions,
      image,
      paymentMethods,
    });
    
    // Reset form and navigate to explore
    setTitle('');
    setPrice('');
    setDescription('');
    setGrowthConditions('');
    setImage('');
    setPaymentMethods(['Pickup']);
    
    navigate('/explore');
  };

  return (
    <div className="py-6 space-y-6">
      <h1 className="text-xl font-semibold">Sell a Plant</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Plant Name</Label>
          <Input
            id="title"
            placeholder="e.g., Snake Plant"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="price">Price (₹)</Label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              id="price"
              type="number"
              placeholder="500"
              min="1"
              step="1"
              className="pl-10"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe your plant..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="growth">Growth Conditions</Label>
          <Textarea
            id="growth"
            placeholder="Light, water, and care requirements..."
            value={growthConditions}
            onChange={(e) => setGrowthConditions(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label>Payment Methods</Label>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="pickup" 
                checked={paymentMethods.includes('Pickup')}
                onCheckedChange={() => togglePaymentMethod('Pickup')}
              />
              <Label htmlFor="pickup" className="text-sm font-normal">Pickup</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="cod" 
                checked={paymentMethods.includes('COD')}
                onCheckedChange={() => togglePaymentMethod('COD')}
              />
              <Label htmlFor="cod" className="text-sm font-normal">Cash on Delivery</Label>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Plant Photo</Label>
          <div className="grid grid-cols-3 gap-2">
            {mockImages.map((mockImage, index) => (
              <div 
                key={index}
                className={`aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${image === mockImage ? 'border-primary' : 'border-transparent'}`}
                onClick={() => setImage(mockImage)}
              >
                <img 
                  src={mockImage} 
                  alt={`Plant sample ${index + 1}`} 
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Select one of the sample images above. In a real app, you would upload your own.
          </p>
        </div>
        
        <Button type="submit" className="w-full">
          List Plant for Sale
        </Button>
      </form>
    </div>
  );
};

export default Sell;
