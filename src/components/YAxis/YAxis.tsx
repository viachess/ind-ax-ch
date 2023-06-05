import { Axis } from "@visx/axis";
import React, { useEffect } from "react";
import type { ScaleLinear } from "d3-scale";
import { useLineChartStore } from "@/state";
import { rescaleYAxis } from "@/utils/helpers";
import { composeMatrices } from "@visx/zoom";

type Props = {
  WinCCOA: string;
  height: number;
  // zoomedYScale: ScaleLinear<number, number, never>;
};

const YAxis = (props: Props) => {
  const { WinCCOA, height } = props;
  const config = useLineChartStore((state) => state.axesConfiguration[WinCCOA]);
  const globalZoomMatrix = useLineChartStore((state) => state.globalZoomMatrix);
  const { strokeColor, getYScale, yTransformMatrix } = config;

  const yScale = getYScale(height);
  const zoomedYScale = rescaleYAxis(
    yScale,
    composeMatrices(globalZoomMatrix, yTransformMatrix)
  );

  return (
    <Axis
      scale={zoomedYScale}
      numTicks={height / 40}
      orientation="left"
      stroke={strokeColor}
      strokeWidth={1.5}
      tickStroke={strokeColor}
      tickLabelProps={() => ({
        fill: strokeColor,
        textAnchor: "end",
        verticalAnchor: "middle",
        fontSize: "0.85rem",
        // style: {
        //   userSelect: "none",
        // },
      })}
      tickFormat={(value) => `${Number(value).toFixed(3)}`}
    />
  );
};

export default YAxis;
