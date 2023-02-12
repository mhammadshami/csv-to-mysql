import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import axios from "axios";

export default function SearchYear(props) {
  const [years, setYears] = React.useState([]);

  //use effect
  React.useEffect(() => {
    axios.get("http://localhost:8000/api/years").then((response) => {
      if (response.status == 200) {
        //console.log("years", response.data);
        let years = response.data.map((item) => {
          return {
            label: item.Year,
            year: item.Year,
          };
        });
        setYears(years);
      }
    });
  }, []);

  // const handle change
  const handleChange = (e, value) => {
    if (value) props.setReleaseDate(value.year);
    else props.setReleaseDate("");
  };
  return (
    <Stack spacing={1} sx={{ width: 200 }}>
      <Autocomplete
        onChange={handleChange}
        //onChange={(event, value) => console.log(value)}
        disablePortal
        id="combo-box-demo"
        //options={top100Films}
        options={years}
        renderInput={(params) => (
          <TextField {...params} label="Release Date" variant="standard" />
        )}
      />
    </Stack>
  );
}
