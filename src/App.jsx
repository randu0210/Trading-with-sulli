import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import './App.css'
import EconomicCalendar from './Components/Pages/EconomicCalendar'
import Chart from "./Components/Pages/Chart";
import FuturesCalculator from "./Components/Calculator/FuturesCalculator";
import Footer from "./Components/UI/Footer";

function App() {

  return (
    <div className="tracking-wide font-normal min-h-screen flex flex-col">
      <main className="flex-1">
    <Router>
      <Routes>
        <Route path="/" element={<EconomicCalendar />} />
        <Route path="/detail" element={<Chart/>} />
        <Route path="/calculator" element={<FuturesCalculator />} />
      </Routes>
    </Router>
    </main>
    <Footer />
    </div>
  )
}

export default App
