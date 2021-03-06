import logo from "./logo.svg";
import "./App.css";
import firebase from "firebase";
import { useState } from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import HomePage from "./components/HomePage";
import Country from "./components/Country";
import { Paper } from "@material-ui/core";
import Appbar from "./components/Appbar";

function App() {
  const firebaseApp = firebase.apps[0];
  var storage = firebaseApp.storage();

  const [png, setpng] = useState("");
  const [title, setTitle] = useState("initialState");
  var pathReference = storage.ref("");
  pathReference
    .child("virus.png")
    .getDownloadURL()
    .then(function (url) {
      // `url` is the download URL for 'images/stars.jpg'

      // This can be downloaded directly:
      setpng(url);
    })
    .catch(function (error) {
      // Handle any errors
    });
  pathReference
    .child("title1.png")
    .getDownloadURL()
    .then(function (url) {
      // `url` is the download URL for 'images/stars.jpg'

      // This can be downloaded directly:
      setTitle(url);
    })
    .catch(function (error) {
      // Handle any errors
    });

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <img
          src={png}
          style={{ width: "50px", height: "50px", margin: "10px" }}
        />
        <img
          src={title}
          style={{ height: "50px", margin: "10px 10px 10px -10px" }}
        />
      </div>
      <Paper elevation={2} style={{ padding: "1% 0", margin: "2% 15%" }}>
        <BrowserRouter>
          <Appbar />
          <Switch>
            <Route exact path="/" render={(props) => <HomePage {...props} />} />
            <Route
              exact
              path="/country"
              render={(props) => <Country {...props} />}
            />
          </Switch>
        </BrowserRouter>
      </Paper>
    </div>
  );
}

export default App;
