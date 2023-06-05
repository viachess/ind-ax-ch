import { useLineChartStore } from "@/state";
import { mainZoomRectClipId, margin } from "@/utils/constants";
import { Group } from "@visx/group";
import { curveStepAfter } from "@visx/curve";
import { LinePath } from "@visx/shape";
import React, { useEffect } from "react";
import { PressurePoint } from "@/types/chart.types";
import type { ScaleTime } from "d3-scale";
import { scaleTime } from "@visx/scale";
import {
  // max, min,
  extent,
} from "d3-array";
import { composeMatrices } from "@visx/zoom";
import { rescaleXAxis, rescaleYAxis } from "@/utils/helpers";
import { nanoid } from "nanoid";
import { compareStringArrays } from "@/utils/utils";

type Props = {
  data: {
    id: string;
    points: PressurePoint[];
  }[];
  width: number;
  height: number;
  timestampsArr: Date[] | Date[][];
};

type TrendLineProps = {
  WinCCOA: string;
  index: number;
} & Props;

function TrendLine({
  WinCCOA,
  index,
  width,
  height,
  data,
  timestampsArr,
}: TrendLineProps) {
  const globalZoomMatrix = useLineChartStore((state) => state.globalZoomMatrix);
  const splitXAxes = useLineChartStore((state) => state.splitXAxes);

  const config = useLineChartStore((state) => state.axesConfiguration[WinCCOA]);

  const {
    strokeColor,
    dashed,
    points,
    getYScale,
    yTransformMatrix,
    xTransformMatrix,
  } = config;

  const yScale = getYScale(height);
  const zoomedYScale = rescaleYAxis(
    yScale,
    composeMatrices(globalZoomMatrix, yTransformMatrix)
  );
  const xMatrix = splitXAxes
    ? composeMatrices(globalZoomMatrix, xTransformMatrix)
    : globalZoomMatrix;

  const xExtent = splitXAxes
    ? (extent(timestampsArr[index] as Date[]) as [Date, Date])
    : (extent(timestampsArr as Date[]) as [Date, Date]);

  const offsetLeft = data.length * margin.left;

  const xScale = scaleTime({
    domain: xExtent,
    range: [offsetLeft, width - margin.left * data.length],
    nice: true,
  });

  const zoomedXScale = rescaleXAxis(xScale, xMatrix);

  return (
    <Group key={nanoid()} clipPath={`url(#${mainZoomRectClipId})`}>
      <LinePath
        id={WinCCOA}
        data={points}
        // x={(d) => xScale(d.timestamp)}
        // y={(d) => yScale(d.value)}
        x={(d) => zoomedXScale(d.timestamp)}
        y={(d) => zoomedYScale(d.value)}
        stroke={strokeColor}
        strokeWidth={2}
        fill="none"
        strokeDasharray={dashed ? `10,10,10` : undefined}
        // transform={individualAxisZoom.toString()}
        curve={curveStepAfter}
      />
    </Group>
  );
  // return ()
}

const LineContainer = (props: Props) => {
  const axesConfigurationKeys = useLineChartStore(
    (state) => Object.keys(state.axesConfiguration),
    compareStringArrays
  );
  useEffect(() => {
    console.log("line container initial render log");
  }, []);
  return (
    <React.Fragment>
      {axesConfigurationKeys.map((WinCCOA, index) => (
        <TrendLine key={WinCCOA} WinCCOA={WinCCOA} index={index} {...props} />
      ))}
    </React.Fragment>
  );
};

export default LineContainer;
