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
import { compareStringArrays } from "@/utils/utils";

type Props = {
  height: number;
};

const YAxesContainer = (props: Props) => {
  const { height } = props;
  const axesConfigurationTagList = useLineChartStore(
    (state) => state.axesConfigurationTagList
  );
  useEffect(() => {
    console.log("Y Axes container initial render");
  }, []);

  return (
    <>
      {axesConfigurationTagList.map((WinCCOA, index) => (
        <Group
          key={WinCCOA}
          transform={`translate(${margin.left + margin.left * index}, 0)`}
        >
          <YAxis WinCCOA={WinCCOA} height={height} />
        </Group>
      ))}
    </>
  );
};

export default YAxesContainer;
