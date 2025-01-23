// area-mapping.ts
import { Shape } from './base-types';

export interface AreaMapping {
  lowerBound?: number;
  upperBound?: number;
  defaultValue?: number;
  areaMapEntries: {
    shape: Shape;
    coords: string;
    mappedValue: number;
  }[];
}

