const express = require("express");
const logger = require("morgan");
const axios = require("axios");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let cat = null;

const getCat = () => {
  console.log("Getting a cat");

  return axios
    .get("http://aws.random.cat/meow")
    .then(function(new_cat) {
      cat = new_cat.data;
      console.log("Got a new cat", new_cat.data);
      return cat;
    })
    .catch(function(error) {
      clearInterval(newCats);
      console.error("no longer fetching cats, because:", error);
    });
};

const newCats = setInterval(getCat, 60000);

const catCacheMiddleware = (req, res) => {
  if (!cat) {
    return getCat().then(() => res.send(renderCat(cat)));
  }

  return res.send(renderCat(cat));
};

const renderCat = cat => {
  return "<img src='" + cat.file + "' width='400px' />";
};

app.use(catCacheMiddleware);
app.use("/", () => {});

var listener = app.listen(8080, function() {
  console.log("Listening on port " + listener.address().port);
});
