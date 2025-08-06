import { useEffect, useState } from "react";
import Highcharts from "highcharts";
import Papa from "papaparse";

const AgeGroupChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    Papa.parse("/data/agegroup.csv", {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        setData(result.data);
      },
    });
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const options = {
        chart: { type: "column", renderTo: "container-agegroup" },
        title: { text: "Gender Pay Gap across different Age Groups" },
        xAxis: { categories: data.map((d) => d.category) },
        yAxis: { title: { text: "Gender Paygap %" } },
        series: [
          {
            type: "column",
            name: "Age Group",
            data: data.map((d) => ({
              y: d.values,
              color: d.values < 0 ? "#FFC0CB" : "#2171b5",  // Set color based on value
            })),
          },
        ],
      };
      Highcharts.chart(options);
    }
  }, [data]);

  return <div id="container-agegroup" style={{ height: "400px" }}></div>;
};

export default AgeGroupChart;
