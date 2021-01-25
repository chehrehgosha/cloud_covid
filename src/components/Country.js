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
import firebase from "firebase";

function Country({ location }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [covidSummary, setCovidSummary] = useState({});
  const [covidWorld, setCovidWorld] = useState([]);
  const [lastSevenDays, setLastSevenDays] = useState({});
  const [lastThirtyDays, setLastThirtyDays] = useState({});
  const history = useHistory();
  const db = firebase.firestore();
  var latestNewsRef = db.collection("news").doc(location.state);

  const updateDB = (data, date, doc) => {
    db.collection("news")
      .doc(doc)
      .set({
        content: data,
        date: date,
      })
      .then(() => {
        console.log("DB updated");
      })
      .catch((error) => {
        console.log("error in updating DB");
      });
  };

  useEffect(async () => {
    try {
      latestNewsRef.get().then(async (doc) => {
        const today = parseInt(new Date().getTime() / 86400000);
        if (doc.exists) {
          const date = doc.data().date;
          if (today > date) {
            const resThirty = await axios.get(
              `https://corona.lmao.ninja/v3/covid-19/historical/${location.slug}`
            );
            setLastThirtyDays(resThirty.data.timeline);
            updateDB(resThirty.data.timeline, today, location.state);
          } else {
            console.log("cached from DB");
            setLastThirtyDays(doc.data().content);
          }
        } else {
          const resThirty = await axios.get(
            `https://corona.lmao.ninja/v3/covid-19/historical/${location.slug}`
          );
          setLastThirtyDays(resThirty.data.timeline);
          updateDB(resThirty.data.timeline, today, location.state);
        }
      });

      setCovidSummary(location.summary);

      // const resWorld = await axios.get("https://api.covid19api.com/world");
      // setCovidWorld(resWorld.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  // console.log(lastThirtyDays);
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
        {lastThirtyDays && Object.keys(lastThirtyDays).includes("cases") && (
          <Fragment>
            <BarChartCovid data={lastThirtyDays} />
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
