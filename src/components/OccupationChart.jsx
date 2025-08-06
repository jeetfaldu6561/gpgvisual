import { useState, useEffect, useRef } from "react";
import Highcharts from "highcharts";
import Papa from "papaparse";
import { Spinner } from "react-bootstrap";

const OccupationChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const chartRef = useRef(null); // Reference for the chart container

    useEffect(() => {
        Papa.parse("/data/occupation.csv", {
            download: true,
            header: true,
            dynamicTyping: true,
            complete: (result) => {
                if (result.errors.length > 0) {
                    setError(result.errors[0]);
                } else {
                    setData(result.data);
                }
                setLoading(false);
            },
        });
    }, []);

    useEffect(() => {
        if (data.length > 0 && chartRef.current) {
            const chartInstance = Highcharts.chart(chartRef.current, {
                chart: {
                    type: "bar",
                },
                title: {
                    text: "Gender Pay Gap by Occupation",
                    align: "center",
                },
                xAxis: {
                    categories: data.map((value) => value.Occupation),
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: "Percent",
                    },
                },
                tooltip: {
                    pointFormat:
                        '<span style="color:{series.color}">{series.name}</span>' +
                        ': <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
                    shared: true,
                },
                legend: {
                    reversed: true,
                },
                plotOptions: {
                    bar: {
                        stacking: "percent",
                        dataLabels: {
                            enabled: true,
                            format: "{point.percentage:.0f}%",
                        },
                    },
                },
                series: [
                    {
                        type: "bar",
                        name: "Female",
                        data: data.map((value) => parseFloat(value.Females)),
                        color: "#FFC0CB",
                    },
                    {
                        type: "bar",
                        name: "Male",
                        data: data.map((value) => parseFloat(value.Males)),
                        color: "#2171b5",
                    },
                ],
            });

            return () => chartInstance.destroy(); // Cleanup on unmount
        }
    }, [data]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center" style={{ height: "400px", alignItems: "center" }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (error) {
        return <div>Error: {error.message || "An unknown error occurred."}</div>;
    }

    return <div ref={chartRef} style={{ height: "400px" }}></div>;
};

export default OccupationChart;