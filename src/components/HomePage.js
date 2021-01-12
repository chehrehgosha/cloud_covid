import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import Fab from "@material-ui/core/Fab";
import { Redirect, withRouter } from "react-router-dom";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@material-ui/core";
import Summary from "./Summary";
import PieChartCovid from "./PieChartCovid";
import BarChartCovid from "./BarChartCovid";
import LineChartCovid from "./LineChartCovid";


function HomePage({ history }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [covidSummary, setCovidSummary] = useState({});
  const [covidWorld, setCovidWorld] = useState([]);

  useEffect(async () => {
    try {
      const resSummary = await axios.get("https://api.covid19api.com/summary");
      setCovidSummary(resSummary.data);
      const resWorld = await axios.get("https://api.covid19api.com/world");
      setCovidWorld(resWorld.data);
    } catch (error) {
      console.log(error);
    }
  }, []);
  // console.log(covidWorld.slice(covidWorld.length - 7, covidWorld.length))
  return (
    <div>
      {Object.keys(covidSummary).includes("Global") && (
        <Fragment >
          <Summary data={covidSummary["Global"]} />
          <PieChartCovid data={covidSummary["Global"]} />
        </Fragment>
      )}
      {covidWorld.length > 7 && (
        <Fragment>
          <BarChartCovid data={covidWorld.slice(covidWorld.length - 7, covidWorld.length)}/>
          <LineChartCovid data={covidWorld.slice().reverse()} length={covidWorld.length}/>
        </Fragment>
      )}
      <button
        onClick={() =>
          history.push({
            pathname: "/country", 
            state: "France",
          })
        }
      >
        Country
      </button>
      <Fab
        variant="extended"
        color="primary"
        style={{ position: "fixed", right: "30px", bottom: "30px" }}
      >
        {loggedIn ? "LOGOUT" : "LOG IN"}
      </Fab>
    </div>
  );
}

HomePage.propTypes = {};

export default withRouter(HomePage);
