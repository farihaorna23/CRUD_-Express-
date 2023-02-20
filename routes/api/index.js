const express = require("express");
const path = require("path");
const router = express.Router();
const fs = require("fs");

const pokemonFile = path.join(__dirname, "../../public/data.json");
//local:3000/api/test
router.get("/test", (req, res, next) => {
  try {
    res.json({ success: "true" });
  } catch (err) {
    next(err);
  }
});

router.get("/Pokemon", (req, res, next) => {
  //if the request has a query like search a pokemon by name or id ->send the client that specific pokemon
  //else send the entire list of pokemon
  const { name, num } = req.query;
  if (name || num) {
    //we have to read the pokemon file
    try {
      fs.readFile(pokemonFile, (err, content) => {
        //the content is buffer we need to decode it by converting it into string
        //parse the file for its content
        const { pokemon } = JSON.parse(content.toString()); //destructuring, the pokemon is an array with each objects being pokemon
        //get the data that we want
        const pokemonFound = pokemon.find(
          //name?.toLowerCase()-->giving Error
          pokemon => pokemon.name.toLowerCase() == name.toLowerCase() //|| pokemon.num == num
        );
        //incase pokemon doesn't exist because it has been deleted
        res.json(pokemonFound || { msg: "No pokemon exist by that name" });
      });
    } catch (err) {
      next(err);
    }
  } else {
    //sending all the pokemon
    try {
      res.sendFile(path.join(__dirname, pokemonFile));
    } catch (err) {
      next(err);
    }
  }
});

//post--> will recieve a request body with all the pokemon detail and add that pokemon to the file
// router.post("/addPokemon", (req, res, next) => {
//   //will have to parse the request body
//   const newPokemon = req.body;
//   //append the pokemon to the pokemonfile
//   try {
//     fs.appendFile(pokemonFile, newPokemon, err => {
//       console.log("succesfully added");
//     });
//   } catch (err) {
//     next(err);
//   }
// });

//post -> will recieve a request body of a new pokemon and add the new pokemon to the json file
router.post("/Pokemon", (req, res, next) => {
  //get the parsed request body
  const newPokemon = req.body;
  //read the file to get the content-> make sure to decode it and parse it
  fs.readFile(pokemonFile, (err, contents) => {
    if (err) {
      next(err); //server error
    }
    let { pokemon } = JSON.parse(contents.toString());
    //each of the new pokemon will get their own new id and num
    let pokemonId = pokemon[pokemon.length - 1].id + 1;
    newPokemon.id = pokemonId;
    newPokemon.num = String(pokemon[pokemon.length - 1].id + 1).padStart(
      3,
      "0"
    );
    //adding the newPokemon with all its detail to the original pokemon array
    pokemon.push(newPokemon);
    //overwrite the new array into the json file
    fs.writeFile(pokemonFile, JSON.stringify({ pokemon }), err => {
      if (err) {
        next(err);
      }
      res.json({ msg: "Pokemon added", insertedId: pokemonId });
    });
  });
});

//put-> the request handler will receive a body and an id--> update the deatil of the pokemon that has the id

router.put("/Pokemon", (req, res, next) => {
  //get the body
  const updatedDeatails = req.body;

  //get the id
  const { id } = req.query;
  //if id not valid->send a message to the client
  if (isNaN(parseInt(id))) {
    res.status(404).json({ msg: "Please send a valid id." });
  }

  //write it again to the file
  //send a response
  try {
    fs.readFile(pokemonFile, (err, content) => {
      if (err) {
        next(err);
      }
      //read the file and get the content
      const { pokemon } = JSON.parse(content.toString());
      //get the targeted pokemon and update info
      const findPokemon = pokemon.map(pokemon => {
        if (pokemon.id == id) {
          //when you find the pokemon, upate it with its old and new details
          pokemon = { ...pokemon, ...updatedDeatails };
        }
        //returning each pokemon of the array to the new array
        return pokemon;
      });
      fs.writeFile(
        pokemonFile,
        JSON.stringify({ pokemon: findPokemon }),
        err => {
          if (err) {
            next(err);
          } else {
            res.json({
              msg: `Succesfully updated the pokemon with the id ${id}`
            });
          }
        }
      );
    });
  } catch (err) {
    next(err);
  }
});

//delete -> the request handler will recieve an id and we would have to delete the pokemon
router.delete("/Pokemon", (req, res, next) => {
  //we would get the id from url
  const { id } = req.query;
  //check to see if the user actually gave valid number that can be use. If not, tell the client that their id is not valid
  if (isNaN(parseInt(id))) {
    res
      .status(400)
      .json({ msg: "The id is not valid. Please give the correct one" });
  }
  try {
    //we have to read the file and parse it
    fs.readFile(pokemonFile, (err, content) => {
      //decode the content and parse it
      //destructure so we can get the pokemon array that contains all the pokemon as objects
      const { pokemon } = JSON.parse(content.toString());
      //maybe filter the selected pokemon out of the orginal
      const filteredPokemon = pokemon.filter(pokemon => pokemon.id != id);
      //we have to write the new array to the file
      //we can overwrite
      //make sure the content is string/buffer
      fs.writeFile(
        pokemonFile,
        JSON.stringify({ pokemon: filteredPokemon }),
        err => {
          if (err) {
            next(err);
          } else {
            //send confirmation to the cliet that
            res.json({ msg: `Deleted the pokemon with id ${id}` });
          }
        }
      );
    });
  } catch (err) {
    next(err);
  }
  //write the result back into the file
});
module.exports = router;
