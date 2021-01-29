import firebase from "firebase";
import axios from "axios";
export const updateDB = (data, date, doc) => {
  const db = firebase.firestore();
  db.collection("cached")
    .doc(doc)
    .set({
      content: data,
      date: date,
    })
    .then(() => {
      console.log("DB updated", doc);
    })
    .catch((error) => {
      console.log("error in updating DB: ", error);
    });
};

export const getNews = (country) => {
  const db = firebase.firestore();
  let newNews = [];
  db.collection("userNews")
    .where("country", "==", country)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        newNews.push(doc.data());
      });
    })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    });
  return newNews;
};

export const cacheHomepage = () => {
  const db = firebase.firestore();
  let cached = [{}, {}];
  try {
    var globalSummary = db.collection("cached").doc("global" + "summary");
    globalSummary.get().then(async (doc) => {
      const today = parseInt(new Date().getTime() / 86400000);
      if (doc.exists) {
        const date = doc.data().date;
        if (today > date) {
          const resSummary = await axios.get(
            "https://api.covid19api.com/summary"
          );
          // setCovidSummary(resSummary.data);
          updateDB(resSummary.data, today, "global" + "summary");
          cached[0] = resSummary.data;
        } else {
          console.log("cached from DB");
          // setCovidSummary(doc.data().content);
          cached[0] = doc.data().content;
        }
      } else {
        const resSummary = await axios.get(
          "https://api.covid19api.com/summary"
        );
        // setCovidSummary(resSummary.data);
        updateDB(resSummary.data, today, "global" + "summary");
        cached[0] = resSummary.data;
      }
    });
    var globalThirty = db.collection("cached").doc("global" + "thirty");
    globalThirty.get().then(async (doc) => {
      const today = parseInt(new Date().getTime() / 86400000);
      if (doc.exists) {
        const date = doc.data().date;
        if (today > date) {
          const resThirty = await axios.get(
            "https://corona.lmao.ninja/v2/historical/all"
          );
          // setLastThirtyDays(resThirty.data);
          updateDB(resThirty.data, today, "global" + "thirty");
          cached[1] = resThirty.data;
        } else {
          console.log("cached from DB");
          // setLastThirtyDays(doc.data().content);
          cached[1] = doc.data().content;
        }
      } else {
        const resThirty = await axios.get(
          "https://corona.lmao.ninja/v2/historical/all"
        );
        // setLastThirtyDays(resThirty.data);
        updateDB(resThirty.data, today, "global" + "thirty");
        cached[1] = resThirty.data;
      }
    });
    if(cached[0] && cached[1]) return cached
    // const resThirty = await axios.get(
    //   "https://corona.lmao.ninja/v2/historical/all"
    // );
    // setLastThirtyDays(resThirty.data);
  } catch (error) {
    console.log(error);
  }
};
