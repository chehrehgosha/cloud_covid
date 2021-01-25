import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import Fab from "@material-ui/core/Fab";
import { Redirect, withRouter } from "react-router-dom";
import axios from "axios";
import {
  AppBar,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Toolbar,
  Typography,
} from "@material-ui/core";
import Summary from "./Summary";
import PieChartCovid from "./PieChartCovid";
import BarChartCovid from "./BarChartCovid";
import LineChartCovid from "./LineChartCovid";
import CovidCountryTable from "./CovidCountryTable";
import firebase from "firebase";

function HomePage({ history }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [covidSummary, setCovidSummary] = useState({});
  const [covidWorld, setCovidWorld] = useState([]);
  const [lastSevenDays, setLastSevenDays] = useState({});
  const [lastThirtyDays, setLastThirtyDays] = useState({});
  const db = firebase.firestore();
  var latestNewsRef = db.collection("news").doc("global");

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
            const resSummary = await axios.get(
              "https://api.covid19api.com/summary"
            );
            setCovidSummary(resSummary.data);
            updateDB(resSummary.data, today, "global");
          } else {
            console.log("cached from DB");
            setCovidSummary(doc.data().content);
          }
        } else {
          const resSummary = await axios.get(
            "https://api.covid19api.com/summary"
          );
          setCovidSummary(resSummary.data);
          updateDB(resSummary.data, today, "global");
        }
      });

      const resSeven = await axios.get(
        "https://corona.lmao.ninja/v2/historical/all?lastdays=8"
      );
      setLastSevenDays(resSeven.data);
      const resThirty = await axios.get(
        "https://corona.lmao.ninja/v2/historical/all"
      );
      setLastThirtyDays(resThirty.data);

      // const resWorld = await axios.get("https://api.covid19api.com/world");
      // setCovidWorld(resWorld.data);
    } catch (error) {
      console.log(error);
    }
  }, []);
  const auth = firebase.auth();
  const [user, setuser] = useState(auth.currentUser);
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const signInWithGoogle = () => {
    auth
      .signInWithPopup(googleProvider)
      .then((res) => {
        var userRef = db.collection("users").doc(res.user.email);
        userRef.get().then(async (doc) => {
          if (doc.exists) {
            setuser(res.user);
          } else {
            auth.signOut();
            // setuser(null);
          }
        });
        console.log(res.user);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  useEffect(() => {
    setuser(auth.currentUser)
  }, [auth.currentUser])

  // console.log(covidWorld.slice(covidWorld.length - 7, covidWorld.length))
  return (
    <Fragment>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Welcome {user ? user.displayName : "To Our Website"}
          </Typography>
          {!user && (
            <Button color="inherit" onClick={signInWithGoogle}>
              Login
            </Button>
          )}
          {user && (
            <Button
              color="inherit"
              onClick={() => {
                auth.signOut().then(()=>console.log('signed out'));
                setuser(null);
              }}
            >
              Signout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      {Object.keys(covidSummary).includes("Global") && (
        <Fragment>
          <Summary data={covidSummary["Global"]} />
          <PieChartCovid data={covidSummary["Global"]} />
        </Fragment>
      )}
      {lastSevenDays && (
        <Fragment>
          <BarChartCovid data={lastSevenDays} />
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
