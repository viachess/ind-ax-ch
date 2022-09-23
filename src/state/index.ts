import { IAxisConfig } from "@/types/chart.types";
import { initialTransform, margin } from "@/utils/constants";
import { TransformMatrix } from "@visx/zoom/lib/types";
import create from "zustand";

interface LineChartState {
  globalZoomMatrix: TransformMatrix;
  // increase: (by: number) => void
  splitXAxes: boolean;
  setSplitXAxes: (val: boolean) => void;
  setGlobalZoomMatrix: (newMatrix: TransformMatrix) => void;
  axesConfiguration: IAxisConfig[] | [];
  getAxesConfiguration: () => IAxisConfig[];
  setAxesConfiguration: (newConfig: IAxisConfig[]) => void;
  updateYZoom: (id: string, newMatrix: TransformMatrix) => void;
  updateXZoom: (id: string, newMatrix: TransformMatrix) => void;
}

export const useLineChartStore = create<LineChartState>((set, get) => ({
  globalZoomMatrix: { ...initialTransform, translateX: margin.left },
  setGlobalZoomMatrix: (newMatrix) => {
    set({
      globalZoomMatrix: newMatrix,
    });
  },
  splitXAxes: false,
  setSplitXAxes: (val) => set({ splitXAxes: val }),
  axesConfiguration: [],
  getAxesConfiguration: () => get().axesConfiguration,
  setAxesConfiguration: (newConfig) => {
    set({
      axesConfiguration: newConfig,
    });
  },
  updateYZoom: (id, newMatrix) => {
    const yConfig = get().axesConfiguration;
    const searchRes = yConfig.find((el) => el.id === id);
    if (!searchRes) {
      return;
    }
    const { yTransformMatrix: oldMatrix } = searchRes;

    if (
      oldMatrix.scaleY !== newMatrix.scaleY ||
      oldMatrix.translateY !== newMatrix.translateY
    ) {
      set(() =>
        // state
        ({
          axesConfiguration: yConfig.map((config) => {
            if (config.id === id) {
              return {
                ...config,
                yTransformMatrix: {
                  ...initialTransform,
                  // take out only y-related props to update the scale
                  scaleY: newMatrix.scaleY,
                  translateY: newMatrix.translateY,
                },
              };
            } else {
              return config;
            }
          }),
        })
      );
    }
  },
  updateXZoom: (id, newMatrix) => {
    const axesConfig = get().axesConfiguration;
    const splitXPermitted = get().splitXAxes;
    if (!splitXPermitted) {
      return;
    }
    const searchRes = axesConfig.find((el) => el.id === id);
    if (!searchRes) {
      return;
    }
    const { xTransformMatrix: oldMatrix } = searchRes;

    if (
      oldMatrix.scaleX !== newMatrix.scaleX ||
      oldMatrix.translateX !== newMatrix.translateX
    ) {
      set(() =>
        // state
        ({
          axesConfiguration: axesConfig.map((config) => {
            if (config.id === id) {
              return {
                ...config,
                xTransformMatrix: {
                  ...initialTransform,
                  // take out only x-related props to update the scale
                  scaleX: newMatrix.scaleX,
                  translateX: newMatrix.translateX,
                },
              };
            } else {
              return config;
            }
          }),
        })
      );
    }
  },
}));
