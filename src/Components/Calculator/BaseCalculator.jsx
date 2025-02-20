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
    20: "20X",
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

    const initialMargin = (Number(entryPrice) * Number(quantity)) / leverage
    const pnl =
      mode === "long"
        ? (Number(exitPrice) - Number(entryPrice)) * Number(quantity)
        : (Number(entryPrice) - Number(exitPrice)) * Number(quantity)
    const roi = (pnl / initialMargin) * 100

    onCalculate({ initialMargin, pnl, roi })
  }

  const containerStyle = {
    width: "100%",
    padding: "24px",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  }

  const inputStyle = {
    width: "100%",
    padding: "8px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    fontSize: "14px",
  }

  const buttonStyle = {
    width: "100%",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s",
  }

  const longButtonStyle = {
    ...buttonStyle,
    backgroundColor: inputs.mode === "long" ? "#10B981" : "#E5E7EB",
    color: inputs.mode === "long" ? "white" : "black",
  }

  const shortButtonStyle = {
    ...buttonStyle,
    backgroundColor: inputs.mode === "short" ? "#EF4444" : "#E5E7EB",
    color: inputs.mode === "short" ? "white" : "black",
  }

  const calculateButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#3B82F6",
    color: "white",
  }

  return (
    <div style={containerStyle}>
      <div style={{ position: "relative" }}>
        <input
          type="number"
          value={inputs.coinPrice}
          onChange={(e) => setInputs({ ...inputs, coinPrice: e.target.value })}
          placeholder="Coin Price"
          style={inputStyle}
        />
        <span
          style={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "14px",
            color: "#6B7280",
          }}
        >
          USDT
        </span>
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <button style={longButtonStyle} onClick={() => setInputs({ ...inputs, mode: "long" })}>
          Long
        </button>
        <button style={shortButtonStyle} onClick={() => setInputs({ ...inputs, mode: "short" })}>
          Short
        </button>
      </div>

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "8px" }}>
          <span>Leverage: {inputs.leverage}X</span>
          <span>{marks[inputs.leverage]}</span>
        </div>
        <Slider
          min={1}
          max={125}
          marks={marks}
          value={inputs.leverage}
          onChange={(value) => setInputs({ ...inputs, leverage: value })}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
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
              fontSize: "14px",
              color: "#6B7280",
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
              fontSize: "14px",
              color: "#6B7280",
            }}
          >
            USDT
          </span>
        </div>

        <input
          type="number"
          value={inputs.quantity}
          onChange={(e) => setInputs({ ...inputs, quantity: e.target.value })}
          placeholder="Quantity"
          style={inputStyle}
        />
      </div>

      <button onClick={calculateBase} style={calculateButtonStyle}>
        Calculate
      </button>
    </div>
  )
}

export default BaseCalculator

