import { useLineChartStore } from "@/state";
import { PressurePoint } from "@/types/chart.types";
import { margin, xAxesHeight } from "@/utils/constants";
import { nanoid } from "nanoid";
import { XAxis } from "../XAxis";

type Props = {
  data: {
    id: string;
    points: PressurePoint[];
  }[];
  timestampsArr: Date[][] | Date[];
  width: number;
  height: number;
};

const XAxesContainer = (props: Props) => {
  const { data, width, height, timestampsArr } = props;

  const splitXAxes = useLineChartStore((state) => state.splitXAxes);
  const axesConfiguration = useLineChartStore(
    (state) => state.axesConfiguration
  );

  const offsetLeft = data.length * margin.left;

  return (
    <>
      {splitXAxes ? (
        axesConfiguration.map((config, idx) => {
          const { strokeColor } = config;
          return (
            <XAxis
              key={nanoid()}
              data={data}
              height={height}
              offsetLeft={offsetLeft}
              timestampsArr={timestampsArr[idx] as Date[]}
              width={width}
              offsetTop={xAxesHeight * idx}
              xTransformMatrix={config.xTransformMatrix}
              strokeColor={strokeColor}
            />
          );
        })
      ) : (
        <XAxis
          data={data}
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
