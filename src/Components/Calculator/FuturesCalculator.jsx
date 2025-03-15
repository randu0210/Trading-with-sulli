import { useState } from "react"
import LiquidationPriceCalculator from "./LiquidationPriceCalculator"
import MaxOpenCalculator from "./MaxOpenCalculator"
import TargetPriceCalculator from "./TargetPriceCalculator"
import BaseCalculator from "./BaseCalculator"
import OpenPriceCalculator from "./OpenPriceCalculator"
import { Button } from "antd"
import Header from "../UI/Header"
import Footer from "../UI/Footer"


const FuturesCalculator = () => {
  const [result, setResult] = useState({})
  const [activeCalculator, setActiveCalculator] = useState("pnl");

  const [inputs, setInputs] = useState({
    coinPrice: "",
    entryPrice: "",
    exitPrice: "",
    quantity: "",
    leverage: 1,
    mode: "long",
  })

  const handleCalculate = (newResult) => {
    setResult(newResult)
  }

  const inputStyle = {
    width: "100%",
    padding: "8px 40px 8px 12px",
    borderRadius: "12px",
    fontSize: "16px",
    fontFamily: 'PP Neue Montreal',
    backgroundColor: '#F4F7FF',
  }

  const containerStyle = {
    width: "100%",
    paddingRight: "40px",
    backgroundColor: "white",
    display: "flex",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.0)",
    flexDirection: "column",
    // gap:"20px"
  }

  return (
    <div className="w-full pb-10 bg-white">
      <Header />
      <div className="px-[12px] md:px-[130px]">
        <h1 className="text-[32px] md:text-[54px] font-[450] md:pt-[64px] py-[20px]">Futures Calculator</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
            <div className="md:col-span-2 flex flex-wrap gap-[8px] md:gap-[20px]">
              <Button
                onClick={() => setActiveCalculator("pnl")}
                className={`text-base rounded-[12px] !px-[16px] !py-[10px] `}
                style={{
                  backgroundColor: activeCalculator === "pnl" ? "#2B63FF" : "#F4F7FF",
                  color: activeCalculator === "pnl" ? "#ffffff" : "#626366",
                  border: "none",
                  fontSize: '16px'
                }}
              >
                PnL
              </Button>
              <Button
                onClick={() => setActiveCalculator("targetPrice")}
                className={`text-sm rounded-[12px] !px-[16px] !py-[10px]`}
                style={{
                  backgroundColor: activeCalculator === "targetPrice" ? "#2B63FF" : "#F4F7FF",
                  color: activeCalculator === "targetPrice" ? "#ffffff" : "#626366",
                  border: "none",
                  fontSize: '16px'
                }}
              >
                Target Price
              </Button>
              <Button
                onClick={() => setActiveCalculator("liquidationPrice")}
                className={`text-sm rounded-[12px] !px-[16px] !py-[10px] `}
                style={{
                  backgroundColor: activeCalculator === "liquidationPrice" ? "#2B63FF" : "#F4F7FF",
                  color: activeCalculator === "liquidationPrice" ? "#ffffff" : "#626366",
                  border: "none",
                  fontSize: '16px'
                }}
              >
                Liquidation Price
              </Button>
              <Button
                onClick={() => setActiveCalculator("maxOpen")}
                className={`text-sm rounded-[12px] !px-[16px] !py-[10px]`}
                style={{
                  backgroundColor: activeCalculator === "maxOpen" ? "#2B63FF" : "#F4F7FF",
                  color: activeCalculator === "maxOpen" ? "#ffffff" : "#626366",
                  border: "none",
                  fontSize: '16px'
                }}
              >
                Max Open
              </Button>
              <Button
                onClick={() => setActiveCalculator("openPrice")}
                className={`text-sm rounded-[12px] !px-[16px] !py-[10px]`}
                style={{
                  backgroundColor: activeCalculator === "openPrice" ? "#2B63FF" : "#F4F7FF",
                  color: activeCalculator === "openPrice" ? "#ffffff" : "#626366",
                  border: "none",
                  fontSize: '16px'
                }}
              >
                Open Price
              </Button>

            </div>

            {/*  */}
            {/* <div className="md:col-span-2">
            <Tabs defaultActiveKey="base">
              <TabPane tab="PnL" key="base">
                <BaseCalculator onCalculate={handleCalculate} />
              </TabPane>
              <TabPane tab="Target Price" key="target">
                <TargetPriceCalculator onCalculate={handleCalculate} />
              </TabPane>
              <TabPane tab="Liquidation Price" key="liquidation">
                <LiquidationPriceCalculator onCalculate={handleCalculate} />
              </TabPane>
              <TabPane tab="Max Open" key="maxopen">
                <MaxOpenCalculator onCalculate={handleCalculate} />
              </TabPane>
              <TabPane tab="Open price" key="openprice">
                <OpenPriceCalculator onCalculate={handleCalculate} />
              </TabPane>
            </Tabs>
          </div> */}

            <div className="md:col-span-2 gap-[40px] max-h-[620px]">
              {activeCalculator === "pnl" && <BaseCalculator onCalculate={handleCalculate} />}
              {activeCalculator === "targetPrice" && <TargetPriceCalculator onCalculate={handleCalculate} />}
              {activeCalculator === "liquidationPrice" && <LiquidationPriceCalculator onCalculate={handleCalculate} />}
              {activeCalculator === "maxOpen" && <MaxOpenCalculator onCalculate={handleCalculate} />}
              {activeCalculator === "openPrice" && <OpenPriceCalculator onCalculate={handleCalculate} />}
            </div>

            <div className="bg-[#F4F7FF] rounded-lg">
              <h2 className="pt-[28px] pl-[28px] text-[28px] font-[450] mb-4">Result</h2>
              {result.initialMargin && (
                <div className="flex justify-between mb-2 px-[28px]">
                  <span className="font-[450] text-[#626366]">Initial Margin</span> <span className="font-[450]">{result.initialMargin.toFixed(2)} USDT </span>
                </div>
              )}
              {result.targetPrice && (
                <div className="flex justify-between mb-2 px-[28px]">
                  <span className="font-[450] text-[#626366]">Target Price</span> <span className="font-[450]"> {result.targetPrice.toFixed(2)} USDT </span>
                </div>
              )}
              {result.pnl && (
                <div className="flex justify-between mb-2 px-[28px]">
                  <span className="font-[450] text-[#626366]">PNL </span> <span className="font-[450]">{result.pnl.toFixed(2)} USDT </span>
                </div>
              )}
              {result.roi && (
                <div className="flex justify-between mb-2 px-[28px]">
                  <span className="font-[450] text-[#626366]">ROI</span> <span className="font-[450]">{result.roi.toFixed(2)}%</span>
                </div>
              )}
              {result.maxOpenCoin && (
                <div className="flex justify-between mb-2 px-[28px]">
                  <span className="font-[450] text-[#626366]">Max Open (Coin)</span> <span className="font-[450]">{result.maxOpenCoin.toFixed(6)}</span>
                </div>
              )}
              {result.maxOpenUSDT && (
                <div className="flex justify-between mb-2 px-[28px]">
                  <span className="font-[450] text-[#626366]">Max Open (USDT)</span> <span className="font-[450]">{result.maxOpenUSDT.toFixed(2)} USDT </span>
                </div>
              )}
              {result.avgPrice && (
                <div className="flex justify-between mb-2 px-[28px]">
                  <span className="font-[450] text-[#626366]">AVG Price </span> <span className="font-[450]"> {result.avgPrice.toFixed(2)} </span>
                </div>
              )}
              {result.liquidationPrice && (
                <div className="flex justify-between mb-2 px-[28px]">
                  <span className="font-[450] text-[#626366]">Liquidation Price </span> <span className="font-[450]">{result.liquidationPrice.toFixed(2)} USDT </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  )
}

export default FuturesCalculator
