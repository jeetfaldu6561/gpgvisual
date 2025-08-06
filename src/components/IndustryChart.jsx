import { useEffect, useState } from "react";
import Highcharts from "highcharts";
import Papa from "papaparse";
import { Spinner } from "react-bootstrap"; // Import the Spinner component

const IndustryChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load the CSV data
    Papa.parse("/data/industry_data.csv", {
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
    if (data.length > 0) {
      const options = {
        chart: {
          type: "bar",
          renderTo: "container-Industry",
        },
        title: {
          text: "Gender Pay Gap by Industry",
          align: "center",
        },
        xAxis: {
          categories: data.map((value) => value.Industry),
        },
        yAxis: {
          min: -5,
          title: {
            text: "Percent",
          },
        },
        tooltip: {
          pointFormat:
            '<span style="color:{series.color}">{series.name}</span>' +
            ": <b>{point.y}</b> ({point.percentage:.0f}%)<br/>",
          shared: true,
        },
        legend: {
          reversed: true,
        },
        plotOptions: {
          bar: {
            borderRadius: 5, // Adjusted from "50%" to a number
            dataLabels: {
              enabled: true,
            },
            groupPadding: 0.1,
          },
        },
        series: [
          {
            type: "bar",
            name: "Industry",
            data: data.map((value) => parseFloat(value.gpg)),
          },
        ],
      };

      Highcharts.chart(options);
    }
  }, [data]);

  // Handling loading and error states
  if (loading) {
    return (
      <div className="d-flex justify-content-center" style={{ height: "400px", alignItems: "center" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    ); // Show the spinner while loading
  }

  if (error) {
    const errorMessage = error.message || 'An unknown error occurred.';
    return <div>Error: {errorMessage}</div>;
  }

  return (
    <div id="container-Industry" style={{ height: "400px" }}></div>
  );
};

export default IndustryChart;