import type { RefObject } from "react";
import type { TransformMatrix } from "@visx/zoom/lib/types";
import type { LinearScaleConfig } from "@visx/scale";
import type { ScaleLinear } from "d3-scale";

type PressurePoint = {
  value: number;
  timestamp: number; // | Date | Moment in production
};

type ZoomState = {
  initialTransformMatrix: TransformMatrix;
  transformMatrix: TransformMatrix;
  isDragging: boolean;
};

type IYAxisConfig = {
  id: string;
  points: PressurePoint[];
  strokeColor: string;
  dashed: boolean;
  // transform: TransformMatrix;
  transformRef: React.MutableRefObject<TransformMatrix | null>;
  getYScale: (height: number) => ScaleLinear<number, number, never>;
};

export type { IYAxisConfig, ZoomState };
