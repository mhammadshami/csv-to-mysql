import * as React from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import SendIcon from "@mui/icons-material/Send";

export default function SearchButton(props) {
 
  const [loading, setLoading] = React.useState(false);
  function handleClick() {
    setLoading(true);
    props.handleSearch();
    setLoading(false);
  }

  return (
    <Box sx={{ "& > button": { m: 1 } }}>
      <LoadingButton
        onClick={handleClick}
        endIcon={<SendIcon />}
        loading={loading}
        loadingPosition="end"
        variant="contained"
      >
        Search
      </LoadingButton>
    </Box>
  );
}
