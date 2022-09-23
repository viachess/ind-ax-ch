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
  "TNB_YARPRIM_1_OBJ_1",
  "TNB_YARPRIM_1_OBJ_2",
  "TNB_YARPRIM_1_OBJ_3",
  "TNB_YARPRIM_1_OBJ_4",
  "TNB_YARPRIM_1_OBJ_5",
];

function LineChartPage() {
  // const data = [
  //   {
  //     id: "TNB_YARPRIM_1_OBJ_1",
  //     points: [
  //       { value: 2.209, timestamp: 1661247658000 },
  //       { value: 2.134, timestamp: 1661247670000 },
  //       { value: 5.455, timestamp: 1661247684000 },
  //       { value: 2.266, timestamp: 1661247695000 },
  //       { value: 2.379, timestamp: 1661247707000 },
  //     ],
  //   },
  //   {
  //     id: "TNB_YARPRIM_2_OBJ_3",
  //     points: [
  //       { value: 1.433, timestamp: 1661247658000 },
  //       { value: 4.234, timestamp: 1661247670000 },
  //       { value: 6.115, timestamp: 1661247684000 },
  //       { value: 7.366, timestamp: 1661247695000 },
  //       { value: 5.679, timestamp: 1661247707000 },
  //     ],
  //   },
  //   {
  //     id: "TNB_PRIMYAR_4_OBJ_12",
  //     points: [
  //       { value: 10.544, timestamp: 1661247658000 },
  //       { value: 10.533, timestamp: 1661247670000 },
  //       { value: 10.225, timestamp: 1661247684000 },
  //       { value: 10.616, timestamp: 1661247695000 },
  //       { value: 10.979, timestamp: 1661247707000 },
  //     ],
  //   },
  // ];
  const data = tagList.map((tag) => {
    const points = [];
    for (let i = 0; i < 5000; i++) {
      points.push({
        value: randomNumFromInterval(3, 7),
        timestamp:
          baseTime + Math.floor(randomNumFromInterval(10000, 15000)) * i,
      });
    }
    return {
      id: tag,
      points,
    };
  });
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
