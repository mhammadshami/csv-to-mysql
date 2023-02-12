const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const fs = require("fs");
const csv = require("fast-csv");
const mysql = require("mysql");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

//cors
app.use(cors());

//use express static folder
app.use(express.static("./public"));

// body-parser middleware use
app.use(bodyparser.json());
app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);

// db connection
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "movies_db",
});

//! Use of Multer
var storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "./uploads/");
  },
  filename: (req, file, callBack) => {
    callBack(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({
  storage: storage,
});

//route for Home page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//Routes

// route for filter search
app.get("/api/movies/:movieName/:date/:directorName/:actorName", (req, res) => {
  const movieName = req.params.movieName.trim();
  const date = req.params.date.trim();
  const directorName = req.params.directorName.trim();
  const actorName = req.params.actorName.trim();

  const movieNameQuery = movieName == `^` ? "1" : `Name = "${movieName}"`;
  const dateQuery = date == "^" ? `1` : ` Year = "${date}" `;
  const directorNameQuery =
    directorName == "^" ? `1` : ` Director = "${directorName}" `;
  const actorNameQuery =
    actorName == "^" ? `1` : ` Actors LIKE "%${actorName}%" `;

  const sqlQuery = `Select Name, Director, Genre, Year, Rating, Votes, Revenue  from movies WHERE (${movieNameQuery} AND ${dateQuery} AND ${directorNameQuery} AND ${actorNameQuery})  ORDER BY Name ASC`;

  db.query(sqlQuery, (error, result) => {
    if (error) res.sendStatus(500);
    res.send(result);
  });
});

// get actors
app.get("/api/actors/:name", (req, res) => {
  //query string
  const sqlQuery = `Select DISTINCT Actors from movies ORDER BY Name ASC`;

  // db.query
  db.query(sqlQuery, (error, result) => {
    var actors = [];
    result.forEach((x) => {
      let item = x.Actors.split(",");
      actors = [...actors, ...item];
    });

    var filtered = actors.filter((item) =>
      item.toLowerCase().startsWith(req.params.name.toLocaleLowerCase())
    );
    //return res.json(filtered);

    //remove duplicate values
    return res.json([...new Set(filtered)]);
  });
});

// Get actors by sending string contains first letters
/*
app.get("/api/actors/:name", (req, res) => {
  // query string
  const sqlQuery = `Select DISTINCT Name from movies WHERE Name LIKE '${req.params.name}%' ORDER BY Name ASC`;

  db.query(sqlQuery, (error, result) => {
    if (error) res.sendStatus(500);
    res.send(result);
  });
});
*/

// get all years
app.get("/api/years", (req, res) => {
  const sqlQuery = "Select DISTINCT Year from movies ORDER BY Year ASC";
  db.query(sqlQuery, (error, result) => {
    if (error) res.sendStatus(500);
    res.send(result);
  });
});

// Get movies names
app.get("/api/names/:name", (req, res) => {
  const sqlQuery = `Select DISTINCT Name from movies WHERE Name LIKE '${req.params.name}%' ORDER BY Name ASC`;
  console.log(sqlQuery);
  db.query(sqlQuery, (error, result) => {
    if (error) res.sendStatus(500);
    res.send(result);
  });
});

// get directors 
app.get("/api/directors/:name", (req, res) => {
  const sqlQuery = `Select DISTINCT Director from movies WHERE Director LIKE '${req.params.name}%' ORDER BY Director ASC`;
  console.log(sqlQuery);
  db.query(sqlQuery, (error, result) => {
    if (error) res.sendStatus(500);
    res.send(result);
  });
});

// upload csv to database
app.post("/uploadfile", upload.single("uploadfile"), (req, res) => {
  let success = UploadCsvDataToMySQL(
    __dirname + "/uploads/" + req.file.filename
  );
  res.sendStatus(200);

  // console.log(__dirname + "/uploads/" + req.file.filename);
});
function UploadCsvDataToMySQL(filePath) {
  var success;
  let stream = fs.createReadStream(filePath);
  let csvData = [];
  let csvStream = csv
    .parse()
    .on("data", function (data) {
      csvData.push(data);
    })
    .on("end", function () {
      // Remove Header ROW
      csvData.shift();

      // Open the MySQL connection

      // create a new connection to the database
      const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "movies_db",
      });
      // open the connection
      return connection.connect((error) => {
        if (error) {
          console.log(error);
        } else {
          let query =
            "INSERT INTO movies(Name,	Genre,	Description,	Director,	Actors,	Year,	Runtime,	Rating,	Votes,	Revenue,	Metascore) VALUES ?";

          connection.query(query, [csvData], (error, response) => {
            console.log(success || response);
          });
        }
      });
      // delete file after saving to MySQL database
      // -> you can comment the statement to see the uploaded CSV file.
      fs.unlinkSync(filePath);
    });

  stream.pipe(csvStream);
}

//delete all rows in movies table
app.delete("/api/movies", (req, res) => {
  const sqlQuery = `DELETE FROM movies`;

  db.query(sqlQuery, (error, result) => {
    if (error) res.sendStatus(500);
    res.send(result);
  });
});
//create connection
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
