import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import axios from "axios";

export default function SelectDirector(props) {
  //use state
  const [directors, setDirectors] = React.useState([
    { Director: "", title: "Enter Director Director" },
  ]);

  //on input change
  const onInputChange = (e, value) => {
    if (value.trim() != "")
      axios
        .get(`http://localhost:8000/api/directors/${value}`)
        .then((response) => {
          if (response.status == 200) {
            let names = response.data.map((item) => {
              return {
                title: item.Director,
                Director: item.Director,
              };
            });
            setDirectors([...names]);
          }
        });
    else
      setDirectors([
        {
          Director: "",
          title: "type any character",
        },
      ]);
  };

  //handle  change
  const onChange = (e, value) => {
    if (value == null) props.setDirectorName("");
    else props.setDirectorName(value.Director);
  };

  const defaultProps = {
    options: directors,
    getOptionLabel: (option) => option.title,
  };

  const flatProps = {
    options: directors.map((option) => option.title),
  };

  const [value, setValue] = React.useState(null);

  return (
    <Stack spacing={1} sx={{ width: 200 }}>
      <Autocomplete
        getOptionDisabled={(option) => option.Director === ""}
        {...defaultProps}
        id="auto-complete"
        onInputChange={onInputChange}
        onChange={onChange}
        autoComplete
        includeInputInList
        renderInput={(params) => (
          <TextField {...params} label="Director Name" variant="standard" />
        )}
      />
    </Stack>
  );
}
