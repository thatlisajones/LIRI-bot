require("dotenv").config();

var keys = require("./keys");
var request = require("request");
var fs = require("fs");
var Spotify = require("node-spotify-api");
var moment = require("moment");

var spotify = new Spotify(keys.spotify);

var Concert = function (artist) {
    const URL = `https://rest.bandsintown.com/artists/${encodeSpecialChars(artist)}/events?app_id=codingbootcamp`;
        
    request(URL, function(err, res, body) {
        if (err) throw err;

        var events = JSON.parse(body);
        
        if (events.length) {
            for (var i = 0; i < events.length; i++) {
                var data = events[i];

                var output = [
                    "----------------------------------------------",
                    "Venue: " + data.venue.name,
                    "Location: " + data.venue.city + ", " + data.venue.region,
                    "Date: " + moment(data.datetime).format("MM/DD/YYYY")
                ].join("\n");

                console.log(output);
                fs.appendFile("log.txt", output + "\n", (err) => { if (err) throw err; });
            }            
        } else {
            console.log(`No concerts found for ${artist}`);
            fs.appendFile("log.txt", `No concerts found for ${artist}\n`, (err) => { if (err) throw err; });
        }
    });
};

var Song = function (song) {
    spotify.search({ type: "track", query: (song ? song : "The Sign") }, function(err, body) {
        if (err) throw err;

        var data = body.tracks.items[0];

        if (data) {
            var output = [
                "Artist(s): " + data.artists[0].name,
                "Song name: " + data.name,
                "Preview: " + data.preview_url,
                "Album: " + data.album.name
            ].join("\n");

            console.log(output);
            fs.appendFile("log.txt", output + "\n", (err) => { if (err) throw err; });
        } else {
            console.log(`Could not find a match for "${song}" on Spotify`);
            fs.appendFile("log.txt", `Could not find a match for "${song}" on Spotify\n`, (err) => { if (err) throw err; });
        }
    })
};

var Movie = function (movie) {
    var URL = `http://www.omdbapi.com/?apikey=${keys.omdb.apikey}&t=${movie ? movie : "Mr. Nobody"}`;

    request(URL, function(err, res, body) {
        if (err) throw err;

        var data = JSON.parse(body);

        if (data && !data.Error) {
            var output = [
                "Title: " + data.Title,
                "Year: " + data.Year,
                "Ratings:",
                "- IMDB: " + (data.Ratings.length && data.Ratings[0]) ? data.Ratings[0].Value : "N/A",
                "- Rotten Tomatoes: " + (data.Ratings.length && data.Ratings[1]) ? data.Ratings[1].Value : "N/A",
                "Country: " + data.Country,
                "Language: " + data.Language,
                "Plot: " + data.Plot,
                "Actors: " + data.Actors
            ].join("\n");

            console.log(output);
            fs.appendFile("log.txt", output + "\n", (err) => { if (err) throw err; });
        } else {
            console.log(`Error: ${data.Error}`);
            fs.appendFile("log.txt", `Error: ${data.Error}\n`, (err) => { if (err) throw err; });
        }
    });
}

var DoWhatItSays = function () {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) throw err;

        var cmd = data.split(",")[0];
        var term = data.split(",")[1];

        executeCommand(cmd, term);
    });
};

var executeCommand = function (cmd, term) {
    switch (cmd) {
        case "concert-this":
            Concert(term);
            break;
        case "spotify-this-song":
            Song(term);
            break;
        case "movie-this":
            Movie(term);
            break;
        case "do-what-it-says":
            DoWhatItSays();
            break;
    }
}

var encodeSpecialChars = function (string) {
    return string
            .replace('/', "%252F")
            .replace('?', "%253F")
            .replace('*', "%252A")
            .replace('"', "%27C");
};

const cmd = process.argv[2];
const term = process.argv.slice(3).join(" ");

fs.appendFile("log.txt", process.argv.join(" "), (err) => { if (err) throw err; });

executeCommand(cmd, term);