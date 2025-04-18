
import { plantService } from './plantService';
import { communityService } from './communityService';
import { orderService } from './orderService';

export const mongoService = {
  ...plantService,
  ...communityService,
  ...orderService,
};

