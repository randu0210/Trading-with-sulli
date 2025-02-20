import { useState } from "react"
import { Tabs } from "antd"
// import BaseCalculator from "./BaseCalculator"
// import OnewayCalculator from "./OnewayCalculator"
import MaxOpenCalculator from "./MaxOpenCalculator"
import TargetPriceCalculator from "./TargetPriceCalculator"
import BaseCalculator from "./BaseCalculator"
import OpenPriceCalculator from "./OpenPriceCalculator"
import Header from "../UI/Header"
import Footer from "../UI/Footer"

const { TabPane } = Tabs

const FuturesCalculator = () => {
  const [result, setResult] = useState({})

  const handleCalculate = (newResult) => {
    setResult(newResult)
  }

  return (
    <div className="w-full pb-10 bg-white">
      <Header />
      <div className="px-4 pt-4 md:px-20">
        <h1 className="text-2xl font-bold mb-6">Futures Calculator</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs defaultActiveKey="base">
              <TabPane tab="PnL" key="base">
                <BaseCalculator onCalculate={handleCalculate} />
              </TabPane>
              <TabPane tab="Target Price" key="target">
                <TargetPriceCalculator onCalculate={handleCalculate} />
              </TabPane>
              {/*
            <TabPane tab="One-way" key="oneway">
              <OnewayCalculator onCalculate={handleCalculate} />
            </TabPane>
            */}
              <TabPane tab="Max Open" key="maxopen">
                <MaxOpenCalculator onCalculate={handleCalculate} />
              </TabPane>
              <TabPane tab="Open price" key="openprice">
                <OpenPriceCalculator onCalculate={handleCalculate} />
              </TabPane>
            </Tabs>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Result</h2>
            {result.initialMargin && (
              <div className="mb-2">
                <span className="font-medium">Initial Margin:</span> {result.initialMargin.toFixed(2)} USDT
              </div>
            )}
            {result.targetPrice && (
              <div className="mb-2">
                <span className="font-medium">Target Price:</span> {result.targetPrice.toFixed(2)} USDT
              </div>
            )}
            {result.pnl && (
              <div className="mb-2">
                <span className="font-medium">PNL:</span> {result.pnl.toFixed(2)} USDT
              </div>
            )}
            {result.roi && (
              <div className="mb-2">
                <span className="font-medium">ROI:</span> {result.roi.toFixed(2)}%
              </div>
            )}
            {result.liquidationPrice && (
              <div className="mb-2">
                <span className="font-medium">Liquidation Price:</span> {result.liquidationPrice.toFixed(2)} USDT
              </div>
            )}
            {result.maxOpenCoin && (
              <div className="mb-2">
                <span className="font-medium">Max Open (Coin):</span> {result.maxOpenCoin.toFixed(6)}
              </div>
            )}
            {result.maxOpenUSDT && (
              <div className="mb-2">
                <span className="font-medium">Max Open (USDT):</span> {result.maxOpenUSDT.toFixed(2)} USDT
              </div>
            )}
            {result.avgPrice && (
              <div className="mb-2">
                <span className="font-medium">AVG Price :</span> {result.avgPrice.toFixed(2)}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  )
}

export default FuturesCalculator

