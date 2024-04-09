import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import axios from "axios";


const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

export default function WeatherApp() {
  const [mode, setMode] = React.useState("light");
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState({
    City_Name: "",
    Region_Name: "",
    Temperature_Celsius: "",
    Temperature_Fahrenheit: "",
    Feels_Like_C: "",
    Feels_Like_F: "",
    Humidity: "",
    Wind_kph: "",
    Wind_Direction: "",
    Last_Updated: "",
  });

  const handleChangeMain = (event) => {
    setData(event.target.value);
  };

  const handleClick = () => {
    setIsLoading(true);
    axios
      .get(
        "http://api.weatherapi.com/v1/current.json?key=bcf71a78f2714a1c84e85029242402&q=" +
          data +
          "&aqi=no"
      )
      .then((res) => {
        setIsLoading(false);
        setData({
          City_Name: res.data.location.name,
          Region_Name: res.data.location.region,
          Temperature_Celsius: res.data.current.temp_c,
          Temperature_Fahrenheit: res.data.current.temp_f,
          Feels_Like_C: res.data.current.feelslike_c,
          Feels_Like_F: res.data.current.feelslike_f,
          Humidity: res.data.current.humidity,
          Wind_kph: res.data.current.wind_kph,
          Wind_Direction: res.data.current.wind_dir,
          Last_Updated: res.data.current.last_updated,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <AppBar>
            <Toolbar>
              <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                WeatherCheck
                {/* WeatherTracker */}
              </Typography>
              <IconButton onClick={colorMode.toggleColorMode} color="inherit">
                {theme.palette.mode === "dark" ? (
                  <Brightness7Icon />
                ) : (
                  <Brightness4Icon />
                )}
              </IconButton>
            </Toolbar>
          </AppBar>
          <Box
            sx={{
              bgcolor: theme.palette.background.default, 
              color: "text.primary",
              minHeight: "85vh",
              width: "100%",
              marginTop: "66px",
              transition: "background-color 0.3s",
              borderRadius: "10px",
              padding: "5px",
              position: "static",
            }}
          >
            

            <br />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              {/* <h4>Enter Location:</h4> */}
              <TextField
                id="outlined-basic"
                label="Enter Location"
                variant="outlined"
                onChange={handleChangeMain}
              />
              <br />

              <Button
                variant="contained"
                style={{ alignContent: "center" }}
                onClick={handleClick}
              >
                Submit
              </Button>
            </div>

            <br />
            {isLoading ? (
              <div>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <CircularProgress />
                </Box>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Card style={{ width: "100%", maxWidth: "800px" }}>
                  <CardContent>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div>
                        <table>
                          <tbody>
                            <TableRow label="City:" value={data.City_Name} />
                            <TableRow
                              label="Region:"
                              value={data.Region_Name}
                            />
                            <TableRow
                              label="Temperature(°C):"
                              value={data.Temperature_Celsius}
                            />
                            <TableRow
                              label="Feels Like(°C):"
                              value={data.Feels_Like_C}
                            />
                            <TableRow
                              label="Humidity(%):"
                              value={data.Humidity}
                            />
                          </tbody>
                        </table>
                      </div>
                      <div>
                        <table>
                          <tbody>
                            <TableRow
                              label="Temperature(°F):"
                              value={data.Temperature_Fahrenheit}
                            />
                            <TableRow
                              label="Feels Like(°F):"
                              value={data.Feels_Like_F}
                            />
                            <TableRow
                              label="Wind(KPH):"
                              value={data.Wind_kph}
                            />
                            <TableRow
                              label="Wind Direction:"
                              value={data.Wind_Direction}
                            />
                            <TableRow
                              label="Last Updated:"
                              value={data.Last_Updated}
                            />
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </Box>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </div>
  );
}

const TableRow = ({ label, value }) => (
  <tr>
    <td style={{ paddingRight: "10px" }}>
      <b>{label}</b>
    </td>
    <td>{value}</td>
  </tr>
);
