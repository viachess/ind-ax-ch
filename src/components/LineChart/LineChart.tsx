import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";

import { RectClipPath } from "@visx/clip-path";

import { nanoid } from "nanoid";

import type { IAxisConfig, PressurePoint } from "@/types/chart.types";
import type { ParentSizeProvidedProps } from "@visx/responsive/lib/components/ParentSize";
import type { ProvidedZoom, TransformMatrix } from "@visx/zoom/lib/types";

import { scaleTime } from "@visx/scale";

import { Legend } from "@/components/Legend";
import {
  margin,
  legendBlockOffset,
  initialTransform,
  mainZoomRectClipId,
  xAxesHeight,
} from "@/utils/constants";

import { GlobalZoomRect } from "../GlobalZoomRect";
import { useLineChartStore } from "@/state";

import {
  // max, min,
  extent,
} from "d3-array";
import { scaleLinear } from "@visx/scale";
import { interpolatePlasma } from "d3-scale-chromatic";
import { lerp } from "@/utils/helpers";
import XAxis from "../XAxis/XAxis";
import YAxesContainer from "../YAxesContainer/YAxesContainer";
import { LineContainer } from "../LineContainer";
import { XAxesContainer } from "../XAxesContainer";
import { XZoomRectList } from "../XZoomRectList";
import { YZoomRectList } from "../YZoomRectList";
import { Checkbox } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";

type Props = {
  parent: ParentSizeProvidedProps;
  data: {
    id: string;
    points: PressurePoint[];
  }[];
};

// interpolatePlasma(t)

const LineChart = ({ parent, data }: Props) => {
  const { width, height } = parent;

  const setYAxesConfiguration = useLineChartStore(
    (state) => state.setAxesConfiguration
  );

  const splitXAxes = useLineChartStore((state) => state.splitXAxes);
  const setSplitXAxes = useLineChartStore((state) => state.setSplitXAxes);

  const onCheckboxChange = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      setSplitXAxes(true);
    } else {
      setSplitXAxes(false);
    }
  };

  const timestampsArr = data
    .map((d) => d.points.map((t) => new Date(t.timestamp)))
    .flat(1);

  const xExtent = extent(timestampsArr) as [Date, Date];

  const xScale = scaleTime({
    domain: xExtent,
    range: [margin.left, width - margin.left * data.length],
    nice: true,
  });

  useEffect(() => {
    console.log("y-axes container initial render log");
    const config = data.map((obj, i, arr) => {
      const zeroToOne = lerp([0, arr.length], i);

      const { points } = obj;
      const yExtent = extent(points.map((d) => d.value).flat(1));

      return {
        id: obj.id,
        points,
        strokeColor: interpolatePlasma(zeroToOne),
        dashed: false,
        getYScale: (height: number) =>
          scaleLinear({
            domain: yExtent as [number, number],
            range: [height, margin.top],
            nice: true,
          }),
        yTransformMatrix: initialTransform,
        xTransformMatrix: initialTransform,
      };
    });
    setYAxesConfiguration(config);
  }, []);

  if (!width || !height) {
    return (
      <div style={{ color: "white", fontSize: "2rem", margin: "2rem" }}>
        Loading...
      </div>
    );
  }

  if (!data.length) {
    return (
      <div style={{ color: "white" }}>Dataset is empty, add more objects.</div>
    );
  }

  const zoomRectParams = {
    width: width > 0 ? width - margin.left * data.length : 0,
    height: height > 0 ? height - margin.top : height,
    x: margin.left * data.length,
    y: margin.top,
  };

  return (
    <>
      <svg
        width={width}
        height={
          height +
          data.length * legendBlockOffset +
          (splitXAxes ? (data.length - 1) * xAxesHeight : 0)
        }
      >
        <RectClipPath
          id={mainZoomRectClipId}
          width={zoomRectParams.width}
          height={zoomRectParams.height}
          x={zoomRectParams.x}
          y={zoomRectParams.y}
        />
        {/* x axes section */}
        <XAxesContainer data={data} height={height} width={width} />
        <XZoomRectList data={data} height={height} width={width} />
        {/* global zoom rectangle wrap */}
        <YAxesContainer height={height} />
        <YZoomRectList data={data} height={height}></YZoomRectList>
        <LineContainer data={data} xScale={xScale} height={height} />
        <GlobalZoomRect
          width={width}
          height={height}
          zoomRectParams={zoomRectParams}
        />
      </svg>
      <Legend data={data} />
      <Checkbox
        onChange={onCheckboxChange}
        style={{ color: "white", margin: "1rem" }}
      >
        Разделить оси времени
      </Checkbox>
    </>
  );
};

export default LineChart;
