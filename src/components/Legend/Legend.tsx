import "antd/dist/antd.css";
import { nanoid } from "nanoid";
import { Button, Popover, Checkbox } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { useState } from "react";

import { SketchPicker } from "react-color";
import { AxesConfigurationRecord, useLineChartStore } from "@/state";

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

type LegendItemProps = {
  WinCCOA: string;
};

const LegendItem = (props: LegendItemProps) => {
  const { WinCCOA } = props;

  const config = useLineChartStore((state) => state.axesConfiguration[WinCCOA]);
  const { strokeColor, dashed } = config;

  const getAxesConfiguration = useLineChartStore(
    (state) => state.getAxesConfiguration
  );
  const setAxesConfiguration = useLineChartStore(
    (state) => state.setAxesConfiguration
  );

  const [open, setOpen] = useState(false);

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const updateStrokeColor = (color: any) => {
    const newConfig: AxesConfigurationRecord = {};
    for (const [tag, config] of Object.entries(getAxesConfiguration())) {
      if (WinCCOA === tag) {
        newConfig[tag] = {
          ...config,
          strokeColor: color.hex,
        };
      } else {
        newConfig[tag] = {
          ...config,
        };
      }
    }
    setAxesConfiguration(newConfig);
  };

  const onCheckboxChange = (e: CheckboxChangeEvent) => {
    const newConfig: AxesConfigurationRecord = {};
    for (const [tag, config] of Object.entries(getAxesConfiguration())) {
      if (WinCCOA === tag) {
        newConfig[tag] = {
          ...config,
          dashed: e.target.checked,
        };
      } else {
        newConfig[tag] = {
          ...config,
        };
      }
    }

    setAxesConfiguration(newConfig);
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
            <a style={{ display: "block", marginTop: "1rem" }} onClick={hide}>
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

      <p style={legendTextStyles}>{WinCCOA}</p>
    </div>
  );
};

const Legend = () => {
  const axesConfigurationTagList = useLineChartStore(
    (state) => state.axesConfigurationTagList
  );

  return (
    <>
      {axesConfigurationTagList.length === 0 ? (
        <p>empty legend</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "1rem",
          }}
        >
          {axesConfigurationTagList.map((WinCCOA) => {
            return <LegendItem key={WinCCOA} WinCCOA={WinCCOA} />;
          })}
        </div>
      )}
    </>
  );
};

export default Legend;
