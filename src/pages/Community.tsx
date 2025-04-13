import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';
import { Community } from '@/types';
import { Users } from 'lucide-react';

const CommunityPage = () => {
  const navigate = useNavigate();
  const { communities, createCommunity, joinCommunity, leaveCommunity } = useData();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('explore');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [communityName, setCommunityName] = useState('');
  const [communityType, setCommunityType] = useState<'Temporary' | 'Permanent'>('Permanent');
  const [communityPurpose, setCommunityPurpose] = useState('');
  const [communityBio, setCommunityBio] = useState('');
  
  if (!user) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground mb-4">Please sign in to access communities</p>
        <Button onClick={() => navigate('/')}>Sign In</Button>
      </div>
    );
  }
  
  const handleCreateCommunity = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!communityName.trim() || !communityPurpose.trim() || !communityBio.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    createCommunity({
      name: communityName,
      type: communityType,
      purpose: communityPurpose,
      bio: communityBio,
    });
    
    // Reset form and show the explore tab
    setCommunityName('');
    setCommunityPurpose('');
    setCommunityBio('');
    setCommunityType('Permanent');
    setShowCreateForm(false);
    setActiveTab('explore');
  };
  
  // Filter for communities the user has joined
  const userCommunities = communities.filter(community => community.members.includes(user.id));
  // Other communities nearby
  const nearbyCommunities = communities.filter(community => !community.members.includes(user.id));

  return (
    <div className="py-6 space-y-6">
      <h1 className="text-xl font-semibold">Plant Communities</h1>
      
      <Tabs defaultValue="explore" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="explore">Explore Communities</TabsTrigger>
          <TabsTrigger value="mine">My Communities</TabsTrigger>
        </TabsList>
        
        <TabsContent value="explore" className="space-y-4 pt-4">
          {!showCreateForm ? (
            <Button className="w-full" onClick={() => setShowCreateForm(true)}>
              Create a Community
            </Button>
          ) : (
            <Card>
              <form onSubmit={handleCreateCommunity}>
                <CardContent className="space-y-4 pt-4">
                  <h2 className="font-medium">Create a New Community</h2>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Community Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Urban Gardeners Collective"
                      value={communityName}
                      onChange={(e) => setCommunityName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Community Type</Label>
                    <RadioGroup 
                      value={communityType}
                      onValueChange={(value) => setCommunityType(value as 'Temporary' | 'Permanent')}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Permanent" id="permanent" />
                        <Label htmlFor="permanent">
                          Permanent (ongoing group)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Temporary" id="temporary" />
                        <Label htmlFor="temporary">
                          Temporary (one-time or short-term event)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose</Label>
                    <Input
                      id="purpose"
                      placeholder="e.g., Sharing gardening tips and plants"
                      value={communityPurpose}
                      onChange={(e) => setCommunityPurpose(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Community Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Describe your community..."
                      value={communityBio}
                      onChange={(e) => setCommunityBio(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                
                <CardFooter className="flex gap-2">
                  <Button variant="outline" type="button" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Create Community
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}
          
          <div className="space-y-2">
            <h2 className="font-medium">Communities Near You</h2>
            
            {nearbyCommunities.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No communities found nearby. Create the first one!
              </p>
            ) : (
              <div className="space-y-3">
                {nearbyCommunities.map((community) => (
                  <CommunityCard 
                    key={community.id} 
                    community={community}
                    isMember={false}
                    onJoin={() => joinCommunity(community.id)}
                    onLeave={() => leaveCommunity(community.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="mine" className="space-y-4 pt-4">
          {userCommunities.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">You haven't joined any communities yet</p>
                <Button 
                  variant="link" 
                  onClick={() => setActiveTab('explore')}
                >
                  Discover communities
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {userCommunities.map((community) => (
                <CommunityCard 
                  key={community.id} 
                  community={community}
                  isMember={true}
                  onJoin={() => joinCommunity(community.id)}
                  onLeave={() => leaveCommunity(community.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface CommunityCardProps {
  community: Community;
  isMember: boolean;
  onJoin: () => void;
  onLeave: () => void;
}

const CommunityCard: React.FC<CommunityCardProps> = ({ community, isMember, onJoin, onLeave }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{community.name}</h3>
            <p className="text-xs bg-secondary inline-block px-2 py-0.5 rounded mt-1">
              {community.type}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{community.purpose}</p>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Users size={16} className="mr-1" />
            {community.members.length}
          </div>
        </div>
        
        <p className="text-sm mt-3 line-clamp-2">{community.bio}</p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <p className="text-xs text-muted-foreground">{community.location.address}</p>
        
        {isMember ? (
          <Button variant="outline" size="sm" onClick={onLeave}>
            Leave
          </Button>
        ) : (
          <Button size="sm" onClick={onJoin}>
            Join
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CommunityPage;
