// Read and set environment variables
require("dotenv").config();

var keys = require("./keys.js");
var request = require("request");
var fs = require("fs");
var moment = require('moment');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var command = process.argv[2];
var searchItem = "";
var dataLine1;
var dataLine2;
var dataLine3;
var dataLine4;
var dataLine5;
var dataLine6;
var dataLine7;
var dataLine8;

var commandLine = "";
for (i = 0; i < process.argv.length; i++) {
    commandLine += (process.argv[i] + " ");
};

for (i = 3; i < process.argv.length; i++) {
    searchItem += (process.argv[i] + " ");
}

searchItem = searchItem.trim();

switch (command) {
    case "concert-this":
        concertThis();
        break;
    case "spotify-this-song":
        spotifyThis();
        break;
    case "movie-this":
        movieThis();
        break;
    case "do-what-it-says":
        doWhat();
        break;
    default:
        break;
};

function concertThis() {
    request("https://rest.bandsintown.com/artists/" + searchItem + "/events?app_id=ee388fbe45944a2e54ad668916eaac75", function (error, response, body) {
        // if (!searchItem) {
        //     searchItem = "Rolling Stones"
        // } 
        // if (error) {
        //     return console.log('Maybe there are no shows scheduled, or there is an error such as: ' + error);
        // }   
        if (!error && response.statusCode === 204) {
            console.log("No upcoming shows found.")
        }
        if (!error && response.statusCode === 200) {
            dataLine1 = searchItem + " playing at " + JSON.parse(body)[0].venue.name + ", " + JSON.parse(body)[0].venue.city + ", " + JSON.parse(body)[0].venue.region + ", " + JSON.parse(body)[0].venue.country;
            dataLine2 = moment(JSON.parse(body)[0].datetime).format('MM/DD/YYYY');
            console.log(dataLine1);
            console.log(dataLine2);
            logFile();
        }
    });
};

function spotifyThis() {
    if (!searchItem) {
        searchItem = "The Sign by Ace of Base"
    }
    spotify.search({ type: "track", query: searchItem }, function (err, response) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        dataLine1 = "\nArtist: " + JSON.stringify(response.tracks.items[0].album.artists[0].name);
        dataLine2 = "\nSong: " + JSON.stringify(response.tracks.items[0].name);
        dataLine3 = "\nSpotify sample: " + JSON.stringify(response.tracks.items[0].album.artists[0].external_urls.spotify);
        dataLine4 = "\nAlbum: " + JSON.stringify(response.tracks.items[0].album.name);
        console.log(dataLine1);
        console.log(dataLine2);
        console.log(dataLine3);
        console.log(dataLine4);
        logFile();
    });
};

function movieThis() {
    if (!searchItem) {
        searchItem = "Mr. Nobody"
    }
    request("http://www.omdbapi.com/?apikey=34d66101&t=" + searchItem, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            dataLine1 = "Title: " + JSON.parse(body).Title;
            dataLine2 = "Release Year: " + JSON.parse(body).Year;
            dataLine3 = "IMDb Rating: " + JSON.parse(body).imdbRating;
            dataLine4 = "Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value;
            dataLine5 = "Country: " + JSON.parse(body).Country;
            dataLine6 = "Language: " + JSON.parse(body).Language;
            dataLine7 = "Plot: " + JSON.parse(body).Plot;
            dataLine8 = "Actors: " + JSON.parse(body).Actors;
            console.log(dataLine1);
            console.log(dataLine2);
            console.log(dataLine3);
            console.log(dataLine4);
            console.log(dataLine5);
            console.log(dataLine6);
            console.log(dataLine7);
            console.log(dataLine8);
            logFile();
        }
    });
};

function doWhat() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");
        command = dataArr[0];
        searchItem = dataArr[1];
        spotifyThis();
    })
};

function logFile() {
    fs.appendFile("log.txt", "\r\n" + commandLine + "\r\n" + dataLine1 + "\r\n" + dataLine2 + "\r\n" + dataLine3 + "\r\n" + dataLine4 + "\r\n" + dataLine5 + "\r\n" + dataLine6 + "\r\n" + dataLine7 + "\r\n" + dataLine8, function (error) {
        if (error) {
            return console.log(error);
        }
    });
};