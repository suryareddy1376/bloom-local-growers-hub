
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { plants, userOrders } = useData();
  
  // Filter for plants the user is selling
  const userPlants = plants.filter(plant => plant.userId === user?.id);
  
  if (!user) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground mb-4">Please sign in to view your profile</p>
        <Button onClick={() => navigate('/')}>Sign In</Button>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.photoURL} alt={user.name} />
            <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          
          <div>
            <CardTitle>{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
            {user.location && user.location.address && (
              <Badge variant="outline" className="mt-1">
                {user.location.address}
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={signOut}>
            Sign Out
          </Button>
        </CardFooter>
      </Card>
      
      <Tabs defaultValue="orders">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="orders">My Orders</TabsTrigger>
          <TabsTrigger value="listings">My Listings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="orders" className="space-y-4 pt-4">
          {userOrders.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">You haven't placed any orders yet</p>
                <Button 
                  variant="link" 
                  onClick={() => navigate('/explore')}
                >
                  Browse plants
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {userOrders.map((order) => (
                <Card key={order.id}>
                  <div className="flex">
                    <div className="w-1/3 aspect-square">
                      <img 
                        src={order.plantImage} 
                        alt={order.plantTitle} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    
                    <CardContent className="flex-1 p-4">
                      <h3 className="font-medium">{order.plantTitle}</h3>
                      <p className="text-sm text-muted-foreground">Seller: {order.sellerName}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline">${order.price}</Badge>
                        <Badge 
                          variant={order.status === 'completed' ? 'secondary' : 'default'}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                        <Badge variant="outline">
                          {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Pickup'}
                        </Badge>
                      </div>
                      
                      {order.paymentMethod === 'COD' && order.address && (
                        <p className="text-xs mt-2">
                          <span className="font-medium">Delivery Address:</span> {order.address}
                        </p>
                      )}
                      
                      <p className="text-xs text-muted-foreground mt-2">
                        Ordered on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="listings" className="space-y-4 pt-4">
          {userPlants.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">You haven't listed any plants yet</p>
                <Button 
                  variant="link" 
                  onClick={() => navigate('/sell')}
                >
                  Add a listing
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {userPlants.map((plant) => (
                <Card key={plant.id} className="overflow-hidden">
                  <div className="flex">
                    <div className="w-1/3 aspect-square">
                      <img 
                        src={plant.image} 
                        alt={plant.title} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    
                    <CardContent className="flex-1 p-4">
                      <h3 className="font-medium">{plant.title}</h3>
                      <p className="text-sm font-bold text-leaf-600">${plant.price}</p>
                      <p className="text-sm line-clamp-2 mt-1">{plant.description}</p>
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {plant.paymentMethods.map((method) => (
                          <Badge key={method} variant="outline">
                            {method === 'COD' ? 'Cash on Delivery' : 'Pickup'}
                          </Badge>
                        ))}
                      </div>
                      
                      <p className="text-xs text-muted-foreground mt-2">
                        Listed on {new Date(plant.createdAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
