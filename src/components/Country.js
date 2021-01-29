import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import Summary from "./Summary";
import { useHistory } from "react-router-dom";
import PieChartCovid from "./PieChartCovid";
import BarChartCovid from "./BarChartCovid";
import LineChartCovid from "./LineChartCovid";
import firebase from "firebase";
import { updateDB } from "../actions/db";
import NewsFeed from "./NewsFeed";

function Country({ location }) {
  const [covidSummary, setCovidSummary] = useState({});
  const [lastThirtyDays, setLastThirtyDays] = useState({});
  const history = useHistory();
  const db = firebase.firestore();
  var latestNewsRef = db.collection("news").doc(location.state);

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
    } catch (error) {
      console.log(error);
    }
  }, []);
  if (!location.state) history.push("/");
  else
    return (
      <Fragment>
        <NewsFeed country={location.state} />
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
      </Fragment>
    );
}

Country.propTypes = {};

export default Country;
