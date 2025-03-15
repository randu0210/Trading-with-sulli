import React, { useState } from "react";
import { Slider } from "antd"

const TargetPriceCalculator = ({ onCalculate }) => {
  const [inputs, setInputs] = useState({
    coinPrice: "",
    entryPrice: "",
    exitPrice: "",
    quantity: "",
    roi: "",
    leverage: 1,
    mode: "long",
  })

  const marks = {
    1: "1X",
    25: "25X",
    50: "50X",
    75: "75X",
    100: "100X",
    125: "125X"
  }

  const calculateBase = () => {
    const { entryPrice, exitPrice, quantity, leverage, mode, roi } = inputs

    if (!entryPrice || !roi || leverage < 1) {
      return alert("Please fill all fields correctly.")
    }

    let targetPrice = 0;

    if (mode === "long") {
      targetPrice = entryPrice * (1 + (roi / (100 * leverage)));
    } else if (mode === "short") {
      targetPrice = entryPrice * (1 - (roi / (100 * leverage)));
    } else {
      return "Invalid trade type. Use 'long' or 'short'.";
    }

    onCalculate({ targetPrice })
  }

  const containerStyle = {
    width: "100%",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.0)",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  }

  const inputStyle = {
    width: "100%",
    padding: "8px 40px 8px 12px",
    borderRadius: "12px",
    fontSize: "16px",
    fontFamily: 'PP Neue Montreal',
    backgroundColor: '#F4F7FF',
  }

  const buttonStyle = {
    width: "100%",
    padding: "10px",
    border: "none",
    borderRadius: "12px",
    fontSize: "20px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s",
  }

  const longButtonStyle = {
    ...buttonStyle,
    backgroundColor: inputs.mode === "long" ? "#40DA69" : "#F4F7FF",
    color: inputs.mode === "long" ? "white" : "black",
  }

  const shortButtonStyle = {
    ...buttonStyle,
    backgroundColor: inputs.mode === "short" ? "#EE3F3F" : "#F4F7FF",
    color: inputs.mode === "short" ? "white" : "black",
  }

  const calculateButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#3B82F6",
    color: "white",
  }

  return (
    <div style={containerStyle} className="md:pr-[20px] pr-0">
      <hr class="my-[10px] h-0.5 border-t-0 bg-neutral-100" />
     

      <div style={{ display: "flex", gap: "14px" }}>
        <button style={longButtonStyle} className="!font-[450]" onClick={() => setInputs({ ...inputs, mode: "long" })}>
          Long
        </button>
        <button style={shortButtonStyle} className="!font-[450]" onClick={() => setInputs({ ...inputs, mode: "short" })}>
          Short
        </button>
      </div>

      <div>
        <div className="flex items-center justify-center bg-blue-50 text-gray-600 text-base rounded-[12px] py-2 w-full">
          {inputs.leverage}X
        </div>
        <Slider
          min={1}
          className="!mt-[20px] !m-[0px] !ml-[10px] !mr-[15px]"
          max={125}
          marks={marks}
          value={inputs.leverage}
          onChange={(value) => setInputs({ ...inputs, leverage: value })}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" } } className="pt-[32px]">
        <div style={{ position: "relative" }}>
          <input
            type="number"
            value={inputs.entryPrice}
            onChange={(e) => setInputs({ ...inputs, entryPrice: e.target.value })}
            style={inputStyle}
            placeholder="Entry Price"
          />
          <span
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "16px",
              color: "#020202",
            }}
          >
            USDT
          </span>
        </div>
        <div style={{ position: "relative" }}>
          <input
            type="number"
            value={inputs.roi}
            onChange={(e) => setInputs({ ...inputs, roi: e.target.value })}
            style={inputStyle}
            placeholder="ROI"
          />
          <span
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "16px",
              color: "#020202",
            }}
          >
            %
          </span>

        </div>
      </div>

      <button onClick={calculateBase} style={calculateButtonStyle}>
        Calculate
      </button>
    </div>
  )
};

export default TargetPriceCalculator;
