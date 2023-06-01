// Includes code from https://developer.spotify.com/documentation/web-api/tutorials/code-flow
// login to users profile (user gives permissions)
// URL to which the user will be redirected after the authentication process.
var redirect = "http://localhost:1234/callback";

// credentials provided by Spotify for the application to authenticate with the Spotify API.
const client_id = 'ad8a873204e5497ab79d7f1ea3451ce8';
const client_secret = 'a35fb90ab96948129f2d21a34e5ab77d';

// URL for Spotify authorisation endpoint.
const AUTHORIZE = "http://accounts.spotify.com/authorize";
// URLs for Spotify API endpoints.
const TOKEN = "https://accounts.spotify.com/api/token"
// endpoint specifies the limit of 10 songs OR artists from users long term listening history
const TRACKS = "https://api.spotify.com/v1/me/top/tracks?offset=0&limit=10&time_range=short_term";
const ARTISTS = "https://api.spotify.com/v1/me/top/artists?offset=0&limit=10&time_range=short_term";
const AUDIO_FEATURES = "https://api.spotify.com/v1/audio-features";

// html elements
const list = document.getElementById('list');
const cover = document.getElementById ('cover');
cover.classList.add("hide");

// Declare the global variables with initial values
var trackIdsStr = "";
var trackPopuNum = [];
var artistIds = [];
var artistPopuNum = [];


// redirect to authorisation URL
function authorize() {
    let url = AUTHORIZE;
    url += "?client_id=" + client_id; 
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect);
    url += "&show_dialog=true";
    url += "&scope=user-read-private user-read-email user-read-playback-state user-top-read";
    window.location.href = url;
}

function onPageLoad() {
    access_token = localStorage.getItem("access_token")
    // if statement to check whether access token exists and is valid then go to "logged-view"
    // regardless of browser refresh (Spotify access token lasts 60 minutes)
    if (window.location.search.length > 0) {
        handleRedirect(); 
    } 
    else if (access_token) {
        document.getElementById("login-view").style.display = "none";
        document.getElementById("logged-view").style.display = "block";
        getSongs();
        getArtists();
    } else {
        document.getElementById("login-view").style.display = "block";
        document.getElementById("logged-view").style.display = "none";
    }
}

// fetching access token provided in the URL of login
function handleRedirect() {
    let code = getCode();
    fetchAccessToken(code);
    window.history.pushState("","",redirect) // remove param from URL
}

function getCode() {
    let code = null;
    const queryString = window.location.search;
    if (queryString.length > 0){
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code');
    }
    return code;
}

// making api call to api/token endpoint  
function fetchAccessToken(code) {
    let body = "grant_type=authorization_code"; 
    body += "&code=" + code; 
    body += "&redirect_uri=" + encodeURI(redirect);
    body += "&client_id=" + client_id; 
    body += "&client_secret=" + client_secret;
    callAuthApi(body); 
}

// Post call to spotify API to retrive authorisation data
function callAuthApi(body) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("Authorization", "Basic " + btoa(client_id + ":" + client_secret)); // Add a space after "Basic"
    xhr.send(body);
    xhr.onload = handleAuthResponse;
}

function refreshAcessToken() {
    refresh_token = localStorage.getItem("refresh_token");
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + refresh_token;
    body += "&client_id=" + client_id;
    callAuthApi(body);
}

function handleAuthResponse() {
    // if sucessful, have access to users information
    if(this.status == 200) {
        var data = JSON.parse(this.responseText); // parse data
        if (data.access_token != undefined) {
            access_token = data.access_token;
            localStorage.setItem("access_token", access_token);
        }  
        if (data.refresh_token != undefined) {
            refresh_token = data.refresh_token;
            localStorage.setItem("refresh_token", refresh_token);
        }    
        // Show the 'logged' view and hide the 'login' view
        document.getElementById("login-view").style.display = "none";
        document.getElementById("logged-view").style.display = "block";
        getSongs();
    } else { //else return error 
        console.log(this.repsonseText);
        alert(this.responseText);
    }
}

// get call to the API to retrive users top songs 
function getSongs() {
    callApi("GET", TRACKS, null, handleSongResponse);
}

// Post call to spotify API to retrieve data
function callApi(method, url, body, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader (`Content-Type`, `application/json`);
    xhr.setRequestHeader ('Authorization', 'Bearer ' + localStorage.getItem("access_token"));
    xhr.send (body);
    xhr.onload = callback;
}

