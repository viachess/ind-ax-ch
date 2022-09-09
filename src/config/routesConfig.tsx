import { LineChartPage } from "../pages/LineChartPage";
import PlaceholderComponent from "../pages/PlaceholderComponent";

export const routes = [
  {
    path: "/",
    element: <LineChartPage />,
    linkText: "Line chart",
  },
  {
    path: "/placeholder",
    element: <PlaceholderComponent />,
    linkText: "Placeholder",
  },
];
