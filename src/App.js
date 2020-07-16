import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./frontend/css/main.css";
import * as d3 from "d3";

const JSON_URL =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function App() {
  const [data, setHeatMapData] = useState([]);

  const getData = (url) => {
    const req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.onreadystatechange = () => {
      if (req.readyState == 4 && req.status == 200) {
        const tempData = JSON.parse(req.responseText);

        setHeatMapData(tempData);
      }
    };
    req.send();
  };

  useEffect(() => {
    getData(JSON_URL);
  }, []);

  return (
    <div class="container h-100">
      <div class="row h-100">
        <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 d-flex flex-column justify-content-center align-items-center">
          <div>
            <HeatMap data={data} />
          </div>

          <div class="text-center font-weight-bold text-black mt-2 pt-2 d-none">
            Designed and coded by{" "}
            <a class="credits" href="https://github.com/peter-huang">
              Peter Huang
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeatMap({ data }) {
  useEffect(() => {
    if (data["monthlyVariance"] != null) {
      drawHeatMap(data);
    }
  }, [data]);

  const drawHeatMap = (data) => {
    const padding = {
      top: 50,
      right: 25,
      bottom: 50,
      left: 25,
    };

    const dim = {
      width: 800 + padding.left + padding.right,
      height: 400 + padding.top + padding.bottom,
    };

    const xAxisFactor = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 3,
    };

    const minYear = d3.min(data.monthlyVariance, (d) => d.year);
    const maxYear = d3.max(data.monthlyVariance, (d) => d.year);

    // Graph Titles
    d3.select("#heatmap")
      .append("div")
      .attr("id", "title")
      .text("Monthly Global Land-Surface Temperature");
    d3.select("#title")
      .append("div")
      .attr("id", "description")
      .text(
        minYear +
          " -  " +
          maxYear +
          ": base temperature " +
          data.baseTemperature +
          "℃"
      );

    // SVG setup
    const svg = d3
      .select("#heatmap")
      .append("svg")
      .attr("width", dim.width)
      .attr("height", dim.height);

    // Scales
    const xScale = d3.scaleLinear();
    xScale.domain([minYear, maxYear]);
    xScale.range([padding.left * xAxisFactor.left, dim.width - padding.right]);

    const yScale = d3.scaleLinear();
    yScale.domain([
      d3.min(data.monthlyVariance, (d) => d.month),
      d3.max(data.monthlyVariance, (d) => d.month),
    ]);
    yScale.range([dim.height - padding.bottom, padding.top]);

    // X-Axis
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", "translate(0," + (dim.height - padding.bottom) + ")")
      .call(xAxis);

    // Y-Axis
    const yAxis = d3.axisLeft(yScale).tickFormat((d, i) => {
      return MONTHS[i - 1];
    });
    svg
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", "translate(" + padding.left * xAxisFactor.left + ",0)")
      .call(yAxis);
    d3.selectAll("#y-axis .tick line").each(() => {
      console.log("here");
      /*
      d3.select(this).attr(
        "transform",
        "translate(0," + yScale.bandwidth() / 2 + ")"
      );*/
    });
  };

  return (
    <div id="heatmap-container">
      <div id="heatmap"></div>
    </div>
  );
}

export default App;
