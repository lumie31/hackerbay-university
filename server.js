const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => res.status(200).send("success"));
app.post("/data", (req, res, next) => {
  let data = req.body.data;
  res.json(data);
  next();
});
app.get("/data", (req, res) => {
  res.json({ data: req.data });
});
app.listen(port, () => console.log(`Server started on port ${port}`));
