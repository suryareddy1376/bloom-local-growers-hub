
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { Plant } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, IndianRupee } from 'lucide-react';

const Explore = () => {
  const navigate = useNavigate();
  const { plants } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter plants based on search query
  const filteredPlants = plants.filter(plant => 
    plant.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    plant.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Function to handle clicking on a plant
  const handlePlantClick = (plantId: string) => {
    navigate(`/plant/${plantId}`);
  };

  return (
    <div className="py-6 space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          className="pl-10"
          placeholder="Search plants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {filteredPlants.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No plants available. Check back soon or add your own plants!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredPlants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} onClick={() => handlePlantClick(plant.id)} />
          ))}
        </div>
      )}
    </div>
  );
};

interface PlantCardProps {
  plant: Plant;
  onClick: () => void;
}

const PlantCard: React.FC<PlantCardProps> = ({ plant, onClick }) => {
  return (
    <Card className="plant-card overflow-hidden cursor-pointer" onClick={onClick}>
      <div className="aspect-square w-full overflow-hidden">
        <img 
          src={plant.image} 
          alt={plant.title} 
          className="h-full w-full object-cover transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium">{plant.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{plant.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex items-center">
          <IndianRupee size={16} className="mr-1" />
          <span className="font-semibold">{plant.price}</span>
        </div>
        <p className="text-xs text-muted-foreground">{plant.location.address}</p>
      </CardFooter>
    </Card>
  );
};

export default Explore;