function handleSongResponse() {
    if (this.status == 200) {
        var data = JSON.parse(this.responseText);
        console.log(data);
        songList(data);

        // Process the response data and extract track IDs as a string
        for (var i = 0; i < data.items.length; i++) {
            if (i > 0) {
                trackIdsStr += ",";
            }
            trackIdsStr += data.items[i].id;
        }
        console.log(trackIdsStr)

        // fetch audio features based of the track IDs from the users top 10 tracks
        if (trackIdsStr !== "") {
            // Call the function to retrieve audio features using trackIdsStr
            getAudioFeatures(trackIdsStr);
        } else {
            console.log("No track IDs available.");
        }

    } else if (this.status == 401){
        refreshAcessToken();
    } else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function handleArtistResponse() {
    if (this.status == 200) {
        var data = JSON.parse(this.responseText);
        artistList(data);
        console.log(data)

        // Extract artist ID's
        for (var i = 0; i < data.items.length; i++) {
            artistIds.push(data.items[i].id);
        }

        // Extract artist popularity rating
        for (var i = 0; i < data.items.length; i++) {
            artistPopuNum.push(data.items[i].popularity);
        }

    } else if (this.status == 401){
        refreshAcessToken();
    } else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}


// Displays Song data (top 10 tracks) 
function songList(data) {
    removeItem();
    cover.classList.remove('hide');
    for(i = 0; i < data.items.length; i++) {
        const list_item = document.createElement ('div');
        const list_text = document.createElement ('div');
        const song = document.createElement('div');
        const artist= document.createElement('div');
        const album = document.createElement('div');
        const img = document.createElement ('img') ;
        const span = document.createElement('span');
        const popu = document.createElement ('div');
        const ref = document.createElement ('a');
        const link = document.createTextNode ('Link to Spotify') ;
        ref.appendChild(link);
        ref.title = "Link to Spotify";
        ref.href = data.items[i].external_urls.spotify;

        list_item.classList.add("list-item");
        list_text.classList.add("list-text");
        song.classList.add ("song") ;
        artist.classList.add("artist");
        album.classList.add("album");
        ref.classList.add("links");
        ref.setAttribute("target", "blank");
        popu.classList.add("popu");
        img.classList.add("resize");
        
        var li = document.createElement('li');
        img.src = data.items[i].album.images[1].url;

        popu.innerHTML= "Popularity Rating: " + data.items[i].popularity;
        span.innerHTML = data.items[i].name;
        artist.innerHTML = data.items[i].artists[0].name;
        album.innerHTML = data.items[i].album.name;
    
        //appending item to the ordered list  
        song.appendChild(span);

        list_text.appendChild(song);
        list_text.appendChild(artist);
        list_text.appendChild(album);
        // list_text.appendChild(popu);
        list_text.appendChild(ref);
        list_item.appendChild(list_text);
        list_item.appendChild(img);
        li.appendChild(list_item);

        list.appendChild(li);
        }
    }

// clear list each time API is called 
function removeItem() {
    list.innerHTML = '';
}

// API call to get users top 10 artists
function getArtists() {
    callApi("GET", ARTISTS, null, handleArtistResponse);
}

// Displays Artist data (top 10 tracks) 
function artistList(data) {
    removeItem();
    cover.classList.remove('hide');
    for(i = 0; i < data.items.length; i++) {
        const list_item = document.createElement ('div');
        const list_text = document.createElement ('div');
        const artist = document.createElement('div');
        const genres = document.createElement('div');
        const img = document.createElement ('img') ;
        const span = document.createElement('span');
        const popu = document.createElement ('div');
        const ref = document.createElement ('a');
        const link = document.createTextNode ('Link to Spotify') ;
        ref.appendChild(link);
        ref.title = "Link to Spotify";
        ref.href = data.items[i].external_urls.spotify;

        list_item.classList.add("list-item");
        list_text.classList.add("list-text");
        artist.classList.add ("artist") ;
        genres.classList.add("genre");
        ref.classList.add("links");
        ref.setAttribute("target", "blank");
        popu.classList.add("popu");
        img.classList.add("resize");
        
        var li = document.createElement('li');
        img.src = data.items[i].images[1].url;

        popu.innerHTML= "Popularity Rating: " + data.items[i].popularity;
        span.innerHTML = data.items[i].name;
        for(j = 0; j < data.items[i].genres.length; j++){
            if(j > 1) {
                break;
            } else if (j == 1) {
                genres.innerHTML = genres.innerHTML + " . " + data.items[i].genres[j];
            } else {
                genres.innerHTML = data.items[i].genres[j];
            }
        }
    
        //appending item to the ordered list  
        artist.appendChild(span);

        list_text.appendChild(artist);
        list_text.appendChild(genres);
        list_text.appendChild(popu);
        list_text.appendChild(ref);
        list_item.appendChild(list_text);
        list_item.appendChild(img);
        li.appendChild(list_item);

        list.appendChild(li);
        }
    }

// Function to retrieve audio features based on users top 10 songs
function getAudioFeatures(trackIds) {

  // Construct the API URL with the track IDs taken from user's top 10 tracks
  const FEATURES = `${AUDIO_FEATURES}?ids=${trackIdsStr}`;

  // Make the API call
  callApi("GET", FEATURES, null, handleAudioFeaturesResponse);
}

// Callback function to handle the audio features response
function handleAudioFeaturesResponse() {
  if (this.status == 200) {
    var data = JSON.parse(this.responseText);
    console.log(data);

    // intialising variables to the averages of the data
    let totalDanceability = 0;
    let totalEnergy = 0;
    let totalValence = 0;
    let totalLiveness = 0;

    // outer loop that iterates over the top 10 songs
    for (let i = 0; i < data.audio_features.length; i++) {
        // An array of audio features for each song
        const audioFeature = data.audio_features[i]; 
        // accumulates values for particular feature across all songs
        totalDanceability += audioFeature.danceability;
        totalEnergy += audioFeature.energy;
        totalValence += audioFeature.valence;
        totalLiveness += audioFeature.liveness;
    }
    console.log(data.audio_features)
    console.log(totalDanceability)
    
    // Finding the averages of all these numeric values
    const averageDanceability = (totalDanceability / data.audio_features.length) * 100;
    const averageEnergy = (totalEnergy / data.audio_features.length) * 100;
    const averageValence = (totalValence / data.audio_features.length) * 100;
    const averageLiveness = (totalLiveness / data.audio_features.length) * 100;

    console.log('Average Danceability:', averageDanceability + '%');
    console.log('Average Energy:', averageEnergy + '%');
    console.log('Average Valence:', averageValence + '%');
    console.log('Average Liveness:', averageLiveness + '%');

  } else if (this.status == 401) {
    refreshAcessToken();
  } else {
    console.log(this.responseText);
    alert(this.responseText);
  }
}


// Displays features of song data (average of top 10 tracks)
function featuresList(data) {
    removeItem();
    cover.classList.remove('hide');
    for(i = 0; i < data.items.length; i++) {
        const list_item = document.createElement ('div');
        const artist = document.createElement('div');
        const genres = document.createElement('div');
        const img = document.createElement ('img') ;
        const span = document.createElement('span');
        const popu = document.createElement ('div');
        const ref = document.createElement ('a');
        const link = document.createTextNode ('Link to Spotify') ;
        ref.appendChild(link);
        ref.title = "Link to Spotify";
        ref.href = data.items[i].external_urls.spotify;

        list_item.classList.add("list-item");
        list_text.classList.add("list-text");
        artist.classList.add ("artist") ;
        genres.classList.add("genre");
        ref.classList.add("links");
        ref.setAttribute("target", "blank");
        popu.classList.add("popu");
        img.classList.add("resize");
        
        var li = document.createElement('li');
        img.src = data.items[i].images[1].url;

        popu.innerHTML= "Popularity Rating: " + data.items[i].popularity;
        span.innerHTML = data.items[i].name;
        for(j = 0; j < data.items[i].genres.length; j++){
            if(j > 1) {
                break;
            } else if (j == 1) {
                genres.innerHTML = genres.innerHTML + " . " + data.items[i].genres[j];
            } else {
                genres.innerHTML = data.items[i].genres[j];
            }
        }
    
        //appending item to the ordered list  
        artist.appendChild(span);

        list_text.appendChild(artist);
        list_text.appendChild(genres);
        list_text.appendChild(popu);
        list_text.appendChild(ref);
        list_item.appendChild(list_text);
        list_item.appendChild(img);
        li.appendChild(list_item);

        list.appendChild(li);
        }
    }

    function removeItem() {
        list.innerHTML = '';
    }
    
