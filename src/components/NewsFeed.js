import {
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { getNews } from "../actions/db";

export default function NewsFeed({ country }) {
  const [countryNews, setCountryNews] = useState([]);
  useEffect(async () => {
    let news = getNews(country);
    console.log("news", news);
    setCountryNews(news);
  }, [country]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        height: "200px",
        maxWidth: "100%",
        overflow: "scroll",
        margin: "1% 5%",
      }}
    >
      {countryNews.length > 0 ? (
        countryNews.map((el) => (
          <Card
            style={{ margin: "1% ", minWidth: "200px", position: "relative" }}
          >
            <CardContent>
              <Typography variant="body1">{el.description}</Typography>
            </CardContent>
            <Divider />
            <CardActions style={{ position: "absolute", bottom: "0" }}>
              <Typography variant="caption" color="textSecondary">
                by: {el.user}
                <br />
                {el.date}
              </Typography>
            </CardActions>
          </Card>
        ))
      ) : (
        <Card
          style={{ margin: "1% ", minWidth: "200px", position: "relative" }}
        >
          <CardContent>
            <Typography variant="body1">
              No news for {country}
            </Typography>
          </CardContent>
          <Divider />
        </Card>
      )}
    </div>
  );
}
