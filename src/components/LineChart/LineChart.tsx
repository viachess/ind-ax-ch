import React, { useState, useEffect, useMemo, useRef } from "react";

import { Axis } from "@visx/axis";
import { curveStepAfter } from "@visx/curve";

import { scaleLinear, scaleTime } from "@visx/scale";
import { LinePath } from "@visx/shape";

import { localPoint } from "@visx/event";
import { Group } from "@visx/group";
import { composeMatrices, Zoom } from "@visx/zoom";
import { RectClipPath } from "@visx/clip-path";

import {
  // max, min,
  extent,
} from "d3-array";
import { interpolatePlasma } from "d3-scale-chromatic";
import { nanoid } from "nanoid";
import { timeFormat } from "d3-time-format";
const defaultDateFormat = timeFormat("%H:%M:%S");

import type { IYAxisConfig, ZoomState } from "@/types/chart.types";
import type { ParentSizeProvidedProps } from "@visx/responsive/lib/components/ParentSize";
import type { ProvidedZoom, TransformMatrix } from "@visx/zoom/lib/types";

import { Legend } from "@/components/Legend";
import { initialTransform, margin, legendBlockOffset } from "@/utils/constants";
import {
  rescaleXAxis,
  rescaleYAxis,
  stringifyTransformMatrix,
} from "@/utils/helpers";
import { YAxis } from "../YAxis";

type Props = {
  parent: ParentSizeProvidedProps;
};

const lerp = (oldRange: number[], oldValue: number) => {
  const [oldMax, oldMin] = oldRange;
  const newMin = 0;
  const newMax = 1;
  // OldRange = (OldMax - OldMin)
  const oldDiff = oldMax - oldMin;
  const newDiff = newMax - newMin;
  // NewValue = (((OldValue - OldMin) * NewRange) / OldRange) + NewMin
  const value = ((oldValue - oldMin) * newDiff) / oldDiff + newMin;
  return value;
};
// interpolatePlasma(t)

const colors = {
  white: "#FFFFFF",
  black: "#1B1B1B",
  gray: "#98A7C0",
  darkGray: "#2A2A2A",
  accent: "#40FEAE",
  darkAccent: "#256769",
  transparent: "transparent",
  red: "red",
};

const mainZoomRectClipId = "main-zoom-clip";

