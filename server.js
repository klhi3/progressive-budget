const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

const PORT = 3000;

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/budget", {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  // useCreateIndex: true,
}).then(()=> {
  console.log("connection to Database established");
}).catch(e => {
  console.log(`Database error ${e.message}`);
  process.exit(-1)
});


// routes
app.use(require("./routes/api.js"));

const port = process.env.PORT || PORT;
app.listen(port, () => {
  console.log(`App running on port ${port}!`);
});