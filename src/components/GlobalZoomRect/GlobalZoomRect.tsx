import React, { useEffect, useCallback } from "react";
// import { Zoom } from "@visx/zoom";
import { localPoint } from "@visx/event";

import type { TransformMatrix } from "@visx/zoom/lib/types";

import {
  initialTransform,
  margin,
  scaleYMin,
  scaleYMax,
  scaleXMax,
  scaleXMin,
} from "@/utils/constants";
import { useLineChartStore } from "@/state";
import { ZustandZoom } from "../ZustandZoom";

type Props = {
  // tooltipContainerRef: (element: SVGElement | HTMLElement | null) => void;
  width: number;
  height: number;
  zoomRectParams: {
    width: number;
    height: number;
    x: number;
    y: number;
  };
  // onMouseOver: (event: React.MouseEvent<SVGRectElement, MouseEvent>, datum: any) => void;
  // onMouseOver: React.MouseEventHandler<SVGRectElement>;
  // hideTooltip: () => void;
  // handleTooltip: (
  //   event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>
  // ) => void;
};

const GlobalZoomRect = (props: Props) => {
  const {
    width,
    height,
    zoomRectParams,
    // hideTooltip, handleTooltip
  } = props;
  const globalZoomMatrix = useLineChartStore((state) => state.globalZoomMatrix);
  const setGlobalZoomMatrix = useLineChartStore(
    (state) => state.setGlobalZoomMatrix
  );

  return (
    <ZustandZoom<SVGRectElement>
      width={width}
      height={height}
      scaleXMin={scaleXMin}
      scaleXMax={scaleXMax}
      scaleYMin={scaleYMin}
      scaleYMax={scaleYMax}
      // initialTransformMatrix={{
      //   ...initialTransform,
      //   translateX: margin.left,
      // }}
      transformMatrix={globalZoomMatrix}
      transformMatrixSetter={setGlobalZoomMatrix}
    >
      {(zoom) => {
        // useEffect(() => {
        //   // console.log("global zoom rect effect log");
        //   setGlobalZoomMatrix({ ...zoom.transformMatrix });
        // }, [zoom.transformMatrix]);

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
            onTouchStart={(event) => {
              zoom.dragStart(event);
              // handleTooltip(event);
            }}
            onTouchMove={(event) => {
              zoom.dragMove(event);
              // handleTooltip(event);
            }}
            onTouchEnd={zoom.dragEnd}
            onMouseDown={zoom.dragStart}
            onMouseMove={(event) => {
              zoom.dragMove(event);
              // handleTooltip(event);
            }}
            onMouseUp={zoom.dragEnd}
            onMouseLeave={() => {
              if (zoom.isDragging) zoom.dragEnd();
              // hideTooltip();
            }}
            // FIXME: remove type casting and replace with appropriate typings
            // onMouseOver={onMouseOver as React.MouseEventHandler<SVGRectElement>}
            // onMouseOver={onMouseOver}
            onDoubleClick={(event) => {
              const point = localPoint(event) || { x: 0, y: 0 };
              zoom.scale({ scaleX: 1.1, scaleY: 1.1, point });
            }}
          />
        );
      }}
    </ZustandZoom>
  );
};

export default GlobalZoomRect;