const LineChart = ({ parent }: Props) => {
  const { width, height } = parent;

  if (!width || !height) {
    return (
      <div style={{ color: "white", fontSize: "2rem", margin: "2rem" }}>
        Loading...
      </div>
    );
  }

  const dataset = useMemo(() => {
    const dataset = [
      {
        id: "TNB_YARPRIM_1_OBJ_1",
        points: [
          { value: 2.209, timestamp: 1661247658000 },
          { value: 2.134, timestamp: 1661247670000 },
          { value: 5.455, timestamp: 1661247684000 },
          { value: 2.266, timestamp: 1661247695000 },
          { value: 2.379, timestamp: 1661247707000 },
        ],
      },
      {
        id: "TNB_YARPRIM_2_OBJ_3",
        points: [
          { value: 1.433, timestamp: 1661247658000 },
          { value: 4.234, timestamp: 1661247670000 },
          { value: 6.115, timestamp: 1661247684000 },
          { value: 7.366, timestamp: 1661247695000 },
          { value: 5.679, timestamp: 1661247707000 },
        ],
      },
      {
        id: "TNB_PRIMYAR_4_OBJ_12",
        points: [
          { value: 10.544, timestamp: 1661247658000 },
          { value: 10.533, timestamp: 1661247670000 },
          { value: 10.225, timestamp: 1661247684000 },
          { value: 10.616, timestamp: 1661247695000 },
          { value: 10.979, timestamp: 1661247707000 },
        ],
      },
    ].map((obj, i, arr) => {
      const zeroToOne = lerp([0, arr.length], i);

      const { points } = obj;
      const yExtent = extent(points.map((d) => d.value).flat(1));

      return {
        ...obj,
        strokeColor: interpolatePlasma(zeroToOne),
        dashed: false,
        // transform: initialTransform,
        transformRef: React.createRef<TransformMatrix | null>(),
        getYScale: (height: number) =>
          scaleLinear({
            domain: yExtent as [number, number],
            range: [height, margin.top],
            nice: true,
          }),
      };
    });
    return dataset;
  }, []);

  // TODO:
  // [] append individual zoom transforms to axes
  //   [] On mousewheel on axis, scale the axis and a line that is bound to it. (only along the y-axis or 'value' axis)
  //   [] On axis drag, translate the bound line along y-axis
  // ----

  const [yAxesConfiguration, setYAxesConfiguration] =
    useState<IYAxisConfig[]>(dataset);

  const xTicksNum = width < 855 ? 6 : 12;

  const [globalZoomMatrix, setGlobalZoomMatrix] = useState<TransformMatrix>({
    ...initialTransform,
    translateX: margin.left,
  });

  if (!yAxesConfiguration?.length) {
    return (
      <div style={{ color: "white" }}>Dataset is empty, add more objects.</div>
    );
  }

  const zoomRectParams = {
    width: width > 0 ? width - margin.left * yAxesConfiguration.length : 0,
    height: height > 0 ? height - margin.top : height,
    x: margin.left * yAxesConfiguration.length,
    y: margin.top,
  };

  const timestampsArr = dataset
    .map((d) => d["points"].map((t) => new Date(t.timestamp)))
    .flat(1);

  const xExtent = extent(timestampsArr) as [Date, Date];

  const xScale = scaleTime({
    domain: xExtent,
    range: [margin.left, width - margin.left * yAxesConfiguration.length],
    nice: true,
  });

  return (
    <>
      <svg
        width={width}
        height={height + yAxesConfiguration.length * legendBlockOffset}
      >
        <RectClipPath
          id={mainZoomRectClipId}
          width={zoomRectParams.width}
          height={zoomRectParams.height}
          x={zoomRectParams.x}
          y={zoomRectParams.y}
        />
        {/* x axes section */}
        <Group
          transform={`translate(${
            (yAxesConfiguration.length - 1) * margin.left
          }, 0)`}
        >
          <Axis
            scale={rescaleXAxis(xScale, globalZoomMatrix)}
            // scale={rescaleXAxis(xScale, {
            //   ...initialTransform,
            //   translateX: margin.left,
            // })}
            top={height}
            orientation="bottom"
            stroke={colors.white}
            strokeWidth={1}
            tickStroke={colors.white}
            numTicks={xTicksNum}
            tickLabelProps={() => ({
              fill: colors.white,
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

        <Zoom<SVGRectElement>
          width={width}
          height={height}
          scaleXMin={1 / 2}
          scaleXMax={4}
          scaleYMin={1 / 2}
          scaleYMax={4}
          initialTransformMatrix={{
            ...initialTransform,
            translateX: margin.left,
          }}
        >
          {(zoom) => {
            useEffect(() => {
              setGlobalZoomMatrix(zoom.transformMatrix);
            }, [zoom.transformMatrix]);

            return (
              <rect
                style={{
                  cursor: zoom.isDragging ? "grabbing" : "grab",
                  touchAction: "none",
                }}
                ref={zoom.containerRef}
                width={zoomRectParams.width}
                height={zoomRectParams.height}
                x={zoomRectParams.x}
                y={zoomRectParams.y}
                fill={"transparent"}
                onTouchStart={zoom.dragStart}
                onTouchMove={zoom.dragMove}
                onTouchEnd={zoom.dragEnd}
                onMouseDown={zoom.dragStart}
                onMouseMove={zoom.dragMove}
                onMouseUp={zoom.dragEnd}
                onMouseLeave={() => {
                  if (zoom.isDragging) zoom.dragEnd();
                }}
                onDoubleClick={(event) => {
                  const point = localPoint(event) || { x: 0, y: 0 };
                  zoom.scale({ scaleX: 1.1, scaleY: 1.1, point });
                }}
              />
            );
          }}
        </Zoom>
        {/* y axes and line series */}
        {yAxesConfiguration.map((config, configIdx) => {
          const { id, points, strokeColor, getYScale, transformRef, dashed } =
            config;
          // const [localZoomMatrix, setLocalZoomMatrix] =
          //   useState(initialTransform);

          // useEffect(() => {
          //   console.log(
          //     "y-axis + line component for id",
          //     id,
          //     "rendered first time"
          //   );
          // }, []);

          const yScale = getYScale(height);
          const zoomedXScale = rescaleXAxis(xScale, globalZoomMatrix);
          // const zoomedYScale = rescaleYAxis(yScale, initialTransform);
          // const zoomedXScale = rescaleXAxis(xScale, {
          //   ...initialTransform,
          //   translateX: margin.left,
          // });

          return (
            <React.Fragment key={nanoid()}>
              <Zoom<SVGRectElement>
                width={margin.left}
                height={height}
                // initialTransformMatrix={{
                //   ...initialTransform,
                // }}

                scaleYMax={4}
                scaleYMin={1 / 2}
                initialTransformMatrix={{
                  ...initialTransform,
                }}
              >
                {(individualAxisZoom) => {
                  if (transformRef.current === null) {
                    transformRef.current = {
                      ...initialTransform,
                      translateY: individualAxisZoom.transformMatrix.translateY,
                      scaleY: individualAxisZoom.transformMatrix.scaleY,
                    };
                  }
                  // negative scaling zoom drop detection for individual axis
                  const prevScaleY = transformRef.current.scaleY;
                  const newScaleY = individualAxisZoom.transformMatrix.scaleY;
                  const scaleYDiff = newScaleY - prevScaleY;
                  const absScaleDiff = Math.abs(scaleYDiff);
                  const scaleDiffBarrier =
                    prevScaleY / 10 + (prevScaleY / 10) * 0.001;
                  // translate drop detection for individual axis
                  const prevTranslateY = transformRef.current.translateY;
                  const newTranslateY =
                    individualAxisZoom.transformMatrix.translateY;
                  const translateYDiff = Math.abs(
                    newTranslateY - prevTranslateY
                  );
                  const translateYBarrier = 10;

                  if (prevScaleY < 1 && absScaleDiff > scaleDiffBarrier) {
                    individualAxisZoom.setTransformMatrix(transformRef.current);
                  } else if (
                    prevScaleY > 1 &&
                    absScaleDiff > scaleDiffBarrier
                  ) {
                    individualAxisZoom.setTransformMatrix(transformRef.current);
                  } else if (
                    prevTranslateY !== 0 &&
                    newTranslateY === 0 &&
                    translateYDiff > translateYBarrier
                  ) {
                    individualAxisZoom.setTransformMatrix(transformRef.current);
                  }

                  transformRef.current = {
                    ...initialTransform,
                    translateY: individualAxisZoom.transformMatrix.translateY,
                    scaleY: individualAxisZoom.transformMatrix.scaleY,
                  };

                  const localComposedMatrix = composeMatrices(
                    globalZoomMatrix,
                    transformRef.current
                  );
                  const zoomedYScale = rescaleYAxis(
                    yScale,
                    localComposedMatrix
                  );

                  return (
                    <>
                      <Group
                        transform={`translate(${
                          margin.left + margin.left * configIdx
                        }, 0)`}
                      >
                        <YAxis
                          objectId={id}
                          strokeColor={strokeColor}
                          zoomedYScale={zoomedYScale}
                          height={height}
                        />
                        <rect
                          style={{
                            touchAction: "none",
                            cursor: "ns-resize",
                          }}
                          width={margin.left}
                          x={-margin.left}
                          y={margin.top}
                          height={height > 0 ? height - margin.top : 0}
                          // fill="red"
                          strokeWidth={4}
                          // stroke="red"
                          fill="transparent"
                          ref={individualAxisZoom.containerRef}
                          onTouchStart={individualAxisZoom.dragStart}
                          onTouchMove={individualAxisZoom.dragMove}
                          onTouchEnd={individualAxisZoom.dragEnd}
                          onMouseDown={individualAxisZoom.dragStart}
                          onMouseMove={individualAxisZoom.dragMove}
                          onMouseUp={individualAxisZoom.dragEnd}
                          onMouseLeave={() => {
                            if (individualAxisZoom.isDragging) {
                              individualAxisZoom.dragEnd();
                            }
                          }}
                          onDoubleClick={(event) => {
                            const point = localPoint(event) || {
                              x: 0,
                              y: 0,
                            };
                            individualAxisZoom.scale({
                              scaleX: 1.1,
                              scaleY: 1.1,
                              point,
                            });
                          }}
                        />
                      </Group>
                      <Group clipPath={`url(#${mainZoomRectClipId})`}>
                        <LinePath
                          id={id}
                          data={points}
                          // x={(d) => xScale(d.timestamp)}
                          // y={(d) => yScale(d.value)}
                          // move transform matrix one level above and re-count it based on current global zoom state
                          x={(d) => zoomedXScale(d.timestamp)}
                          y={(d) => zoomedYScale(d.value)}
                          stroke={strokeColor}
                          strokeWidth={2}
                          fill="none"
                          strokeDasharray={dashed ? `10,10,10` : undefined}
                          // transform={stringifyTransformMatrix({
                          transform={stringifyTransformMatrix(
                            localComposedMatrix
                          )}
                          // curve={curveStepAfter}
                        />
                      </Group>
                    </>
                  );
                }}
              </Zoom>
            </React.Fragment>
          );
        })}
      </svg>
      <Legend
        yAxesConfiguration={yAxesConfiguration}
        setYAxesConfiguration={setYAxesConfiguration}
      />
    </>
  );
};

export default LineChart;
