import { useState, useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Header from "../UI/Header";
import Footer from "../UI/Footer";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

// Register required components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const COUNTRY = "united states";
const API_KEY = import.meta.env.VITE_API_KEY;

const Chart = () => {
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState({});
  const [Description, setDescription] = useState("");
  const [activeTab, setActiveTab] = useState('summary');
  const chartRef = useRef(null);
  const data = useSelector((state) => state.calendar.dataCalendar);
  const formattedDateTime = dayjs(`${data.date} ${data.time}`)
    .tz("America/New_York") // Change to your desired timezone
    .format("DD MMM YYYY, HH:mm [UTC]Z");


  useEffect(() => {
    fetchData();
    fetchDescription();
  }, []);

  const fetchData = async () => {
    const formattedDate = dayjs(data?.date).format("YYYY-MM-DD");
    const endDate = dayjs(data?.date).subtract(1, "year").format("YYYY-MM-DD");
    const category = data?.category;
    try {
      const response = await axios.get(
        `https://api.tradingeconomics.com/historical/country/${COUNTRY}/indicator/${category}/${endDate}/${formattedDate}?c=${API_KEY}`
      );
      const data = response.data;

      // Convert data to chart format
      const labels = data.map((item) =>
        new Date(item.DateTime).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        })
      );
      const values = data.map((item) => item.Value);

      // Set min and max values for X-axis
      const minValue = Math.min(...values) - 0.5;
      const maxValue = Math.max(...values) + 0.5;

      setChartData({
        labels,
        datasets: [
          {
            label: "Value",
            data: values,
            backgroundColor: values.map((v) => (v < 0 ? "#f87171" : "#007bff")),
            borderColor: "#ffffff",
            borderWidth: 1,
          },
        ],
      });

      setChartOptions({
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "x",
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: "United States Interest Rate",
            font: { size: 18 },
          },
        },
        scales: {
          x: {
            min: minValue,
            max: maxValue,
            grid: { display: false },
            ticks: { font: { size: 12 } },
          },
          y: {
            grid: { display: false },
            ticks: { font: { size: 12 } },
          },
        },
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDescription = async () => {
    const formattedDate = dayjs(data?.date).subtract(1, 'month').format("YYYY-MM-DD");
    const endDate = dayjs(data?.date).add(1, "day").format("YYYY-MM-DD");
    const category = data?.category;
    try {
      const response = await axios.get(
        `https://api.tradingeconomics.com/news/country/${COUNTRY}/${category}?c=${API_KEY}&d1=${formattedDate}&d2=${endDate}`
      );

      const data = response;
      setDescription(data?.description)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const exportChart = () => {
    const chart = chartRef.current;
    if (chart) {
      const link = document.createElement("a");
      link.href = chart.toBase64Image();
      link.download = "interest_rate_chart.jpg";
      link.click();
    }
  };

  return (
    <div className="p-0 w-full min-h-screen bg-white">
      <Header />
      <div className="px-4 pt-4 md:px-20">
        {/* Title and Description Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <img src="/src/assets/US.svg" alt="US Flag" className="w-5 h-5" />
            <span className="text-sm text-gray-600">USD | {formattedDateTime} | {data.impact === 3 ? "❗❗❗" : data.impact === 2 ? "❗❗" : "❗"}</span>
          </div>
          <h1 className="text-2xl font-bold mb-4">{data.data}</h1>

          {/* Navigation Tabs */}
          <div className="flex gap-4 mb-4">
            <button
              className={`px-4 py-2 rounded-full ${activeTab === 'summary' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
              onClick={() => setActiveTab('summary')}
            >
              Summary
            </button>
            <button
              className={`px-4 py-2 rounded-full ${activeTab === 'stats' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
              onClick={() => setActiveTab('stats')}
            >
              Stats
            </button>
            <button
              className={`px-4 py-2 rounded-full ${activeTab === 'forecast' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
              onClick={() => setActiveTab('forecast')}
            >
              Forecast
            </button>
          </div>

          {/* Description Text */}
          <p className="text-gray-700 mb-4">{Description}</p>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            <button className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-50" onClick={() => exportChart()}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PNG
            </button>
          </div>
        </div>

        {/* Chart Section */}
        {chartData ? (
          <>
            <div className="min-h-110 px-10">
              <Bar ref={chartRef} data={chartData} options={chartOptions} />
            </div>
          </>
        ) : (
          <p>Loading chart...</p>
        )}
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default Chart;
