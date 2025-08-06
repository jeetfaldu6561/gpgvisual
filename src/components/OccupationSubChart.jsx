import { useState, useEffect } from "react";
import Highcharts from 'highcharts';
import HCMore from 'highcharts/highcharts-more';
import Papa from "papaparse";
import { Spinner } from "react-bootstrap"; // Import the Spinner component

const OccupationSubChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load the CSV data
    Papa.parse("/data/occupation_subcategory.csv", {
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
      const groupedData = [];
      let currentOccupation = null;

      // Group data by occupation and sub-occupation
      data.forEach(item => {
        if (parseInt(item.check) === 1) {
          currentOccupation = {
            name: item.SubOccupation,
            data: []
          };
          groupedData.push(currentOccupation);
        } else if (parseInt(item.check) === 0 && currentOccupation) {
          currentOccupation.data.push({
            name: item.SubOccupation,
            value: parseFloat(item.gpg)  // Parse the GPG value
          });
        }
      });

      // Find the minimum and maximum GPG values across all sub-occupations
      const allGPGValues = data.map(item => parseFloat(item.gpg));
      const minGPG = Math.min(...allGPGValues);
      const maxGPG = Math.max(...allGPGValues);

      // Function to interpolate between blue and pink based on GPG value
      const interpolateColor = (gpg) => {
        // Normalize the GPG value to a scale of 0-1
        const normalizedGPG = (gpg - minGPG) / (maxGPG - minGPG);

        // RGB values for blue and pink
        const blue = [33, 113, 181]; // Blue
        const pink = [255, 192, 203]; // Light Pink

        // Interpolate RGB values between blue and pink
        const r = Math.round(blue[0] + normalizedGPG * (pink[0] - blue[0]));
        const g = Math.round(blue[1] + normalizedGPG * (pink[1] - blue[1]));
        const b = Math.round(blue[2] + normalizedGPG * (pink[2] - blue[2]));

        // Log the RGB values to the console for debugging
        console.log(`GPG: ${gpg} => Color: rgb(${r}, ${g}, ${b})`);

        return `rgb(${r}, ${g}, ${b})`;
      };

      // Apply colors to each sub-occupation based on GPG value
      groupedData.forEach(occupation => {
        occupation.data.forEach(subOccupation => {
          subOccupation.color = interpolateColor(subOccupation.value); // Assign color to each data point
        });
      });

      // Highcharts options
      const options = {
        chart: {
          type: 'packedbubble',
          height: '80%'
        },
        title: {
          text: 'Gender Pay Gap based on Occupation',
          align: 'left'
        },
        tooltip: {
          useHTML: true,
          pointFormat: '<b>{point.name}:</b> {point.value} % GPG'
        },
        plotOptions: {
          packedbubble: {
            minSize: '30%',
            maxSize: '100%',
            zMin: 0,
            zMax: 100,
            layoutAlgorithm: {
              gravitationalConstant: 0.05,
              splitSeries: true,
              seriesInteraction: false,
              dragBetweenSeries: true,
              parentNodeLimit: true,
            },
            dataLabels: {
              enabled: true,
              format: '{point.name}:<br><b>{point.value}%</b>',
              filter: {
                property: 'y',
                operator: '>',
                value: 1
              },
              style: {
                color: 'black',
                textOutline: 'none',
                fontWeight: 'normal'
              }
            }
          }
        },
        series: groupedData
      };

      // Render the chart
      Highcharts.chart('container-Occupation-sub', options);
    }
  }, [data]);

  // Handling loading and error states
  if (loading) {
    return (
      <div className="d-flex justify-content-center" style={{ height: '400px', alignItems: 'center' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    ); // Show the spinner while loading
  }

  if (error) {
    const errorMessage = error.message || 'An unknown error occurred.';
    return <div>Error: {errorMessage}</div>;
  }

  return (
    <div id="container-Occupation-sub"></div>
  );
};

export default OccupationSubChart;
