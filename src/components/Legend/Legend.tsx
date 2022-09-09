import "antd/dist/antd.css";
import type { IYAxisConfig } from "@/types/chart.types";
import { nanoid } from "nanoid";
import { Button, Popover, Checkbox } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { useState } from "react";

import { SketchPicker, SketchPickerProps } from "react-color";
import type { Color } from "react-color";

type Props = {
  yAxesConfiguration: IYAxisConfig[];
  setYAxesConfiguration: React.Dispatch<React.SetStateAction<IYAxisConfig[]>>;
};

const legendTextStyles = {
  display: "block",
  paddingTop: "0.9rem",
  marginLeft: "1rem",
  fontSize: "1rem",
  color: "white",
};

const legendRect = {
  width: 35,
  height: 25,
};

const Legend = (props: Props) => {
  const { yAxesConfiguration, setYAxesConfiguration } = props;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        marginLeft: "1rem",
      }}
    >
      {/* type assertion is used due to length check guard in LineChart */}
      {yAxesConfiguration!.map((config) => {
        const { id, strokeColor, dashed } = config;
        const [open, setOpen] = useState(false);

        const hide = () => {
          setOpen(false);
        };

        const handleOpenChange = (newOpen: boolean) => {
          setOpen(newOpen);
        };

        const updateStrokeColor = (color: any) => {
          setYAxesConfiguration((prev) => {
            return prev.map((config) => {
              if (id === config.id) {
                return {
                  ...config,
                  strokeColor: color.hex,
                };
              } else {
                return config;
              }
            });
          });
        };

        const onCheckboxChange = (e: CheckboxChangeEvent) => {
          setYAxesConfiguration((prev) => {
            return prev.map((config) => {
              if (id === config.id) {
                return {
                  ...config,
                  dashed: e.target.checked,
                };
              } else {
                return config;
              }
            });
          });
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
                  width: legendRect.width,
                  height: legendRect.height,
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
  );
};

export default Legend;
