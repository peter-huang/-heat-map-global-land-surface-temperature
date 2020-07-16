import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./frontend/css/main.css";
import * as d3 from "d3";

const JSON_URL =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

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

    const minYear = d3.min(data.monthlyVariance, (d) => d.year);
    const maxYear = d3.max(data.monthlyVariance, (d) => d.year);

    // Setting up graph
    d3.select("#heatmap")
      .append("div")
      .attr("id", "title")
      .text("Monthly Global Land-Surface Temperature");
    d3.select("#title")
      .append("div")
      .attr("id", "subtitle")
      .text(
        minYear +
          " -  " +
          maxYear +
          ": base temperature " +
          data.baseTemperature +
          "℃"
      );

    const svg = d3
      .select("#heatmap")
      .append("svg")
      .attr("width", dim.width)
      .attr("height", dim.height);
  };

  return (
    <div id="heatmap-container">
      <div id="heatmap"></div>
    </div>
  );
}

export default App;
