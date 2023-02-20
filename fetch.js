const fetch = require("isomorphic-fetch");
const fs = require("fs");
//fetching the data so that it can be written in a file
fetch(
  "https://raw.githubusercontent.com/Biuni/PokemonGO-Pokedex/master/pokedex.json"
)
  .then(res => res.json())
  .then(data => {
    fs.writeFile("./public/data.js", JSON.stringify(data), err => {
      if (err) {
        console.error(err);
      } else {
        console.log("Data added to the file");
      }
    });
  });
