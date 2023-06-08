import React, { useEffect, useRef } from "react";
import { PressurePoint } from "@/types/chart.types";
import {
  initialTransform,
  margin,
  scaleXMax,
  scaleXMin,
  scaleYMax,
  scaleYMin,
} from "@/utils/constants";
import { Zoom } from "@visx/zoom";
import { TransformMatrix } from "@visx/zoom/lib/types";
import { localPoint } from "@visx/event";
import { nanoid } from "nanoid";
import { Group } from "@visx/group";
import { useLineChartStore } from "@/state";
import { compareStringArrays } from "@/utils/utils";

type Props = {
  // data: {
  //   id: string;
  //   points: PressurePoint[];
  // }[];
  height: number;
};

type Props2 = {
  WinCCOA: string;
  index: number;
} & Props;

const SplitAxesYZoomRect = (props: Props2) => {
  const { WinCCOA, height, index } = props;
  const updateYZoom = useLineChartStore((state) => state.updateYZoom);

  return (
    <Zoom<SVGRectElement>
      width={margin.left}
      height={height}
      scaleXMin={scaleXMin}
      scaleXMax={scaleXMax}
      scaleYMin={scaleYMin}
      scaleYMax={scaleYMax}
      initialTransformMatrix={{ ...initialTransform }}
    >
      {(individualAxisZoom) => {
        const firstRender = useRef(true);
        useEffect(() => {
          if (!firstRender.current) {
            updateYZoom(WinCCOA, individualAxisZoom.transformMatrix);
          }
          if (firstRender.current) {
            firstRender.current = false;
          }
        }, [individualAxisZoom.transformMatrix]);

        return (
          <Group
            key={nanoid()}
            transform={`translate(${margin.left + margin.left * index}, 0)`}
          >
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
              strokeWidth={1}
              stroke="green"
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
        );
      }}
    </Zoom>
  );
};

const YZoomRectList = (props: Props) => {
  const { height } = props;
  const axesConfigurationTagList = useLineChartStore(
    (state) => state.axesConfigurationTagList
  );

  useEffect(() => {
    console.log("Y Zoom rect list initial render");
  }, []);

  return (
    <>
      {axesConfigurationTagList.map((WinCCOA, index) => {
        return (
          <SplitAxesYZoomRect
            key={WinCCOA}
            WinCCOA={WinCCOA}
            index={index}
            height={height}
          />
        );
      })}
    </>
  );
};

export default YZoomRectList;
