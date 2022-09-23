import "antd/dist/antd.css";
// import type { IYAxisConfig } from "@/types/chart.types";
import { nanoid } from "nanoid";
import { Button, Popover, Checkbox } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { useState, useEffect } from "react";

import { SketchPicker } from "react-color";
import { useLineChartStore } from "@/state";
import { PressurePoint } from "@/types/chart.types";

type Props = {
  data: {
    id: string;
    points: PressurePoint[];
  }[];
};

const legendTextStyles = {
  display: "block",
  paddingTop: "0.9rem",
  marginLeft: "1rem",
  fontSize: "1rem",
  color: "white",
};

const legendRectBounds = {
  width: 35,
  height: 25,
};

const Legend = (props: Props) => {
  const { data } = props;
  const axesConfiguration = useLineChartStore(
    (state) => state.axesConfiguration
  );
  const getAxesConfiguration = useLineChartStore(
    (state) => state.getAxesConfiguration
  );
  const setYAxesConfiguration = useLineChartStore(
    (state) => state.setAxesConfiguration
  );

  // useEffect(() => {
  //   console.log("legend render log");
  //   console.log("y axes config value");
  //   console.log(yAxesConfiguration);
  // }, [yAxesConfiguration]);

  return (
    <>
      {data.length === 0 ? (
        <p>empty legend</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "1rem",
          }}
        >
          {/* type assertion is used due to length check guard in LineChart */}
          {axesConfiguration.map((config) => {
            const { id, strokeColor, dashed } = config;
            const [open, setOpen] = useState(false);

            const hide = () => {
              setOpen(false);
            };

            const handleOpenChange = (newOpen: boolean) => {
              setOpen(newOpen);
            };

            const updateStrokeColor = (color: any) => {
              const newConfig = getAxesConfiguration().map((config) => {
                if (id === config.id) {
                  return {
                    ...config,
                    strokeColor: color.hex,
                  };
                } else {
                  return config;
                }
              });

              setYAxesConfiguration(newConfig);
            };

            const onCheckboxChange = (e: CheckboxChangeEvent) => {
              const newConfig = getAxesConfiguration().map((config) => {
                if (id === config.id) {
                  return {
                    ...config,
                    dashed: e.target.checked,
                  };
                } else {
                  return config;
                }
              });
              setYAxesConfiguration(newConfig);
            };

            return (
              <div
                key={nanoid()}
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Popover
                  content={
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <SketchPicker
                        color={strokeColor}
                        onChangeComplete={updateStrokeColor}
                      />
                      <Checkbox
                        onChange={onCheckboxChange}
                        style={{ marginTop: "1rem" }}
                        checked={dashed}
                      >
                        Dashed
                      </Checkbox>
                      <a
                        style={{ display: "block", marginTop: "1rem" }}
                        onClick={hide}
                      >
                        Close
                      </a>
                    </div>
                  }
                  title="Настройки тренда"
                  trigger="click"
                  placement="topRight"
                  open={open}
                  onOpenChange={handleOpenChange}
                >
                  <Button
                    style={{
                      backgroundColor: strokeColor,
                      width: legendRectBounds.width,
                      height: legendRectBounds.height,
                      cursor: "pointer",
                    }}
                  >
                    s
                  </Button>
                </Popover>

                <p style={legendTextStyles}>{id}</p>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Legend;
