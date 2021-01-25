import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@material-ui/core";

export default function Summary({ data }) {
  return (
    <div>
      <TableContainer component={Paper} style={{ margin:'auto',marginTop: "2%" , width:'90%'}}>
        <Table aria-label="simple table">
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                Total Cases
              </TableCell>
              <TableCell align="right">{data["TotalConfirmed"]}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                New Cases
              </TableCell>
              <TableCell align="right">{data["NewConfirmed"]}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Active Cases
              </TableCell>
              <TableCell align="right">
                {data["TotalConfirmed"] - data["TotalRecovered"]}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Total Recovered
              </TableCell>
              <TableCell align="right">{data["TotalRecovered"]}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                New Recovered
              </TableCell>
              <TableCell align="right">{data["TotalRecovered"]}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Recovery Rate
              </TableCell>
              <TableCell align="right">
                {data["TotalRecovered"] / data["TotalConfirmed"]}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Total Deaths
              </TableCell>
              <TableCell align="right">{data["TotalDeaths"]}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                New Deaths
              </TableCell>
              <TableCell align="right">{data["NewDeaths"]}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Mortality Rate
              </TableCell>
              <TableCell align="right">
                {data["TotalDeaths"] / data["TotalConfirmed"]}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
