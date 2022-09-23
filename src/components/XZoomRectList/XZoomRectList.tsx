import React, { useEffect, useRef } from "react";
import { PressurePoint } from "@/types/chart.types";
import {
  initialTransform,
  margin,
  scaleYMax,
  scaleYMin,
  xAxesHeight,
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
  width: number;
};

const XZoomRectList = (props: Props) => {
  const { data, height, width } = props;
  const updateXZoom = useLineChartStore((state) => state.updateXZoom);
  const splitXAxes = useLineChartStore((state) => state.splitXAxes);

  return (
    <>
      {splitXAxes
        ? data.map((obj, index, arr) => {
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
                        updateXZoom(id, individualAxisZoom.transformMatrix);
                      }
                      if (firstRender.current) {
                        firstRender.current = false;
                      }
                    }, [individualAxisZoom.transformMatrix]);

                    return (
                      <Group
                        key={nanoid()}
                        transform={`translate(${
                          margin.left + margin.left * arr.length
                        }, 0)`}
                      >
                        <rect
                          style={{
                            touchAction: "none",
                            cursor: "ew-resize",
                          }}
                          width={width - margin.left * (arr.length + 1)}
                          x={-margin.left}
                          y={height + xAxesHeight * index}
                          height={xAxesHeight}
                          fill="transparent"
                          strokeWidth={1}
                          stroke="orange"
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
          })
        : null}
    </>
  );
};

export default XZoomRectList;
