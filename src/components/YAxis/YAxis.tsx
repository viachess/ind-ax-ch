import { Axis } from "@visx/axis";
import React, { useEffect } from "react";
import type { ScaleLinear } from "d3-scale";

type Props = {
  objectId: string;
  height: number;
  strokeColor: string;
  zoomedYScale: ScaleLinear<number, number, never>;
};

const YAxis = (props: Props) => {
  const { objectId, zoomedYScale, height, strokeColor } = props;

  return (
    <>
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
        })}
        tickFormat={(value) => `${Number(value).toFixed(3)}`}
      />
    </>
  );
};

export default YAxis;
