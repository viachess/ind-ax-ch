import { ParentSize } from "@visx/responsive";
import { LineChart } from "@/components/LineChart";

const containerStyles = {
  width: "100%",
  height: "50vh",
};
function randomNumFromInterval(min: number, max: number) {
  // min and max included
  return Math.random() * (max - min + 1) + min;
}
const baseTime = 1661247658000;
const tagList = [
  {
    tag: "TNB_YARPRIM_1_OBJ_1",
    range: [2.2, 2.5],
  },
  {
    tag: "TNB_YARPRIM_1_OBJ_2",
    range: [2.1, 2.4],
  },
  {
    tag: "TNB_YARPRIM_1_OBJ_3",
    range: [2.5, 2.7],
  },
  {
    tag: "TNB_YARPRIM_1_OBJ_4",
    range: [2.1, 2.8],
  },
  {
    tag: "TNB_YARPRIM_1_OBJ_5",
    range: [2.2, 2.5],
  },
];

const data = [
  {
    id: "TNB_YARPRIM_1_OBJ_1",
    points: [
      { value: 2.209, timestamp: 1661247628000 },
      { value: 2.134, timestamp: 1661247670000 },
      { value: 5.455, timestamp: 1661247684000 },
      { value: 2.266, timestamp: 1661247695000 },
      { value: 2.379, timestamp: 1661247707000 },
    ],
  },
  {
    id: "TNB_YARPRIM_2_OBJ_3",
    points: [
      { value: 1.433, timestamp: 1661247663000 },
      { value: 4.234, timestamp: 1661247670000 },
      { value: 6.115, timestamp: 1661247684000 },
      { value: 7.366, timestamp: 1661247695000 },
      { value: 5.679, timestamp: 1661247767000 },
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
  {
    id: "TNB_PRIMYAR_4_OBJ_22",
    points: [
      { value: 10.544, timestamp: 1661247658000 },
      { value: 10.533, timestamp: 1661247670000 },
      { value: 10.225, timestamp: 1661247684000 },
      { value: 10.616, timestamp: 1661247695000 },
      { value: 10.979, timestamp: 1661247707000 },
    ],
  },
  {
    id: "TNB_PRIMYAR_4_OBJ_32",
    points: [
      { value: 1.544, timestamp: 1661247658000 },
      { value: 1.733, timestamp: 1661247670000 },
      { value: 1.995, timestamp: 1661247684000 },
      { value: 1.516, timestamp: 1661247695000 },
      { value: 1.979, timestamp: 1661247707000 },
    ],
  },
];

function LineChartPage() {
  // small dataset to test view correctness

  // large dataset generator to test chart overload
  // const data = tagList.map((info) => {
  //   const points = [];
  //   for (let i = 0; i < 5000; i++) {
  //     points.push({
  //       value: randomNumFromInterval(info.range[0], info.range[1]),
  //       timestamp: baseTime + Math.floor(randomNumFromInterval(5000, 7000)) * i,
  //     });
  //   }
  //   return {
  //     id: info.tag,
  //     points,
  //   };
  // });
  return (
    <div style={containerStyles}>
      <h4 style={{ color: "white", fontWeight: "500" }}>
        Тренды разницы давлений (последние 30 минут)
      </h4>
      <ParentSize>
        {(parent) => {
          return <LineChart parent={parent} data={data} />;
        }}
      </ParentSize>
    </div>
  );
}

export default LineChartPage;
