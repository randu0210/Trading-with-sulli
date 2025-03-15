import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Slider } from "antd"

const BaseCalculator = ({ onCalculate }) => {
  const [inputs, setInputs] = useState({
    coinPrice: "",
    entryPrice: "",
    exitPrice: "",
    quantity: "",
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
    const { entryPrice, exitPrice, quantity, leverage, mode } = inputs

    if (!entryPrice || !exitPrice || !quantity || leverage < 1) {
      return alert("Please fill all fields correctly.")
    }
    let initialMargin = 0;
    let pnl = 0;
    let roi = 0;
    initialMargin = (Number(entryPrice) * Number(quantity)) / leverage
    pnl =
      mode === "long"
        ? (Number(exitPrice) - Number(entryPrice)) * Number(quantity)
        : (Number(entryPrice) - Number(exitPrice)) * Number(quantity)
    roi = (pnl / initialMargin) * 100

    onCalculate({ initialMargin, pnl, roi })
  }

  const containerStyle = {
    width: "100%",
    backgroundColor: "white",
    display: "flex",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.0)",
    flexDirection: "column",
    gap: "20px"
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

  const coinStyle = {
    ...buttonStyle,
    marginBottom: "20px"
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
          className="!mt-[20px] !m-[0px] !ml-[10px] !mr-[15px]"
          min={1}
          max={125}
          marks={marks}
          value={inputs.leverage}
          onChange={(value) => setInputs({ ...inputs, leverage: value })}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }} className="!mt-[32px]">
        <div style={{ position: "relative" }}>
          <input
            type="number"
            value={inputs.entryPrice}
            onChange={(e) => setInputs({ ...inputs, entryPrice: e.target.value })}
            placeholder="Entry Price"
            style={inputStyle}
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
            value={inputs.exitPrice}
            onChange={(e) => setInputs({ ...inputs, exitPrice: e.target.value })}
            placeholder="Exit Price"
            style={inputStyle}
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
          value={inputs.quantity}
          onChange={(e) => setInputs({ ...inputs, quantity: e.target.value })}
          style={inputStyle}
          placeholder="Quantity"
        />
        </div>
      </div>

      <button onClick={calculateBase} style={calculateButtonStyle}>
        Calculate
      </button>
    </div>
  )
}

export default BaseCalculator

