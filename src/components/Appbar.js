import {
  AppBar,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import React, { Fragment, useState, useEffect } from "react";
import firebase from "firebase";
import axios from "axios";

export default function Appbar() {
  const auth = firebase.auth();
  const db = firebase.firestore();
  const [user, setuser] = useState(auth.currentUser);
  const googleProvider = new firebase.auth.GoogleAuthProvider();

  const signInWithGoogle = () => {
    auth
      .signInWithPopup(
        googleProvider.setCustomParameters({ prompt: "select_account" })
      )
      .then((res) => {
        setuser(res.user);
        console.log(res.user);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  useEffect(() => {
    setuser(auth.currentUser);
  }, [auth.currentUser]);

  const [dialog, setdialog] = useState(false);
  const [countries, setcountries] = useState([]);

  useEffect(async () => {
    try {
      const res = await axios.get("https://api.covid19api.com/countries");
      const countries_ = res.data.map((el) => el["Country"]).sort();
      setcountries(countries_);
    } catch (error) {
      console.log(error);
    }
  }, []);
  const [selectedCountry, setselectedCountry] = useState(null);
  const [description, setdescription] = useState(null);
  const [eligible, setEligible] = useState(null);

  useEffect(() => {
    if (user) {
      db.collection("users")
        .doc(user.email)
        .get()
        .then(async (doc) => {
          if (doc.exists) {
            setEligible(true);
          } else setEligible(false);
        });
    }
  }, [user]);
  const addNews = () => {
    var userRef = db.collection("users").doc(user.email);
    userRef.get().then(async (doc) => {
      if (doc.exists) {
        db.collection("userNews")
          .doc()
          .set({
            description: description,
            date: new Date().toDateString(),
            user: auth.currentUser.displayName,
            country: selectedCountry,
          })
          .then(() => {
            console.log("News Added");
            window.location.reload();
          })
          .catch((error) => {
            console.log("error in adding news to DB");
          });
      } else {
        alert("You are not eligible to add News!");
      }
    });

    setdialog(false);
  };

  const makeEligible = () => {
    var elig = window.confirm("You sure you are eligible?");
    if (elig) {
      db.collection("users")
        .doc(user.email)
        .set({
          eligible: true,
        })
        .then(() => {
          alert("You are eligible to add news!");
        })
        .catch((error) => {
          console.log("error in making you eligible");
        });
    }
  };
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
            <Fragment>
              <Button color="inherit" onClick={() => setdialog(true)}>
                Add News
              </Button>
              <Dialog open={dialog} onClose={() => setdialog(false)}>
                <DialogTitle>Let's add some News</DialogTitle>
                <DialogContent>
                  Specify the news characteristics
                  <br />
                  <Select
                    placeholder={"Select which country"}
                    id="demo-simple-select"
                    value={selectedCountry}
                    fullWidth
                    style={{ marginTop: "5%" }}
                    onChange={(e) => setselectedCountry(e.target.value)}
                  >
                    <MenuItem value={"worldwide"}>WorldWide</MenuItem>
                    {countries.map((country) => (
                      <MenuItem value={country}>{country}</MenuItem>
                    ))}
                  </Select>
                  <br />
                  <TextField
                    placeholder="News Descriptioin..."
                    rows={5}
                    multiline
                    fullWidth
                    value={description}
                    style={{ marginTop: "5%" }}
                    onChange={(e) => setdescription(e.target.value)}
                  />
                  <Button variant="contained" onClick={addNews} fullWidth>
                    SUBMIT
                  </Button>
                </DialogContent>
              </Dialog>
            </Fragment>
          )}
          {user && (
            <Button
              color="inherit"
              onClick={() => {
                auth.signOut().then(() => console.log("signed out"));
                setuser(null);
              }}
            >
              Signout
            </Button>
          )}
          {user && !eligible && (
            <Button variant="contained" color="primary" onClick={makeEligible}>
              Make me Eligible
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Fragment>
  );
}
