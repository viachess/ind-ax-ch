import type { RefObject } from "react";
import type { TransformMatrix } from "@visx/zoom/lib/types";
import type { LinearScaleConfig } from "@visx/scale";
import type { ScaleLinear, ScaleTime } from "d3-scale";

export type PressurePoint = {
  value: number;
  timestamp: number; // | Date | Moment in production
};

type ZoomState = {
  initialTransformMatrix: TransformMatrix;
  transformMatrix: TransformMatrix;
  isDragging: boolean;
};

type IAxisConfig = {
  id: string;
  strokeColor: string;
  dashed: boolean;
  yTransformMatrix: TransformMatrix;
  getYScale: (height: number) => ScaleLinear<number, number, never>;
  points: PressurePoint[];
  getXScale?: () => ScaleTime<number, number, never>;
  xTransformMatrix: TransformMatrix;
};

export type { IAxisConfig, ZoomState };
