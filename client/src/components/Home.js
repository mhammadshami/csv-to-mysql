import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import { IconButton, Drawer, Divider } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import { Typography, Box } from "@mui/material";
import MoviesTable from "./Table";
import SelectComponent from "./SelectActor";
import SelectDirector from "./SelectDirector";
import SearchYear from "./SearchYear";
import SearchMovieName from "./SearchMovieName";
import SearchButton from "./SearchButton";
import DeleteButton from "./DeleteButton";
import Upload from "../components/Upload";
import UploadFileTwoToneIcon from "@mui/icons-material/UploadFileTwoTone";
import HomeTwoToneIcon from "@mui/icons-material/HomeTwoTone";
import axios from "axios";
import { Route, Switch, useHistory } from "react-router-dom";

const drawerWidth = 240;

function Home(props) {
  const history = useHistory();
  //use state
  const [loading, setLoading] = React.useState(false);
  const [tableData, setTableData] = React.useState([]);
  const [releaseDate, setReleaseDate] = React.useState("");
  const [movieName, setMovieName] = React.useState("");
  const [directorName, setDirectorName] = React.useState("");
  const [actorName, setActorName] = React.useState("");

  // handle search
  const handleSearch = () => {
    const movieNameQuery = movieName == "" ? "^" : `${movieName}`;
    const dateQuery = releaseDate == "" ? "^" : releaseDate;
    const directorNameQuery = directorName == "" ? `^` : directorName;
    const actorNameQuery = actorName == "" ? "^" : actorName;
    setLoading(true);
    axios
      .get(
        `http://localhost:8000/api/movies/${movieNameQuery}/${dateQuery}/${directorNameQuery}/${actorNameQuery}`
      )
      .then((response) => {
        if (response.status == 200) {
          setTableData(response.data);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log("error");
      });
  };
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {/* start csv upload file button */}
        <ListItem button onClick={() => history.push("/upload")}>
          <ListItemIcon>
            <UploadFileTwoToneIcon />
          </ListItemIcon>
          <ListItemText primary="Upload CSV File" />
        </ListItem>
        <Divider />
        {/* end csv upload file button */}
        <ListItem
          button
          onClick={() => history.push("/")}
          sx={{ paddingTop: 1 }}
        >
          <ListItemIcon>
            <HomeTwoToneIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
          <Divider />
        </ListItem>
        <Divider />
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Movie App
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Switch>
          {/* start Route for table page */}

          <Route exact path="/">
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
                <SelectComponent setActorName={setActorName} />
                <SelectDirector setDirectorName={setDirectorName} />
                <SearchMovieName setMovieName={setMovieName} />
                <SearchYear setReleaseDate={setReleaseDate} />
                <SearchButton handleSearch={handleSearch} />
              </Box>
              {loading ? (
                <Box sx={{ display: "flex" }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  <div style={{ width: "900px", margin: "30px auto" }}>
                    <MoviesTable data={tableData} />
                    {tableData.length > 0 && <DeleteButton />}
                  </div>
                </>
              )}
            </Box>
          </Route>
          {/* end Route for table page */}

          {/* start Route for upload page */}
          <Route exact path="/upload">
            <Upload />
          </Route>
          {/* end Route for table page */}
        </Switch>
      </Box>
    </Box>
  );
}

Home.propTypes = {
  window: PropTypes.func,
};

export default Home;
