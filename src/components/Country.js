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
import { useHistory } from "react-router-dom";
import PieChartCovid from "./PieChartCovid";
import BarChartCovid from "./BarChartCovid";
import LineChartCovid from "./LineChartCovid";
import CovidCountryTable from "./CovidCountryTable";

function Country({ location }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [covidSummary, setCovidSummary] = useState({});
  const [covidWorld, setCovidWorld] = useState([]);
  const [lastSevenDays, setLastSevenDays] = useState({});
  const [lastThirtyDays, setLastThirtyDays] = useState({});
  const history = useHistory();
  useEffect(async () => {
    try {
      setCovidSummary(location.summary);
      const resSeven = await axios.get(
        `https://corona.lmao.ninja/v3/covid-19/historical/${location.slug}?lastdays=8`
      );
      setLastSevenDays(resSeven.data.timeline);
      const resThirty = await axios.get(
        `https://corona.lmao.ninja/v3/covid-19/historical/${location.slug}`
      );
      setLastThirtyDays(resThirty.data.timeline);

      // const resWorld = await axios.get("https://api.covid19api.com/world");
      // setCovidWorld(resWorld.data);
    } catch (error) {
      console.log(error);
    }
  }, []);
  console.log(lastSevenDays)
  console.log(lastThirtyDays)
  if (!location.state) history.push("/");
  else
    return (
      <div>
        {covidSummary && Object.keys(covidSummary).includes("Country") && (
          <Fragment>
            <Summary data={covidSummary} />
            <PieChartCovid data={covidSummary} />
          </Fragment>
        )}
        {lastThirtyDays && Object.keys(lastSevenDays).includes("cases") && (
          <Fragment>
            <BarChartCovid data={lastSevenDays} />
            <LineChartCovid data={lastThirtyDays} />
          </Fragment>
        )}
        {/*
      {Object.keys(covidSummary).includes("Global") && (
        <Fragment>
          <CovidCountryTable data={covidSummary["Countries"]} />
        </Fragment>
      )}*/}
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

Country.propTypes = {};

export default Country;
