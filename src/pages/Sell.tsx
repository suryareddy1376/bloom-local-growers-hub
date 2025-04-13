
import React, { useState, useRef } from 'react';
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
import { IndianRupee, Upload, Image, X } from 'lucide-react';

const Sell = () => {
  const navigate = useNavigate();
  const { addPlant } = useData();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [growthConditions, setGrowthConditions] = useState('');
  const [image, setImage] = useState('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(['Pickup']);
  
  // Mock images as fallback options
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
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }
    
    setUploadedImage(file);
    
    // Create preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // Clear the sample image selection
    setImage('');
  };
  
  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  // Remove uploaded image
  const removeUploadedImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setUploadedImage(null);
    setPreviewUrl(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please sign in to list a plant");
      return;
    }
    
    if (!user.location) {
      toast.error("Location is required. Please enable location services.");
      return;
    }
    
    if (!title.trim() || !description.trim() || !growthConditions.trim() || (!image && !previewUrl) || !paymentMethods.length) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    
    let finalImageUrl = image;
    
    // If we have an uploaded image, we would normally upload it to a server
    // and get back a URL. For now, we'll use the object URL as a placeholder
    if (previewUrl && uploadedImage) {
      // In a real app, this would be where you upload the image to a server or cloud storage
      // For now, we'll just use the local preview URL
      finalImageUrl = previewUrl;
    }
    
    // Add the new plant
    addPlant({
      title,
      description,
      price: numericPrice,
      growthConditions,
      image: finalImageUrl,
      paymentMethods,
    });
    
    // Reset form and navigate to explore
    setTitle('');
    setPrice('');
    setDescription('');
    setGrowthConditions('');
    setImage('');
    setUploadedImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
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
          
          {/* Image upload section */}
          <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
            {/* Hidden file input */}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            
            {/* Preview of uploaded image */}
            {previewUrl ? (
              <div className="relative inline-block">
                <img 
                  src={previewUrl} 
                  alt="Uploaded plant" 
                  className="h-40 w-auto mx-auto object-cover rounded-md"
                />
                <button 
                  type="button"
                  onClick={removeUploadedImage}
                  className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button 
                type="button"
                onClick={triggerFileInput}
                className="flex flex-col items-center justify-center w-full h-40 gap-2"
              >
                <Upload size={32} className="text-gray-400" />
                <span className="text-sm text-gray-500">Click to upload your plant photo</span>
                <span className="text-xs text-gray-400">(Max size: 5MB)</span>
              </button>
            )}
          </div>
          
          {/* Sample images section */}
          {!previewUrl && (
            <>
              <p className="text-sm mt-4 mb-2">Or select from sample images:</p>
              <div className="grid grid-cols-3 gap-2">
                {mockImages.map((mockImage, index) => (
                  <div 
                    key={index}
                    className={`aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${image === mockImage ? 'border-primary' : 'border-transparent'}`}
                    onClick={() => {
                      setImage(mockImage);
                      removeUploadedImage();
                    }}
                  >
                    <img 
                      src={mockImage} 
                      alt={`Plant sample ${index + 1}`} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        
        <Button type="submit" className="w-full">
          List Plant for Sale
        </Button>
      </form>
    </div>
  );
};

export default Sell;
