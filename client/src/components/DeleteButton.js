import * as React from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import axios from "axios";
import swal from "sweetalert";

export default function DeleteButton() {
  const [loading, setLoading] = React.useState(false);

  function handleClick() {
    axios
      .delete("http://localhost:8000/api/movies")
      .then((response) => {
        if (response.status == 200) {
          swal({
            title: "Are you sure For deleting all rows ?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          }).then((willAdd) => {
            if (willAdd)
              swal("success", {
                icon: "success",
              }).then((x) => window.location.reload());
          });
        }
      })
      .catch((error) => {});
    //setLoading(true);
  }

  return (
    <Box sx={{ "& > button": { m: 1 } }}>
      <LoadingButton
        onClick={handleClick}
        endIcon={<DeleteTwoToneIcon />}
        loading={loading}
        loadingPosition="end"
        variant="contained"
      >
        Delete
      </LoadingButton>
    </Box>
  );
}
