import { useLineChartStore } from "@/state";
import { mainZoomRectClipId } from "@/utils/constants";
import { Group } from "@visx/group";
import { curveStepAfter } from "@visx/curve";
import { LinePath } from "@visx/shape";
import React from "react";
import { PressurePoint } from "@/types/chart.types";
import type { ScaleTime } from "d3-scale";
import { composeMatrices } from "@visx/zoom";
import { rescaleXAxis, rescaleYAxis } from "@/utils/helpers";
import { nanoid } from "nanoid";

type Props = {
  data: {
    id: string;
    points: PressurePoint[];
  }[];
  xScale: ScaleTime<number, number, never>;
  height: number;
};

const LineContainer = (props: Props) => {
  const { data, height, xScale } = props;
  const axesConfiguration = useLineChartStore(
    (state) => state.axesConfiguration
  );
  const globalZoomMatrix = useLineChartStore((state) => state.globalZoomMatrix);
  const splitXAxes = useLineChartStore((state) => state.splitXAxes);

  return (
    <React.Fragment>
      {axesConfiguration.map((config) => {
        const {
          id,
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
        const zoomedXScale = rescaleXAxis(xScale, xMatrix);
        return (
          <Group key={nanoid()} clipPath={`url(#${mainZoomRectClipId})`}>
            <LinePath
              id={id}
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
              // curve={curveStepAfter}
            />
          </Group>
        );
      })}
    </React.Fragment>
  );
};

export default LineContainer;
