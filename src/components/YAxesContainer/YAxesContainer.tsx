import React, { useEffect } from "react";
import {
  // max, min,
  extent,
} from "d3-array";
import { scaleLinear } from "@visx/scale";
import { interpolatePlasma } from "d3-scale-chromatic";

import { useLineChartStore } from "@/state";
import { PressurePoint } from "@/types/chart.types";
import { lerp, rescaleYAxis } from "@/utils/helpers";
import { initialTransform, margin } from "@/utils/constants";
import { Group } from "@visx/group";
import { YAxis } from "../YAxis";
import { composeMatrices } from "@visx/zoom";
import { nanoid } from "nanoid";

type Props = {
  height: number;
};

const YAxesContainer = (props: Props) => {
  const { height } = props;
  const axesConfiguration = useLineChartStore(
    (state) => state.axesConfiguration
  );

  const globalZoomMatrix = useLineChartStore((state) => state.globalZoomMatrix);

  return (
    <>
      {axesConfiguration.map((config, index) => {
        const { id, strokeColor, getYScale, yTransformMatrix } = config;

        const yScale = getYScale(height);
        const zoomedYScale = rescaleYAxis(
          yScale,
          composeMatrices(globalZoomMatrix, yTransformMatrix)
        );
        return (
          <Group
            key={nanoid()}
            transform={`translate(${margin.left + margin.left * index}, 0)`}
          >
            <YAxis
              id={id}
              strokeColor={strokeColor}
              zoomedYScale={zoomedYScale}
              height={height}
            />
          </Group>
        );
      })}
    </>
  );
};

export default YAxesContainer;
