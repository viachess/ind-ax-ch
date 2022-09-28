import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  ReactElement,
  ReactNode,
} from "react";

import { Line } from "@visx/shape";

import { RectClipPath } from "@visx/clip-path";

import { localPoint } from "@visx/event";
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
  bisector,
  // max, min,
  extent,
} from "d3-array";
import { scaleLinear } from "@visx/scale";
import { interpolatePlasma } from "d3-scale-chromatic";
import { lerp, rescaleXAxis } from "@/utils/helpers";
import XAxis from "../XAxis/XAxis";
import YAxesContainer from "../YAxesContainer/YAxesContainer";
import { LineContainer } from "../LineContainer";
import { XAxesContainer } from "../XAxesContainer";
import { XZoomRectList } from "../XZoomRectList";
import { YZoomRectList } from "../YZoomRectList";
import { Checkbox } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { Group } from "@visx/group";
import { useTooltip, useTooltipInPortal } from "@visx/tooltip";
import { composeMatrices } from "@visx/zoom";

type Props = {
  parent: ParentSizeProvidedProps;
  data: {
    id: string;
    points: PressurePoint[];
  }[];
};

// interpolatePlasma(t)

// stock = Stock[];
// type Stock = {
//   date: "2010-06-10T07:00:00.000Z"
//   close: 250.51
// }

const getDate = (d: PressurePoint) => new Date(d.timestamp);

const LineChart = ({ parent, data }: Props) => {
  const { width, height } = parent;

  const axesConfiguration = useLineChartStore(
    (state) => state.axesConfiguration
  );

  const setAxesConfiguration = useLineChartStore(
    (state) => state.setAxesConfiguration
  );

  const globalZoomMatrix = useLineChartStore((state) => state.globalZoomMatrix);

  const splitXAxes = useLineChartStore((state) => state.splitXAxes);
  const setSplitXAxes = useLineChartStore((state) => state.setSplitXAxes);

  const dates = data.map((d) => d.points.map((t) => new Date(t.timestamp)));
  const timestampsArr = splitXAxes ? dates : dates.flat(1);

  const xExtent = splitXAxes
    ? timestampsArr.map((arr) => extent(arr as Date[]))
    : (extent(timestampsArr as Date[]) as [Date, Date]);

  useEffect(() => {
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
    setAxesConfiguration(config);
  }, []);

  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip();

  const { containerRef: tooltipContainerRef, TooltipInPortal } =
    useTooltipInPortal({
      // use TooltipWithBounds
      // detectBounds: true,
      detectBounds: false,
      // when tooltip containers are scrolled, this will correctly update the Tooltip position
      scroll: true,
    });

  // chart containing box mouseover event handler
  // FIXME: 1. [] replace parameter types 2. [] using type definitions, possibly remove nullish coalescing (????)
  const handleMouseOver = (
    event: React.MouseEvent<SVGRectElement>,
    datum: any
  ) => {
    // FIXME: replace event target type with appropriate option
    const coords =
      localPoint((event.target as any).ownerSVGElement, event) ?? false;
    if (coords) {
      showTooltip({
        tooltipLeft: coords.x,
        tooltipTop: coords.y,
        tooltipData: datum,
      });
    }
  };

  // x-axes split checkbox change handler
  const onCheckboxChange = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      setSplitXAxes(true);
    } else {
      setSplitXAxes(false);
    }
  };

  const bisectDate = bisector<PressurePoint, Date>(
    (d) => new Date(d.timestamp)
  ).left;

  const offsetLeft = data.length * margin.left;

  const handleTooltip = useCallback(
    (
      event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>
    ) => {
      // [] pixel value of x inside container, subtract offsetLeft from x
      // and margin.top from y to get correct value
      const { x, y } = localPoint(event) || { x: 0, y: 0 };

      const tooltipPointsArray = axesConfiguration.map((config, idx) => {
        // globalZoomMatrix
        const {
          id,
          xTransformMatrix,
          yTransformMatrix,
          getYScale,
          points,
          strokeColor,
        } = config;
        const xScale = splitXAxes
          ? scaleTime({
              domain: xExtent[idx] as [Date, Date],
              // range: [margin.left, width - margin.left * data.length],
              range: [offsetLeft, width - margin.left * data.length],
              nice: true,
            })
          : scaleTime({
              domain: xExtent as [Date, Date],
              // range: [margin.left, width - margin.left * data.length],
              range: [offsetLeft, width - margin.left * data.length],
              nice: true,
            });
        // const yScale = getYScale(height);
        const rescaledX = rescaleXAxis(
          xScale,
          composeMatrices(globalZoomMatrix, xTransformMatrix)
        );
        // const rescaledY = rescaleXAxis(xScale, composeMatrices(globalZoomMatrix, yTransformMatrix));

        const x0 = rescaledX.invert(x);
        const index = bisectDate(points, x0, 1);

        const d0 = points[index - 1];
        const d1 = points[index];
        let d = d0;
        if (d1 && getDate(d1)) {
          d =
            x0.valueOf() - getDate(d0).valueOf() >
            getDate(d1).valueOf() - x0.valueOf()
              ? d1
              : d0;
        }
        return {
          point: d,
          strokeColor,
          id,
        };
      });

      showTooltip({
        tooltipData: tooltipPointsArray,
        tooltipLeft: x,
        // tooltipTop: stockValueScale(getStockValue(d)),
        tooltipTop: y - margin.top,
      });
    },
    [
      showTooltip,
      splitXAxes,
      axesConfiguration,
      globalZoomMatrix,
      // stockValueScale,
      // dateScale
    ]
  );

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
        <XAxesContainer
          data={data}
          height={height}
          width={width}
          timestampsArr={timestampsArr}
        />
        <XZoomRectList data={data} height={height} width={width} />
        {/* global zoom rectangle wrap */}
        <YAxesContainer height={height} />
        <YZoomRectList data={data} height={height}></YZoomRectList>
        <Group
          transform={`translate(${
            // data.length * margin.left - margin.left * 2
            0
          }, 0)`}
        >
          <LineContainer
            data={data}
            timestampsArr={timestampsArr}
            width={width}
            height={height}
          />
        </Group>
        {tooltipOpen && axesConfiguration.length && (
          <Line
            from={{ x: tooltipLeft, y: margin.top }}
            to={{ x: tooltipLeft, y: height }}
            stroke={"pink"}
            strokeWidth={2}
            pointerEvents="none"
            strokeDasharray="5,2"
          />
        )}
        <GlobalZoomRect
          width={width}
          height={height}
          zoomRectParams={zoomRectParams}
          // FIXME: fix and replace type casting
          // onMouseOver={
          //   handleMouseOver as React.MouseEventHandler<SVGRectElement>
          // }
          hideTooltip={hideTooltip}
          handleTooltip={handleTooltip}
        />
      </svg>
      <div>
        {tooltipOpen && axesConfiguration.length && (
          <TooltipInPortal
            // set this to random so it correctly updates with parent bounds
            key={nanoid()}
            top={tooltipTop}
            left={tooltipLeft}
          >
            {Array.isArray(tooltipData) ? (
              <div>
                {tooltipData.map((p) => {
                  return (
                    <div
                      key={nanoid()}
                      style={{
                        position: "relative",
                        padding: "0 0.8rem 0.5rem 0.8rem",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "20px",
                          height: "16px",
                          backgroundColor: p.strokeColor,
                        }}
                      ></div>
                      <div style={{ paddingLeft: "26px" }}>{p.point.value}</div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </TooltipInPortal>
        )}
      </div>

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
