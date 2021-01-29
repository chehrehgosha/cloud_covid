import React, { useState, useEffect, Fragment } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import Summary from "./Summary";
import PieChartCovid from "./PieChartCovid";
import BarChartCovid from "./BarChartCovid";
import LineChartCovid from "./LineChartCovid";
import CovidCountryTable from "./CovidCountryTable";
import firebase from "firebase";
import { updateDB } from "../actions/db";
import NewsFeed from "./NewsFeed";

function HomePage({ history }) {
  const [covidSummary, setCovidSummary] = useState({});
  const [lastThirtyDays, setLastThirtyDays] = useState({});
  const db = firebase.firestore();

  useEffect(async () => {
    try {
      var globalSummary = db.collection("cached").doc("global"+"summary");
      globalSummary.get().then(async (doc) => {
        const today = parseInt(new Date().getTime() / 86400000);
        if (doc.exists) {
          const date = doc.data().date;
          if (today > date) {
            const resSummary = await axios.get(
              "https://api.covid19api.com/summary"
            );
            setCovidSummary(resSummary.data);
            updateDB(resSummary.data, today, "global"+"summary");
          } else {
            console.log("cached from DB");
            setCovidSummary(doc.data().content);
          }
        } else {
          const resSummary = await axios.get(
            "https://api.covid19api.com/summary"
          );
          setCovidSummary(resSummary.data);
          updateDB(resSummary.data, today, "global"+"summary");
        }
      });
      var globalThirty = db.collection("cached").doc("global"+"thirty");
      globalThirty.get().then(async (doc) => {
        const today = parseInt(new Date().getTime() / 86400000);
        if (doc.exists) {
          const date = doc.data().date;
          if (today > date) {
            const resThirty = await axios.get(
              "https://corona.lmao.ninja/v2/historical/all"
            );
            setLastThirtyDays(resThirty.data);
            updateDB(resThirty.data, today, "global"+"thirty");
          } else {
            console.log("cached from DB", );
            setLastThirtyDays(doc.data().content);
          }
        } else {
          const resThirty = await axios.get(
            "https://corona.lmao.ninja/v2/historical/all"
          );
          setLastThirtyDays(resThirty.data);
          updateDB(resThirty.data, today, "global"+"thirty");
        }
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <Fragment>
      <NewsFeed country='worldwide'/>
      {Object.keys(covidSummary).includes("Global") && (
        <Fragment>
          <Summary data={covidSummary["Global"]} />
          <PieChartCovid data={covidSummary["Global"]} />
        </Fragment>
      )}
      {lastThirtyDays && (
        <Fragment>
          <BarChartCovid data={lastThirtyDays} />
          <LineChartCovid data={lastThirtyDays} />
        </Fragment>
      )}
      {Object.keys(covidSummary).includes("Global") && (
        <Fragment>
          <CovidCountryTable data={covidSummary["Countries"]} />
        </Fragment>
      )}
    </Fragment>
  );
}

HomePage.propTypes = {};

export default withRouter(HomePage);
