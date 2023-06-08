import { IAxisConfig } from "@/types/chart.types";
import { initialTransform, margin } from "@/utils/constants";
import { TransformMatrix } from "@visx/zoom/lib/types";
import create from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";

type WinccoaTag = string;
type WinCCOATagList = WinccoaTag[];
export type AxesConfigurationRecord = Record<WinccoaTag, IAxisConfig>;
interface LineChartState {
  globalZoomMatrix: TransformMatrix;
  splitXAxes: boolean;
  setSplitXAxes: (val: boolean) => void;
  setGlobalZoomMatrix: (newMatrix: TransformMatrix) => void;
  axesConfigurationTagList: WinCCOATagList;
  getAxesConfigurationTagList: () => WinCCOATagList;
  setAxesConfigurationTagList: (list: WinCCOATagList) => void;
  axesConfiguration: AxesConfigurationRecord;
  getAxesConfiguration: () => AxesConfigurationRecord;
  setAxesConfiguration: (newConfig: AxesConfigurationRecord) => void;
  updateYZoom: (WinCCOA: string, newMatrix: TransformMatrix) => void;
  updateXZoom: (WinCCOA: string, newMatrix: TransformMatrix) => void;
}

export const useLineChartStore = create<LineChartState>()(
  devtools(
    immer((set, get) => ({
      globalZoomMatrix: { ...initialTransform, translateX: margin.left },
      setGlobalZoomMatrix: (newMatrix) => {
        set((state) => {
          state.globalZoomMatrix = newMatrix;
        });
      },
      splitXAxes: false,
      setSplitXAxes: (val) => set({ splitXAxes: val }),
      axesConfigurationTagList: [],
      getAxesConfigurationTagList: () => get().axesConfigurationTagList,
      setAxesConfigurationTagList: (list) => {
        // local version, in reality make a reducer for object list changes
        // with ADD, REMOVE, RESET actions.
        set((state) => {
          state.axesConfigurationTagList = list;
        });
      },
      axesConfiguration: {},
      getAxesConfiguration: () => get().axesConfiguration,
      setAxesConfiguration: (newConfig) => {
        set({
          axesConfiguration: newConfig,
        });
      },
      updateYZoom: (WinCCOA, newMatrix) => {
        set((state) => {
          const config = state.axesConfiguration[WinCCOA];
          if (!config) {
            return;
          }
          const { yTransformMatrix: oldMatrix } = config;

          if (
            oldMatrix.scaleY !== newMatrix.scaleY ||
            oldMatrix.translateY !== newMatrix.translateY
          ) {
            state.axesConfiguration[WinCCOA].yTransformMatrix = {
              ...initialTransform,
              // take out only y-related props to update the scale
              scaleY: newMatrix.scaleY,
              translateY: newMatrix.translateY,
            };
          }
        });
      },
      updateXZoom: (WinCCOA, newMatrix) => {
        set((state) => {
          if (!state.splitXAxes) return;
          const config = state.axesConfiguration[WinCCOA];
          if (!config) return;

          const { xTransformMatrix: oldMatrix } = config;

          if (
            oldMatrix.scaleX !== newMatrix.scaleX ||
            oldMatrix.translateX !== newMatrix.translateX
          ) {
            state.axesConfiguration[WinCCOA].xTransformMatrix = {
              ...initialTransform,
              // take out only x-related props to update the scale
              scaleX: newMatrix.scaleX,
              translateX: newMatrix.translateX,
            };
          }
        });
      },
    }))
  )
);
