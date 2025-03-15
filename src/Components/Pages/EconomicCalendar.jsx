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
import detailIcon from '../../assets/detail.svg'


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
    // const mockData = () => {
    //     const mockData1 = [{ "CalendarId": "85653", "Date": "2016-12-02T00:30:00", "Country": "Australia", "Category": "Retail Sales MoM", "Event": "Retail Sales MoM", "Reference": "Oct", "ReferenceDate": "2016-10-31T00:00:00", "Source": "Australian Bureau of Statistics", "SourceURL": "http://www.abs.gov.au", "Actual": "0.5%", "Previous": "0.6%", "Forecast": "0.3%", "TEForecast": "0.2%", "URL": "/australia/retail-sales", "DateSpan": "0", "Importance": 2, "LastUpdate": "2016-12-02T00:30:00", "Revised": "", "Currency": "", "Unit": "%", "Ticker": "AUSRETAILSALESMOM", "Symbol": "AUSRetailSalesMoM" }, { "CalendarId": "103536", "Date": "2016-12-02T02:00:00", "Country": "Philippines", "Category": "Retail Price Index", "Event": "Retail Price Index YoY", "Reference": "Oct", "ReferenceDate": "2016-10-31T00:00:00", "Source": "Philippine Statistics Authority", "SourceURL": "https://psa.gov.ph", "Actual": "3.4%", "Previous": "3%", "Forecast": "", "TEForecast": "3.49%", "URL": "/philippines/retail-price-index", "DateSpan": "0", "Importance": 1, "LastUpdate": "2016-12-02T08:35:00", "Revised": "", "Currency": "", "Unit": "%", "Ticker": "PHLRPI", "Symbol": "PHLRPI" }, { "CalendarId": "103827", "Date": "2016-12-02T04:00:00", "Country": "East Timor", "Category": "Inflation Rate", "Event": "Inflation Rate YoY", "Reference": "Oct", "ReferenceDate": "2016-10-31T00:00:00", "Source": "National Statistics Directorate, Timor", "SourceURL": "https://inetl-ip.gov.tl/", "Actual": "-1.3%", "Previous": "-1.3%", "Forecast": "", "TEForecast": "-1.1%", "URL": "/east-timor/inflation-cpi", "DateSpan": "0", "Importance": 1, "LastUpdate": "2016-12-02T18:21:00", "Revised": "", "Currency": "", "Unit": "%", "Ticker": "TIMIMORINFNRATE", "Symbol": "TIMIMORINFNRATE" }]

    //     const formattedData = mockData1.map((event, index) => ({
    //         key: index.toString(),
    //         date: dayjs(event.Date).format("YYYY-MM-DD"),
    //         time: dayjs(event.Date).format("HH:mm"),
    //         currency: "USD",
    //         category: event.Category,
    //         data: event.Event,
    //         impact: event.Importance || "Low",
    //         actual: event.Actual || "-",
    //         forecast: event.Forecast || "-",
    //         previous: event.Previous || "-",
    //     }));
    //     const groupedData = _.groupBy(formattedData, "date");
    //     setData(groupedData);
    // }

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
        { title: "Time", dataIndex: "time", key: "time", width: 40, className: "text-center", align: "center" },
        {
            title: "Currency",
            dataIndex: "currency",
            key: "currency",
            width: 40,
            render: (currency) => (
                <span className="flex justify-center items-center gap-2">
                    <img src="/src/assets/US.svg" alt="US Flag" className="w-5 h-5" />
                    {currency}
                </span>
            ),
            onCell:() => ({ style:{fontWeight:300}}) ,
            align: "center"
        },
        {
            title: "Data", dataIndex: "data", key: "data", width: 250, className: "whitespace-nowrap", onCell: (record) => ({
                onClick: () => handleCellClick(record),
                style: { cursor: "pointer", fontWeight:450 },
            }),
            align: "left"
        },
        {
            title: "Impact",
            dataIndex: "impact",
            key: "impact",
            width: 100,
            render: (impact) => (
                <div className="flex justify-center items-center">
                    {impact === 3 ? (
                        <img src="/src/assets/impact3.svg" className="w-8 h-8" />
                    ) : impact === 2 ? (
                        <img src="/src/assets/impact2.svg" className="w-8 h-8" />
                    ) : (
                        <img src="/src/assets/impact1.svg" className="w-8 h-8" />
                    )}
                </div>
            ),
            onCell:() => ({ style:{fontWeight:450}}) ,
            align: "center"
        },
        { title: "Actual", dataIndex: "actual", key: "actual", width: 80, className: "text-center", align: "center",onCell:() => ({ style:{fontWeight:300}}) , },
        { title: "Forecast", dataIndex: "forecast", key: "forecast", width: 80, className: "text-center", align: "center",onCell:() => ({ style:{fontWeight:300}}) , },
        { title: "Previous", dataIndex: "previous", key: "previous", width: 80, className: "text-center", align: "center",onCell:() => ({ style:{fontWeight:300}}) , },
    ];

    return (
        <div className="p-0 w-full min-h-screen bg-white">
            <Header />
            <div className="px-3 md:px-32.5 mb-6"> 
                <h1 className="text-[32px] md:text-[54px] pt-[44px] pt-[44px] md:pt-[70px] font-[450] text-gray-900">Economic Calendar</h1>
                <div className="font-normal flex flex-col md:flex-row items-start md:items-center pt-4 md:pt-[20px] gap-4">
                    <div className="w-full md:w-auto overflow-x-auto">
                        <div className="flex gap-2 md:gap-5 min-w-max">
                            <Button onClick={() => handleButtonClick("lastWeek", fetchLastWeekData)} className="text-sm md:text-base !font-[400] !rounded-[12px] !px-[22px] !py-[20px]" style={{
                                fontSize: "1rem", // Default (text-sm)
                                backgroundColor: activeButton === "lastWeek" ? "#2B63FF" : "#F4F7FF",
                                color: activeButton === "lastWeek" ? "#ffffff" : "#000000",
                                border: "none",
                                "@media (min-width: 768px)": {
                                    fontSize: "0.875rem" 
                                }
                            }}>
                                Last week
                            </Button>
                            <Button onClick={() => handleButtonClick("thisWeek", fetchThisWeekData)} className="text-sm md:text-base !font-[400] !rounded-[12px] !px-[22px] !py-[20px]" style={{
                                fontSize: "1rem", // Default (text-sm)
                                backgroundColor: activeButton === "thisWeek" ? "#2B63FF" : "#F4F7FF",
                                color: activeButton === "thisWeek" ? "#ffffff" : "#000000",
                                border: "none",
                                "@media (min-width: 768px)": {
                                    fontSize: "0.875rem" 
                                }
                            }}>
                                This Week
                            </Button>
                            <Button onClick={() => handleButtonClick("nextWeek", fetchNextWeekData)} className="text-sm md:text-base !font-[400] !rounded-[12px] !px-[22px] !py-[20px]" style={{
                                fontSize: "1rem", // Default (text-sm)
                                backgroundColor: activeButton === "nextWeek" ? "#2B63FF" : "#F4F7FF",
                                color: activeButton === "nextWeek" ? "#ffffff" : "#000000",
                                border: "none",
                                "@media (min-width: 768px)": {
                                    fontSize: "0.875rem" // Equivalent to md:text-base
                                }
                            }}>
                                Next Week
                            </Button>
                            <Button onClick={() => handleButtonClick("nextMonth", fetchNextMonthData)} className="text-sm md:text-base !font-[400] !rounded-[12px] !px-[22px] !py-[20px]" style={{
                                fontSize: "1rem", // Default (text-sm)
                                backgroundColor: activeButton === "nextMonth" ? "#2B63FF" : "#F4F7FF",
                                color: activeButton === "nextMonth" ? "#ffffff" : "#000000",
                                border: "none",
                                "@media (min-width: 768px)": {
                                    fontSize: "0.875rem" // Equivalent to md:text-base
                                }
                            }}>
                                Next Month
                            </Button>
                        </div>
                    </div>
                    {/* <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0"> */}
                        <DatePicker
                            suffixIcon={<img src="/src/assets/detail.svg" />}
                            prefix={<img src="/src/assets/calendar.svg" />}
                            value={selectedDate}
                            onChange={handleDateChange}
                            onReset={fetchThisWeekData}
                            on
                            className="text-sm md:text-base w-full md:w-auto !font-[400] !rounded-[12px] !px-[10px] !py-[8px] bg-gray-100 rounded-full"
                            style={{ fontFamily: 'PP Neue Montreal', fontSize: '16px' }}
                        />
                        <Button icon={<FilterOutlined />} className="text-sm md:text-base !rounded-[12px] !font-[400] !rounded-[12px] !px-[22px] !py-[20px]" style={{
                            fontSize: "1rem", // Default (text-sm)
                            "@media (min-width: 768px)": {
                                fontSize: "0.875rem" // Equivalent to md:text-base
                            }
                        }}>
                            Filter
                        </Button>
                    {/* </div> */}
                </div>
                <hr class="my-[24px] h-0.5 border-t-0 bg-neutral-100" />
            </div>


            {
                loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : (
                    Object.entries(data).map(([date, records]) => (
                        <div key={date} className="px-[13px] md:px-[130px] mb-6 w-full flex flex-wrap">
                            <h2 className="mb-3 !font-[450] text-sm md:text-base font-[450] px-[22px] py-[16px] bg-blue-100 rounded-[16px] inline-block">
                                {dayjs(date).format("dddd, DD MMM YYYY")}
                            </h2>
                            <Table columns={columns} dataSource={records} pagination={false} bordered className="w-full border-none pt-[16px] md:pt-[20px]" scroll={{ x: 'max-content' }} style={{ borderLeft: "none", borderRight: "none" }} />
                        </div>
                    ))
                )
            }
            {/* <Footer/> */}
        </div >
    );
};

export default EconomicCalendar;
