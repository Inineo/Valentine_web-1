export type ScrapbookItemType =
  | 'polaroid'
  | 'paper_note'
  | 'tape'
  | 'heart'
  | 'fragment'
  | 'romantic_text';

export interface ResponsiveCoords {
  x: number;
  y: number;
  rotation?: number;
  scale?: number;
}

export interface ScrapbookItem {
  id: string;
  type: ScrapbookItemType;
  /** Primary content */
  image?: string;
  caption?: string;
  noteText?: string;
  subText?: string;
  /** Spatial properties (percentages 0-100) */
  x: number;
  y: number;
  rotation: number;
  scale: number;
  zIndex: number;
  depth: number; // 0.1 (far) to 1.0 (foreground)
  animationDelay?: number;
  /** Scroll timeline thresholds: normalized 0-1 */
  enterProgress: number; // when it begins appearing
  peakProgress?: number; // when fully visible
  /** Style variants */
  paperStyle?: 'torn' | 'parchment' | 'kraft' | 'blush' | 'lined';
  tapeColor?: 'cream' | 'rose' | 'kraft';
  sizePreset?: 'small' | 'medium' | 'large';
  /** Responsive overrides for mobile & tablet screens */
  responsive?: {
    mobile?: ResponsiveCoords;
    tablet?: ResponsiveCoords;
  };
}

export interface MousePosition {
  x: number;
  y: number;
}

export interface StoryPhase {
  range: [number, number];
  title: string;
  subtitle?: string;
  description?: string;
}
