import React, { useEffect, useState, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Papa from "papaparse";

const IndustryBarChart = () => {
  const [data, setData] = useState([]);
  const [year, setYear] = useState(2014);
  const [chartOptions, setChartOptions] = useState(null);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Load CSV data
    Papa.parse("/data/pay_gap_data.csv", {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        // Ensure year and gpg are numbers
        const cleanedData = result.data.map((row) => ({
          year: Number(row.year),
          industry: row.industry,
          gpg: Number(row.gpg),
        }));
        setData(cleanedData);
      },
    });
  }, []);

//   useEffect(() => {
//     if (data.length === 0) return;

//     // Filter and sort data
//     const filteredData = data
//       .filter((row) => row.year === year)
//       .sort((a, b) => b.gpg - a.gpg);

//     // Update chart options
//     // setChartOptions({
//     //   chart: { type: "bar", animation: { duration: 500 }, height: filteredData.length * 27.5 },
//     //   title: { text: `Gender Pay Gap by Industry - ${year}` },
//     //   xAxis: { categories: filteredData.map((row) => row.industry) },
//     //   yAxis: { title: { text: "Gender Pay Gap (%)" } },
//     //   series: [
//     //     {
//     //       name: `Year ${year}`,
//     //       data: filteredData.map((row) => row.gpg),
//     //       colorByPoint: true,
//     //       colors: filteredData.map((row, index) => 
//     //         index % 2 === 0 ? '#0099FF' : '#FF66B2' // Alternating Blue and Pink
//     //       ),
//     //     },
//     //   ],
//     // });
//     setChartOptions({
//         chart: { 
//           type: "bar", 
//           animation: { duration: 500 },
//           height: 600, // Increased chart height
//         },
//         title: { text: `Gender Pay Gap by Industry - ${year}` },
//         xAxis: { categories: filteredData.map((row) => row.industry) },
//         yAxis: { title: { text: "Gender Pay Gap (%)" } },
//         series: [
//           {
//             name: `Year ${year}`,
//             data: filteredData.map((row) => row.gpg),
//             colorByPoint: true,
//             colors: filteredData.map((row) => {
//               const gpg = row.gpg;
      
//               // Normalize GPG to a 0-1 scale for color interpolation
//               let normalizedGPG = (gpg - (-5.79)) / (34 - (-5.79)); // Normalize between 0 and 1
      
//               // Interpolate from blue to pink
//               const blueToPink = (t) => {
//                 const r = Math.round(255 * (1 - t)); // Red component (increases as value decreases)
//                 const g = Math.round(0 * (1 - t)); // Green stays the same
//                 const b = Math.round(255 * t); // Blue component (decreases as value decreases)
//                 return `rgb(${r}, ${g}, ${b})`;
//               };
      
//               return blueToPink(normalizedGPG);
//             }),
//           },
//         ],
//       });
      
      
      
//   }, [data, year]);

useEffect(() => {
    if (data.length === 0) return;
  
    // Filter and sort data for the selected year
    const filteredData = data
      .filter((row) => row.year === year)
      .sort((a, b) => b.gpg - a.gpg);
  
    // Calculate the min and max GPG for the selected year
    const minGPG = Math.min(...filteredData.map((row) => row.gpg));
    const maxGPG = Math.max(...filteredData.map((row) => row.gpg));
  
    // Update chart options
    setChartOptions({
      chart: { 
        type: "bar", 
        animation: { duration: 500 },
        height: 600, // Increased chart height
      },
      title: { text: `Gender Pay Gap by Industry - ${year}` },
      xAxis: { categories: filteredData.map((row) => row.industry) },
      yAxis: { title: { text: "Gender Pay Gap (%)" } },
      series: [
        {
          name: `Year ${year}`,
          data: filteredData.map((row) => row.gpg),
          colorByPoint: true,
          colors: filteredData.map((row) => {
            const gpg = row.gpg;
  
            // Normalize GPG to a 0-1 scale for color interpolation based on year-specific min/max
            const normalizedGPG = (gpg - minGPG) / (maxGPG - minGPG); // Normalize between 0 and 1
  
            // Interpolate from light pink (min) to hot pink (max)
            const blueToPink = (t) => {
              // Define RGB values for the light pink and hot pink
              const lightPink = [255, 192, 203]; // Light pink
              const hotPink = [33, 113, 181];  // Hot pink
  
              // Calculate interpolated color
              const r = Math.round(lightPink[0] + t * (hotPink[0] - lightPink[0]));
              const g = Math.round(lightPink[1] + t * (hotPink[1] - lightPink[1]));
              const b = Math.round(lightPink[2] + t * (hotPink[2] - lightPink[2]));
  
              return `rgb(${r}, ${g}, ${b})`; // Return the interpolated color
            };
  
            return blueToPink(normalizedGPG);
          }),
        },
      ],
    });
  }, [data, year]);
  
  const play = () => {
    setPlaying(true);
    intervalRef.current = setInterval(() => {
      setYear((prevYear) => {
        if (prevYear >= 2023) {
          pause(); // Stop animation at 2023
          return 2023;
        }
        return prevYear + 1;
      });
    }, 1500);
  };

  const pause = () => {
    setPlaying(false);
    clearInterval(intervalRef.current);
  };

  const handleSliderChange = (event) => {
    setYear(Number(event.target.value));
    pause(); // Stop animation if user manually changes the year
  };

  return (
    <div style={{ textAlign: "center" }}>
      <button onClick={playing ? pause : play}>{playing ? "Pause" : "Play"}</button>

      {/* Year Slider */}
      <input
        type="range"
        min="2014"
        max="2023"
        value={year}
        onChange={handleSliderChange}
        style={{ width: "60%", margin: "20px" }}
      />
      
      <span style={{ fontSize: "18px", fontWeight: "bold" }}>{year}</span>

      {chartOptions && <HighchartsReact highcharts={Highcharts} options={chartOptions} />}
    </div>
  );
};

export default IndustryBarChart;
