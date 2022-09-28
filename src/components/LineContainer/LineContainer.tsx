import { useLineChartStore } from "@/state";
import { mainZoomRectClipId, margin } from "@/utils/constants";
import { Group } from "@visx/group";
import { curveStepAfter } from "@visx/curve";
import { LinePath } from "@visx/shape";
import React from "react";
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

type Props = {
  data: {
    id: string;
    points: PressurePoint[];
  }[];
  width: number;
  height: number;
  timestampsArr: Date[] | Date[][];
};

const LineContainer = (props: Props) => {
  const { data, width, height, timestampsArr } = props;
  const axesConfiguration = useLineChartStore(
    (state) => state.axesConfiguration
  );
  // TODO:
  // [x] change xScale prop receiving method
  //   [x] depending on splitXAxes:
  //       false = collect timestamps and pass flattened array of arrays to xExtent
  //       true = create an individual xScale and pass it to related line of current data object (burr..)
  const globalZoomMatrix = useLineChartStore((state) => state.globalZoomMatrix);
  const splitXAxes = useLineChartStore((state) => state.splitXAxes);

  return (
    <React.Fragment>
      {axesConfiguration.map((config, index) => {
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
              curve={curveStepAfter}
            />
          </Group>
        );
      })}
    </React.Fragment>
  );
};

export default LineContainer;
