import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, DatePicker } from "antd";
import dayjs from "dayjs";
import _ from "lodash";
import { FilterOutlined, InstagramOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { FaTiktok, FaXTwitter } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Header from "../UI/Header";
import Footer from "../UI/Footer";
import { useDispatch } from "react-redux";
import { setDataCalendar } from "../../Store/Reducer/CalendarReducer";


const API_KEY = import.meta.env.VITE_API_KEY;
const COUNTRY = "united states";

const EconomicCalendar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [activeButton, setActiveButton] = useState("thisWeek"); // State untuk tombol aktif

    useEffect(() => {
        fetchThisWeekData();
    }, []);

    const fetchCalendarData = async (startDate, endDate) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `https://api.tradingeconomics.com/calendar/country/${COUNTRY}/${startDate}/${endDate}?c=${API_KEY}`
            );

            const formattedData = response.data.map((event, index) => ({
                key: index.toString(),
                date: dayjs(event.Date).format("YYYY-MM-DD"),
                time: dayjs(event.Date).format("HH:mm"),
                currency: "US",
                category: event.Category,
                data: event.Event,
                impact: event.Importance || "Low",
                actual: event.Actual || "-",
                forecast: event.Forecast || "-",
                previous: event.Previous || "-",
            }));

            const groupedData = _.groupBy(formattedData, "date");
            setData(groupedData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleButtonClick = (buttonType, fetchData) => {
        setActiveButton(buttonType);
        fetchData();
    };

    const fetchThisWeekData = () => {
        const startDate = dayjs().startOf("week").format("YYYY-MM-DD");
        const endDate = dayjs().endOf("week").format("YYYY-MM-DD");
        fetchCalendarData(startDate, endDate);
    };

    const fetchLastWeekData = () => {
        const startDate = dayjs().subtract(1, "week").startOf("week").format("YYYY-MM-DD");
        const endDate = dayjs().subtract(1, "week").endOf("week").format("YYYY-MM-DD");
        fetchCalendarData(startDate, endDate);
    };

    const fetchNextWeekData = () => {
        const startDate = dayjs().add(1, "week").startOf("week").format("YYYY-MM-DD");
        const endDate = dayjs().add(1, "week").endOf("week").format("YYYY-MM-DD");
        fetchCalendarData(startDate, endDate);
    };

    const fetchNextMonthData = () => {
        const startDate = dayjs().add(1, "month").startOf("month").format("YYYY-MM-DD");
        const endDate = dayjs().add(1, "month").endOf("month").format("YYYY-MM-DD");
        fetchCalendarData(startDate, endDate);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        const formattedDate = dayjs(date).format("YYYY-MM-DD");
        const endDate = dayjs(date).add(1, "day").format("YYYY-MM-DD");
        fetchCalendarData(formattedDate, endDate);
        setActiveButton(null); // Menghapus pilihan tombol yang aktif saat memilih tanggal
    };
    const handleCellClick = (record) => {
        dispatch(setDataCalendar(record));
        navigate('/detail')
    }

    const columns = [
        { title: "Time", dataIndex: "time", key: "time", width: 80, className: "text-center" },
        {
            title: "Currency",
            dataIndex: "currency",
            key: "currency",
            width: 100,
            render: (currency) => (
                <span className="font-semibold flex items-center gap-2">
                    <img src="/src/assets/US.svg" alt="US Flag" className="w-5 h-5" />
                    {currency.toUpperCase()}
                </span>
            ),
        },
        {
            title: "Data", dataIndex: "data", key: "data", width: 250, className: "whitespace-nowrap", onCell: (record) => ({
                onClick: () => handleCellClick(record),
                style: {cursor: "pointer"},
            }),
        },
        {
            title: "Impact",
            dataIndex: "impact",
            key: "impact",
            width: 100,
            render: (impact) => (
                <span className="text-lg">
                    {impact === 3 ? "❗❗❗" : impact === 2 ? "❗❗" : "❗"}
                </span>
            ),
        },
        { title: "Actual", dataIndex: "actual", key: "actual", width: 100, className: "text-center" },
        { title: "Forecast", dataIndex: "forecast", key: "forecast", width: 100, className: "text-center" },
        { title: "Previous", dataIndex: "previous", key: "previous", width: 100, className: "text-center" },
        { title: "Previous", dataIndex: "previous", key: "previous", width: 100, className: "text-center" },
    ];

    return (
        <div className="p-0 w-full min-h-screen bg-white">
            <Header/>
            <div className="px-4 pt-4 md:px-20 flex flex-wrap justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl md:text-4xl font-bold text-gray-900">Economic Calendar</h1>
                    <div className="flex flex-wrap gap-2 mt-4">
                        <Button
                            onClick={() => handleButtonClick("lastWeek", fetchLastWeekData)}
                            type={activeButton === "lastWeek" ? "primary" : "default"}
                            className="text-sm rounded-full px-4 py-2"
                        >
                            Last week
                        </Button>
                        <Button
                            onClick={() => handleButtonClick("thisWeek", fetchThisWeekData)}
                            type={activeButton === "thisWeek" ? "primary" : "default"}
                            className="text-sm rounded-full px-4 py-2"
                        >
                            This Week
                        </Button>
                        <Button
                            onClick={() => handleButtonClick("nextWeek", fetchNextWeekData)}
                            type={activeButton === "nextWeek" ? "primary" : "default"}
                            className="text-sm rounded-full px-4 py-2"
                        >
                            Next Week
                        </Button>
                        <Button
                            onClick={() => handleButtonClick("nextMonth", fetchNextMonthData)}
                            type={activeButton === "nextMonth" ? "primary" : "default"}
                            className="text-sm rounded-full px-4 py-2"
                        >
                            Next Month
                        </Button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                    <DatePicker
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="w-full md:w-auto px-4 py-2 bg-gray-100 rounded-full"
                    />
                    <Button icon={<FilterOutlined />} className="text-sm border-gray-300 bg-gray-100 rounded-full px-4 py-2">
                        Filter
                    </Button>
                </div>
            </div>

            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : (
                Object.entries(data).map(([date, records]) => (
                    <div key={date} className="px-20 mb-6 w-full">
                        <h2 className="mb-3 text-lg md:text-xl font-bold px-4 py-2 bg-blue-100 text-gray-900 rounded-full inline-block">
                            {dayjs(date).format("dddd, DD MMM YYYY")}
                        </h2>
                        <Table columns={columns} dataSource={records} pagination={false} bordered className="shadow-md w-full" scroll={{ x: 'max-content' }} />
                    </div>
                ))
            )}
            {/* <Footer/> */}
        </div>
    );
};

export default EconomicCalendar;
