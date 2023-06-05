import React, { useEffect, useRef } from "react";
import { PressurePoint } from "@/types/chart.types";
import {
  initialTransform,
  margin,
  scaleYMax,
  scaleYMin,
} from "@/utils/constants";
import { Zoom } from "@visx/zoom";
import { TransformMatrix } from "@visx/zoom/lib/types";
import { localPoint } from "@visx/event";
import { nanoid } from "nanoid";
import { Group } from "@visx/group";
import { useLineChartStore } from "@/state";

type Props = {
  data: {
    id: string;
    points: PressurePoint[];
  }[];
  height: number;
};

const YZoomRectList = (props: Props) => {
  const { data, height } = props;
  const updateYZoom = useLineChartStore((state) => state.updateYZoom);
  // const getAxesConfiguration = useLineChartStore(
  //   (state) => state.getAxesConfiguration
  // );
  return (
    <>
      {data.map((obj, index) => {
        const { id } = obj;
        return (
          <React.Fragment key={nanoid()}>
            <Zoom<SVGRectElement>
              width={margin.left}
              height={height}
              scaleXMin={1 / 2}
              scaleXMax={4}
              scaleYMin={scaleYMin}
              scaleYMax={scaleYMax}
              initialTransformMatrix={{ ...initialTransform }}
            >
              {(individualAxisZoom) => {
                const firstRender = useRef(true);
                useEffect(() => {
                  if (!firstRender.current) {
                    updateYZoom(id, individualAxisZoom.transformMatrix);
                  }
                  if (firstRender.current) {
                    firstRender.current = false;
                  }
                  // console.log("useEffect reaction in y zoom rect. id: ", id);
                }, [individualAxisZoom.transformMatrix]);

                return (
                  <Group
                    key={nanoid()}
                    transform={`translate(${
                      margin.left + margin.left * index
                    }, 0)`}
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
          </React.Fragment>
        );
      })}
    </>
  );
};

export default YZoomRectList;
