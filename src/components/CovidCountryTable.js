import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
const useStyles = makeStyles({
  table: {
    width: 850,
    margin: "auto",
  },
  row: {
    "&:hover": {
      cursor: "pointer",
    },
  },
});

export default function CovidCountryTable({ data }) {
  const classes = useStyles();
  const history = useHistory();
  const [preparedData, setPreparedData] = useState(null);

  useEffect(() => {
    setPreparedData(data);
  }, [data]);

  const changeSorting = async (type, order) => {
    const key = type.replace(/\s+/g, "");
    const newData = await preparedData.sort((a, b) => {
      if (a[key] > b[key]) {
        if (order === "asc") {
          return 1;
        } else {
          return -1;
        }
      } else {
        if (order === "asc") {
          return -1;
        } else {
          return 1;
        }
      }
    });
    setPreparedData(null);
    setPreparedData(newData);
    // console.log(preparedData[0]);
  };

  return (
    <Paper elevation={2}  style={{ margin:'auto',marginTop: "2%" , width:'90%'}} >
      {preparedData && (
        <TableContainer
          component={Paper}
          style={{ maxHeight: 500, overflow: "scroll" }}
        >
          <Table
            className={classes.table}
            aria-label="simple table"
            size="small"
          >
            <TableHead>
              <TableRow hover>
                <TableCell>Country</TableCell>
                {[
                  "New Confirmed",
                  "Total Confirmed",
                  "New Recovered",
                  "Total Recovered",
                  "New Deaths",
                  "Total Deaths",
                ].map((el) => (
                  <TableCell align="right">
                    {el}
                    <br />
                    <KeyboardArrowDownIcon
                      onClick={() => changeSorting(el, "des")}
                    />
                    <KeyboardArrowUpIcon
                      onClick={() => changeSorting(el, "asc")}
                    />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {preparedData.map((row) => (
                <TableRow key={row["Country"]} hover className={classes.row}>
                  <TableCell
                    component="th"
                    scope="row"
                    onClick={() =>
                      history.push({
                        pathname: `/country`,
                        state: `${row.Country}`,
                        slug: `${row.Slug}`,
                        summary: row
                      })
                    }
                  >
                    {row.Country}
                  </TableCell>
                  <TableCell align="right">{row.NewConfirmed}</TableCell>
                  <TableCell align="right">{row.TotalConfirmed}</TableCell>
                  <TableCell align="right">{row.NewRecovered}</TableCell>
                  <TableCell align="right">{row.TotalRecovered}</TableCell>
                  <TableCell align="right">{row.NewDeaths}</TableCell>
                  <TableCell align="right">{row.TotalDeaths}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}
