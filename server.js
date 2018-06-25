const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => res.status(200).send("success"));

let data;

app.post("/data", (req, res) => {
  data = req.body.data;
  return res.status(200).json(data);
});
app.get("/data", (req, res) => {
  return res.json(data);
});
app.listen(port, () => console.log(`Server started on port ${port}`));
 