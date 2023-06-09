import { useLineChartStore } from "@/state";
import { PressurePoint } from "@/types/chart.types";
import { margin, xAxesHeight } from "@/utils/constants";
import { nanoid } from "nanoid";
import { XAxis } from "../XAxis";

type Props = {
  timestampsArr: Date[][] | Date[];
  width: number;
  height: number;
};

type Props2 = {
  WinCCOA: string;
  offsetLeft: number;
  timestampsArr: Date[];
  index: number;
  tagListLength: number;
} & Pick<Props, "height" | "width">;

const SplitAxesXAxisView = (props: Props2) => {
  const {
    WinCCOA,
    offsetLeft,
    height,
    width,
    timestampsArr,
    index,
    tagListLength,
  } = props;
  const config = useLineChartStore((state) => state.axesConfiguration[WinCCOA]);
  const { strokeColor } = config;

  return (
    <XAxis
      key={WinCCOA}
      tagListLength={tagListLength}
      height={height}
      offsetLeft={offsetLeft}
      timestampsArr={timestampsArr}
      width={width}
      offsetTop={xAxesHeight * index}
      xTransformMatrix={config.xTransformMatrix}
      strokeColor={strokeColor}
    />
  );
};

const XAxesContainer = (props: Props) => {
  const { width, height, timestampsArr } = props;

  const splitXAxes = useLineChartStore((state) => state.splitXAxes);
  const axesConfigurationTagList = useLineChartStore(
    (state) => state.axesConfigurationTagList
  );
  const tagListLength = axesConfigurationTagList.length;
  const offsetLeft = tagListLength * margin.left;
  console.log("x axes container render log");
  return (
    <>
      {splitXAxes ? (
        axesConfigurationTagList.map((WinCCOA, index) => {
          return (
            <SplitAxesXAxisView
              key={WinCCOA}
              WinCCOA={WinCCOA}
              width={width}
              height={height}
              index={index}
              offsetLeft={offsetLeft}
              timestampsArr={timestampsArr[index] as Date[]}
              tagListLength={tagListLength}
            />
          );
        })
      ) : (
        <XAxis
          tagListLength={tagListLength}
          height={height}
          width={width}
          offsetLeft={offsetLeft}
          timestampsArr={timestampsArr as Date[]}
        />
      )}
    </>
  );
};

export default XAxesContainer;
