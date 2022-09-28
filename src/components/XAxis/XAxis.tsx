import type { PressurePoint } from "@/types/chart.types";
import { Group } from "@visx/group";

import {
  // max, min,
  extent,
} from "d3-array";
import type { ScaleTime } from "d3-scale";

import { scaleTime } from "@visx/scale";
import { colors, margin } from "@/utils/constants";
import { Axis } from "@visx/axis";
import { rescaleXAxis } from "@/utils/helpers";

import { useLineChartStore } from "@/state";

import { timeFormat } from "d3-time-format";
import { TransformMatrix } from "@visx/zoom/lib/types";
import { composeMatrices } from "@visx/zoom";
const defaultDateFormat = timeFormat("%H:%M:%S");

type Props = {
  data: {
    id: string;
    points: PressurePoint[];
  }[];
  timestampsArr: Date[];
  width: number;
  height: number;
  // xScale: ScaleTime<number, number, never>;
  offsetLeft: number;
  offsetTop?: number;
  xTransformMatrix?: TransformMatrix;
  strokeColor?: string;
};

const XAxis = (props: Props) => {
  const {
    data,
    width,
    height,
    offsetLeft,
    offsetTop,
    timestampsArr,
    xTransformMatrix,
    strokeColor,
    // xScale
  } = props;

  const globalZoomMatrix = useLineChartStore((state) => state.globalZoomMatrix);

  const xExtent = extent(timestampsArr) as [Date, Date];

  const xScale = scaleTime({
    domain: xExtent,
    // range: [margin.left, width - margin.left * data.length],
    range: [offsetLeft, width - margin.left * data.length],
    nice: true,
  });

  const xTicksNum = width < 855 ? 6 : 12;
  const matrix = xTransformMatrix
    ? composeMatrices(globalZoomMatrix, xTransformMatrix)
    : globalZoomMatrix;
  const axisColor = strokeColor ? strokeColor : colors.white;

  const rescaledXAxis = rescaleXAxis(xScale, matrix);

  return (
    <Group transform={`translate(${0}, 0)`}>
      <Axis
        scale={rescaledXAxis}
        top={height + (offsetTop ? offsetTop : 0)}
        orientation="bottom"
        stroke={axisColor}
        strokeWidth={1}
        tickStroke={axisColor}
        numTicks={xTicksNum}
        tickLabelProps={() => ({
          fill: axisColor,
          textAnchor: "middle",
          verticalAnchor: "middle",
          fontSize: "0.85rem",
        })}
        tickFormat={(value) => {
          if (typeof value === "number") {
            return defaultDateFormat(new Date(value));
          } else {
            return defaultDateFormat(value as Date);
          }
        }}
      />
    </Group>
  );
};

export default XAxis;
