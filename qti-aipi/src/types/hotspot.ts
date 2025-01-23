// hotspot.ts
import { Shape, ShowHide } from './base-types';

export interface QTIHotspot {
  identifier: string;
  shape: Shape;
  coords: string;
  value?: string;
  hotspotLabel?: string;
  fixed?: boolean;
  templateIdentifier?: string;
  showHide?: ShowHide;
  matchMax?: number;
  matchMin?: number;
}

