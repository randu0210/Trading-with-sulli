import { useState, useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  LineController,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Header from "../UI/Header";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import localizedFormat from "dayjs/plugin/localizedFormat";
import _ from "lodash";
import DownloadIcon from "../../assets/downloadIcon.png";
import ImpactHigh from "../../assets/impact3.svg";
import ImpactMedium from "../../assets/impact2.svg";
import ImpactLow from "../../assets/impact1.svg";
import USFlag from "../../assets/US.svg";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

// Register required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  LineController,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const COUNTRY = "united states";
const API_KEY = import.meta.env.VITE_API_KEY;

const Chart = () => {
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState({});
  const [description, setDescription] = useState("-");
  const [activeTab, setActiveTab] = useState("summary");
  const chartRef = useRef(null);
  const data = useSelector((state) => state.calendar.dataCalendar);
  const formattedDateTime = dayjs(`${data.date} ${data.time}`)
    .tz("America/New_York")
    .format("DD MMM YYYY, HH:mm [UTC]Z");

  const endDate = dayjs(data?.date).format("YYYY-MM-DD");
  const startDate = dayjs(data?.date).subtract(1, "year").format("YYYY-MM-DD");
  const [forecastLabel, setForecastLabel] = useState("");
  const chartDataRef = useRef();
  const [trendLineAdded, setTrendLineAdded] = useState(false);

  useEffect(() => {
    fetchData(startDate, endDate);
    fetchDescription();
  }, [startDate, endDate]);

  useEffect(() => {
    chartDataRef.current = chartData; // Update the ref whenever chartData changes
  }, [chartData]);

  const fetchDataForecast = async () => {
    const category = data?.category;
    try {
      const response = await axios.get(
        `https://api.tradingeconomics.com/forecast/country/united%20states/indicator/${category}?c=${API_KEY}`
      );
      const apiData = response.data;
  
      // Extract forecast data
      const forecastData = apiData[0]; // Assuming the response is an array with one object
  
      // Extract labels (q1_date to q4_date)
      const FRlabels = [
        dayjs(forecastData.q1_date).format("MMM YYYY"),
        dayjs(forecastData.q2_date).format("MMM YYYY"),
        dayjs(forecastData.q3_date).format("MMM YYYY"),
        dayjs(forecastData.q4_date).format("MMM YYYY"),
      ];

      setForecastLabel([
        dayjs(forecastData.q1_date).format("MMM YYYY"),
        dayjs(forecastData.q2_date).format("MMM YYYY"),
        dayjs(forecastData.q3_date).format("MMM YYYY"),
        dayjs(forecastData.q4_date).format("MMM YYYY"),
      ]);
  
      // Extract values (q1 to q4)
      const forecastValues = [
        forecastData.q1,
        forecastData.q2,
        forecastData.q3,
        forecastData.q4,
      ];
  
      // Update chart data with forecast
      // setChartData((prevData) => ({
      //   ...prevData,
      //   labels,
      //   datasets: [
      //     {
      //       label: "Forecast",
      //       data: values,
      //       borderColor: "#ffa500",
      //       backgroundColor: "transparent",
      //       borderWidth: 1,
      //     },
      //   ],
      // }));
    const historicalLabels = chartDataRef.current?.labels || [];
    const historicalValues = chartDataRef.current?.datasets[0]?.data || [];

    // Gabungkan label dan nilai
    const combinedLabels = [...new Set([...historicalLabels, ...FRlabels])];
    const combinedValues = [...historicalValues, ...forecastValues];

    setChartData({
      labels: combinedLabels,
      datasets: [
        {
          label: "Value",
          data: historicalValues,
          backgroundColor: historicalValues.map((v) => (v < 0 ? "#f87171" : "#007bff")),
          borderColor: "#ffffff",
          borderWidth: 1,
        },
        {
          label: "Forecast Data",
          data: [...Array(historicalValues.length).fill(null), ...forecastValues],
          backgroundColor: forecastValues.map(() => "#ffa500"), 
          borderColor: "#ffffff",
          borderWidth: 1,
        },
      ],
    });
    
    } catch (error) {
      console.error("Error fetching forecast data:", error);
    }
  };

  const fetchData = async (startDate, endDate) => {
    const category = data?.category;
    try {
      const response = await axios.get(
        `https://api.tradingeconomics.com/historical/country/${COUNTRY}/indicator/${category}/${startDate}/${endDate}?c=${API_KEY}`
      );
      const apiData = response.data;

      // Aggregate data by month
      const aggregatedData = {};
      apiData.forEach((item) => {
        const date = new Date(item.DateTime);
        const monthYear = `${date.toLocaleString("en-US", { month: "short" })} ${date.getFullYear()}`;

        if (!aggregatedData[monthYear]) {
          aggregatedData[monthYear] = {
            total: 0,
            count: 0,
          };
        }
        aggregatedData[monthYear].total += item.Value;
        aggregatedData[monthYear].count += 1;
      });

      // Create labels and values from aggregated data
      const labels = Object.keys(aggregatedData);
      const values = labels.map((monthYear) => {
        return aggregatedData[monthYear].total / aggregatedData[monthYear].count; // Calculate average
      });

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
        plugins: {
          legend: { display: false },
          title: { display: true, text: "", font: { size: 18 } },
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 12 } } },
          y: { grid: { display: false }, ticks: { font: { size: 12 } } },
        },
      });

      if( activeTab === "forecast"){
        fetchDataForecast()
      }

      if (activeTab === "stats") {
        setTimeout(() => {
          addTrendLine()
        }, "2000");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDescription = async () => {
    const formattedDate = dayjs(data?.date).subtract(1, "month").format("YYYY-MM-DD");
    const endDate = dayjs(data?.date).add(1, "day").format("YYYY-MM-DD");
    const category = data?.category;
    try {
      const response = await axios.get(
        `https://api.tradingeconomics.com/news/country/${COUNTRY}/${category}?c=${API_KEY}&d1=${formattedDate}&d2=${endDate}&f=json`
      );
      const latestData = _.maxBy(response.data, (item) => new Date(item.date));
      setDescription(latestData?.description);
    } catch (error) {
      console.error("Error fetching description:", error);
    }
  };

  const addTrendLine = () => {
    const latestChartData = chartDataRef.current; // Access the latest data from the ref
    if (latestChartData) {
      const values = latestChartData.datasets[0].data;
      const trend = values.map((_, i) => values[0] + (values[values.length - 1] - values[0]) * (i / (values.length - 1)));
  
      setChartData((prevData) => ({
        ...prevData,
        datasets: [
          ...prevData.datasets.filter((dataset) => dataset.label !== "Trend Line"),
          {
            label: "Trend Line",
            data: trend,
            type: "line",
            borderColor: "#ff0000",
            borderWidth: 2,
            fill: false,
            pointRadius: 0,
          },
        ],
      }));
    }
  };

  useEffect(() => {
    if (activeTab === "stats" || activeTab === "forecast") {
      setDescription("-");
      if (activeTab === "forecast") {
        fetchDataForecast();
      } else if (activeTab === "stats") {
        addTrendLine();
        setChartData((prevData) =>
          prevData
            ? {
                ...prevData,
                labels: _.filter(prevData.labels, (label) => !forecastLabel.includes(label)), 
                datasets: _.filter(prevData.datasets, (dataset) => dataset.label !== "Forecast Data"),
              }
            : null
        );
      }
    } else {
      fetchDescription();
      setChartData((prevData) =>
        prevData
          ? {
              ...prevData,
              labels: _.filter(prevData.labels, (label) => !forecastLabel.includes(label)), 
              datasets: _.filter(prevData.datasets, (dataset) => dataset.label !== "Trend Line" && dataset.label !== "Forecast Data"),
            }
          : null
      );
    }
  }, [activeTab]);

  const fetchLast3Years = () => {
    fetchData(dayjs().subtract(3, "year").format("YYYY-MM-DD"), endDate)
    }

  const exportChart = () => {
    const chart = chartRef.current;
    if (chart) {
      const link = document.createElement("a");
      link.href = chart.toBase64Image();
      link.download = "chart.jpg";
      link.click();
    }
  };

  return (
    <div className="p-0 w-full min-h-screen bg-white">
      <Header />
      <div className="px-[12px] md:px-[274px]">
        <div className="mb-6">
          <div className="flex items-center gap-[12px] pt-[49px] md:pt-[72px] pb-[8px]">
            <img src="/src/assets/US.svg" alt="US Flag" className="w-5 h-5" />
            <span className="text-[16px] font-[400]">
              USD | {formattedDateTime} |{" "}
              {data.impact === 3 ? (
                <img src={ImpactHigh} alt="High Impact" className="w-5 h-5 inline-block" />
              ) : data.impact === 2 ? (
                <img src={ImpactMedium} alt="Medium Impact" className="w-5 h-5 inline-block" />
              ) : (
                <img src={ImpactLow} alt="Low Impact" className="w-5 h-5 inline-block" />
              )}
            </span>
          </div>
          <h1 className="text-[32px] md:text-[54px] font-[450] leading-[40px]">{data.data}</h1>

          <div className="flex gap-[8px] md:gap-[20px] py-[24px]">
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

          <p className="text-[#242424] md:text-[20px] text-[16px] leading-[32px]">{description}</p>
        </div>

        <div className="border border-[#CCCCCC] rounded-[12px] mb-[140px] pb-2">
          <div className="flex items-center justify-between md:px-[40px] px-[12px] py-[20px]">
            <div className="flex gap-4">
              <button
                className="px-4 py-2 rounded-lg md:text-[16px] text-[14px]"
                onClick={() => fetchLast3Years()}
              >
                3Y
              </button>
              <button
                className="px-4 py-2 rounded-lg md:text-[16px] text-[14px]"
                onClick={() => fetchData(dayjs().subtract(5, "year").format("YYYY-MM-DD"), endDate)}
              >
                5Y
              </button>
              <button
                className="px-4 py-2 rounded-lg md:text-[16px] text-[14px]"
                onClick={() => fetchData(dayjs().subtract(10, "year").format("YYYY-MM-DD"), endDate)}
              >
                10Y
              </button>
            </div>
            <button
              className="px-4 py-2 shadow-sm rounded-[12px] md:text-[16px] flex items-center gap-2 text-[14px]"
              onClick={exportChart}
            >
              <img src={DownloadIcon} alt="Download Icon" className="w-5 h-5" />
              Download ScreenShot
            </button>
          </div>
          <hr className="my-[10px] mx-3 h-0.5 border-t-0 bg-neutral-100" />
          {chartData ? (
            <div className="w-full overflow-x-auto">
              <div className="min-h-[300px] min-w-[700px] md:px-[40px] px-[12px] md:pb-[20px] pb-[16px]">
                <Bar ref={chartRef} data={chartData} options={chartOptions} />
              </div>
            </div>
          ) : (
            <p>Loading chart...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chart;