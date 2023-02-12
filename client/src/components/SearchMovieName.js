import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import axios from "axios";

export default function SearchMovieName(props) {
  //use state
  const [names, setNames] = React.useState([
    { name: "", title: "Enter Movie Name" },
  ]);

  //on input change
  const onInputChange = (e, value) => {
    if (value.trim() != "")
      axios.get(`http://localhost:8000/api/names/${value}`).then((response) => {
       
        let names = response.data.map((item) => {
          return {
            title: item.Name,
            name: item.Name,
          };
        });
        setNames([...names]);
      });
    else
      setNames([
        {
          name: "",
          title: "type any character",
        },
      ]);
  };

  //handle  change
  const onChange = (e, value) => {
    if (value == null) props.setMovieName("");
    else props.setMovieName(value.name);
  };

  const defaultProps = {
    options: names,
    getOptionLabel: (option) => option.title,
  };

  const flatProps = {
    options: names.map((option) => option.title),
  };

  const [value, setValue] = React.useState(null);

  return (
    <Stack spacing={1} sx={{ width: 200 }}>
      <Autocomplete
        getOptionDisabled={(option) => option.name === ""}
        {...defaultProps}
        id="auto-complete"
        onInputChange={onInputChange}
        onChange={onChange}
        autoComplete
        includeInputInList
        renderInput={(params) => (
          <TextField {...params} label="movie name" variant="standard" />
        )}
      />
    </Stack>
  );
}
