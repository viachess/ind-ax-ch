import { ParentSize } from "@visx/responsive";
import { LineChart } from "@/components/LineChart";

const containerStyles = {
  width: "100%",
  height: "50vh",
};

function LineChartPage() {
  return (
    <div style={containerStyles}>
      <h4 style={{ color: "white", fontWeight: "500" }}>
        Тренды разницы давлений (последние 30 минут)
      </h4>
      <ParentSize>
        {(parent) => {
          return <LineChart parent={parent} />;
        }}
      </ParentSize>
    </div>
  );
}

export default LineChartPage;
