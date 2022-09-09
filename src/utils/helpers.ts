import type { ProvidedZoom, TransformMatrix } from "@visx/zoom/lib/types";
import type { ScaleLinear, ScaleTime } from "d3-scale";
import type { ZoomState } from "@/types/chart.types";

export const rescaleYAxis = <T>(
  scale: ScaleLinear<number, number, never>,
  // zoom: ProvidedZoom<T> & ZoomState
  transformMatrix: TransformMatrix
) => {
  // const { transformMatrix } = zoom;
  let newDomain = scale.range().map((r) => {
    return scale.invert(
      (r - transformMatrix.translateY) / transformMatrix.scaleY
    );
  });
  return scale.copy().domain(newDomain);
};

export const rescaleXAxis = <T>(
  scale: ScaleTime<number, number, never>,
  transformMatrix: TransformMatrix
) => {
  const range = scale.range();
  let newDomain = range.map((r) => {
    const xTransform =
      (r - transformMatrix.translateX) / transformMatrix.scaleX;
    return scale.invert(xTransform);
  });
  return scale.copy().domain(newDomain);
};

export const stringifyTransformMatrix = (mat: TransformMatrix) => {
  const { translateX, translateY, scaleX, scaleY, skewX, skewY } = mat;
  return `matrix(${scaleX}, ${skewY}, ${skewX}, ${scaleY}, ${translateX}, ${translateY})`;
};
