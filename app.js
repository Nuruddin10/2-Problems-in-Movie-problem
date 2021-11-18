const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "moviesData.db");
const app = express();
app.use(express.json());
let db = null;

const dbAndServerInitialization = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("DB And server Initiated Successfully");
    });
  } catch (e) {
    console.log(`DBError: ${e.message}`);
    process.exit(1);
  }
};

dbAndServerInitialization();

app.get("/movies/", async (request, response) => {
  const QueryForGettingListOfMovies = `SELECT distinct movie_name FROM movie ;`;
  const responseDb = await db.all(QueryForGettingListOfMovies);
  response.send(responseDb);
});

app.post("/movies/", async (request, response) => {
  let newMovie = request.body;
  const { directorId, movieName, leadActor } = newMovie;
  const QueryForPostingNewMovie = `
  INSERT 
  INTO movie(director_id,movie_name,lead_actor) 
  VALUES (
        ${directorId},
       '${movieName}',
        '${leadActor}'
    );`;
  await db.run(QueryForPostingNewMovie);
  response.send("Movie Successfully Added");
});

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const QueryForGettingMovie = `
  SELECT * 
  FROM movie 
  WHERE movie_id = ${movieId} ;`;
  const movie = await db.get(QueryForGettingMovie);
  response.send(movie);
});

app.put("/movies/:movieId/", async (request, response) => {
  let { movieId } = request.params;
  const MovieDetails = request.body;
  const { directorId, movieName, leadActor } = MovieDetails;
  const QueryForUpdatingGivenMovieID = `
  UPDATE movie 
    SET 
    director_id = ${directorId} ,
    movie_name = ${movieName} ,
    lead_actor = ${leadActor} 
    WHERE movie_id = ${movieId} ;`;
  await db.run(QueryForUpdatingGivenMovieID);
  response.send("Movie Details Updated");
});
