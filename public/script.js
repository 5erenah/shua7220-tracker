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
const TRACKS = "https://api.spotify.com/v1/me/top/tracks?offset=0&limit=10&time_range=long_term";

// html elements
const list = document.getElementById('list');
const cover = document.getElementById ('cover');
cover.classList.add("hide");

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


//loading dependant on whether user has previously logged in or not 
//spotify access token ia valid for 60minutes
function onPageLoad() {

    if (window.location.search.length > 0) {
        handleRedirect();
    } else {
        getSongs();
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
    refresh_token = localstorage.getItem("refresh_token");
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

// post call to spotify API to retrieve 
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
    } else if (this.status == 401){
        refreshAcessToken();
    } else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function songList(data) {
    removeItem();
    cover.classList.remove('hide');
    for(i = 0; i < data.items.length; i++) {
        const list_item = document.createElement ('div');
        const list_text = document.createElement ('div');
        const song = document.createElement('div');
        const artist_album = document.createElement('div');
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
        artist_album.classList.add("artist-album");
        ref.classList.add("links");
        ref.setAttribute("target", "blank");
        popu.classList.add("popu");
        img.classList.add("resize");
        
        var li = document.createElement('li');
        img.src = data.items[i].album.images[1].url;

        popu.innerHTML= "Popularity Rating: " + data.items[i].popularity;
        span.innerHTML = data.items[i].name;
        artist_album.innerHTML = data.items[i].album.name + " . " + data.items[i].artists[0].name;
      
        //span.appendChild(a)
        song.appendChild(span);

        list_text.appendChild (song) ;
        list_text.appendChild(artist_album);
        list_text.appendChild(popu);
        list_text.appendChild(ref);
        list_item.appendChild(list_text) ;
        list_item.appendChild(img);
        li.appendChild(list_item);

        list.appendChild(li);
        }
    }

// clear list each time API is called 
function removeItem() {
    list.innerHTML = '';
}