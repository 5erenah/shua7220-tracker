# Spotify Music Tracker 🎵
README template taken from https://github.com/scottydocs/README-template.md

`Spotify Music Tracker` is a tracking `utility` designed for `Spotify users` to track their listening history. Users can gain insights into their listening habits and patterns, allowing them to track how their preferred types of music has developed or changed overtime. By analyzing the features found in their top 10 Trakcs history, the utility assigns a unique `"Musical Colour Palette"` to each user. This palette is an abstract visual summary of the features which dominate their top 10 tracks.

## Application Configuration

There are three files in the public folder:
- index.html: A single page architecture with dynamic views to visualise data
- style.css: A CSS stylesheet that controls the styling of the whole webpage
- script.js: A javascript file that responds to user inputs by storing and visualising the data

## Prerequisites

Before you begin, ensure you have met the following requirements:
* You have installed the latest version of `Node.js`.
* You have a `Windows`, `Linux`, or `Mac` machine. (This project is supported on all major operating systems.)
* You have read the documentation related to the project, which can be found at `<insert_link_to_documentation>`.

## Deployment Procedures

Please follow the below steps to deploy the website:

1. Use `index.html` as the entry point of the website.
2. The website is designed to provide the best experience on screens with a 1020x948 ratio. However, it is also optimized for other window size classed: compact, medium, and expanded, including tablet 840px and mobile 600px. Note that some functions may be limited on mobile devices, such as hovering. For the best experience, it is recommended to view this website on a desktop.
3. The only required package for deployment is the Node server. It is used for hosting the website locally. To start running the website, follow these steps:
   - Open a terminal or command prompt
   - Run the command: `npm start`
   - Open your preferred web browser (most suitable with Google Chrome).
   - Enter the URL: [http://localhost:1234](http://localhost:1234)

Additionally, during the development process, the "Live Server" extension from VS Code was preferred and utilized for efficient and easier testing purposes.

## Data Processing
Personal data retrieved from the ]
## Data Analysis and Visualization

## API Documentation

### Authorization and Token Management

The OAuth 2.0 authorisation framework used by Spotify's API, specifically the [Authorization Code Flow](https://developer.spotify.com/documentation/web-api/tutorials/code-flow) requires the following processes:

1. The user is redirected to Spotify's authorization URL, where they provide permissions to the application.
2. After authentication, the user is redirected back to [http://localhost:1234/callback](http://localhost:1234/callback).
3. The client ID and client secret credentials provided by Spotify are used for authentication with the Spotify API.
4. The authorization endpoint is used for user authorization.
5. The token endpoint is used to exchange the authorization code for an access token.
6. The access token is used for API requestsStoring the access token and refresh token in the `localStorage`.
3. Handling the redirect after authentication to retrieve the authorization code.
4. Fetching the access token by making a `POST` request to the token endpoint with the authorization code.
5. Handling the response to store the access token and refresh token.
6. Refreshing the access token using the refresh token when it expires, this will **save the data to for persistent access between sessions**.


### API Requests
API requests are made using the `callApi` function. It supports `GET` and `POST` methods and includes the necessary headers, such as the `Content-Type` and `Authorization` headers. The access token is included in the `Authorization` header using the Bearer token authentication scheme.

### API Endpoints
The following API endpoints are used in the code:

- Authorization Endpoint: `http://accounts.spotify.com/authorize`
- Token Endpoint: `https://accounts.spotify.com/api/token`
- Top Tracks Endpoint: `https://api.spotify.com/v1/me/top/tracks?offset=0&limit=10&time_range=<term>`
- Top Artists Endpoint: `https://api.spotify.com/v1/me/top/artists?offset=0&limit=10&time_range=<term>`
- Audio Features Endpoint: `https://api.spotify.com/v1/audio-features`

## Justification of Elements
Iterations on the Data Model after recieving feedback from A3 has caused a significant change of the UI of the web application.

### Reset Stylesheet
The CSS stylesheet taken from Richard Clark's [HTML5 Reset Stylesheet](https://html5doctor.com/html-5-reset-stylesheet/) removed inconsistencies in the CSS styling.

### Typography
Cormorant Garamond and Montserrat font is part of the [Google Fonts library](https://fonts.google.com/). This means that these font-famillies are cleared for both personal and commercial use.
* I have imported different ```<font-weight>``` and ```<font-styles>``` of these ```<font-families>``` to ensure that greater heirachy and aesthetic requirements of the proposed design could be met.
* I have used ```<h1></h1>```to ```<p></p>``` tags to ensure consistency of clear heirarchy, increasing usability.
* I have used the correct respective Font Fall backs in my CSS to ensure usability in the case that a display system encounters a character that is not part of the repertoire of any of the other available fonts.
  * ```font-family: "Montserrat", sans-serif;```
* I have made __iteration__ to the fonts as the original styles appeared too bulky for the UI, hence I have aimed to find similar styles which were more comfortable for the eye.

### Event Listeners
The code includes event listeners to handle user interactions and trigger API requests. The following event listeners are implemented:

- `DOMContentLoaded` event listener to handle page load and check for an existing access token.
- Form submit event listener to retrieve user input and update the API endpoints for fetching songs and artists.
- Click event listener to handle the authorization process when the user clicks on the "Authorize" button.

### Login view
- The login vew is the entry point when the user first enters the site and is necessary as a seperate HTML view from the main page for the clearest **information architecture** and navigation of the application.
- Iterating from my intial design, I decided to add a background image to provide greater visual interest, this image is downloaded from [freepik.com](https://www.freepik.com/search?format=search&query=https%3A%2F%2Fimg.freepik.com%2Ffree-vector%2Fcolorful-equalizer-wave-background_52683-33072.jpg%3Fw%3D1800%26t%3Dst%3D1685856615~exp%3D1685857215~hmac%3D76451a4d3a7a22329ae85e7329460411764ef04c8f74b7cd8fc330a8313d3719) to ensure that it is copyright free to use.
![Login view](documentationImg/loginPage.png)

### Authentication Redirect
- This selected authentication flow is necessary for the purpose of my web application as I require personalised data from the users to analyse and hence return personalised insights. I decided on this change from A2 as I believed it would be the most efficient, accurate and interesting method to gain real-life personalised data.
- The users need to allow access to the specified [scopes](https://developer.spotify.com/documentation/web-api/concepts/scopes) of information which the tracking application will be requesting access from the user. These are the three scopes required for Musical Colours:
1. `user-read-email`
2. `user-read-playback-state (Read access to a user’s player state.)`
3. `user-top-read (Read access to a user's top artists and tracks)`
![Spotify Authentication page](documentationImg/authPage.png)


### Form (User Input)
- Following feedback from A2, I decided to include another form of user input which allows them to track their listening history overtime.
``` Javascript  
// Users can select listening history to analyse by altering the API endpoint scopes
tracksEndpoint = "https://api.spotify.com/v1/me/top/tracks?offset=0&limit=10&time_range=" + term;
artistsEndpoint = "https://api.spotify.com/v1/me/top/artists?offset=0&limit=10&time_range=" + term;
```
- **Clear and concise labels:** Input field is accompanied by a descriptive `<label>` to provide users with a clear understanding of the expected input.
![Form selection options](documentationImg/formOptions.png)
- **Error prevention:** The warning signals prompt users to provide the necessary information before attempting to submit the form, reducing the occurrence of form submission errors.
- **Assistive technology compatibility:** The warnings are designed to be compatible with assistive technologies, allowing users who rely on screen readers or other accessibility tools to be aware of the required input.
![Required form](documentationImg/formRequired.png)


### Scroll Behavior
The chosen scroll behavior has been carried on as planned from A2 having the right side as a scrolling list while the left remained fixed.
- **Smooth scrolling:** The application employs a `smooth scrolling behavior`, providing users with a visually pleasing and seamless scrolling experience. This eliminates abrupt jumps and enhances the readability of content.
![Fixed left hand side](documentationImg/fixedScroll.png)
- **Fixed left-hand:** This enables only the necessary areas of the page to scroll using `y-overflow: scroll`.
- **Scroll indicators:** Clear indicators, such as scroll bars or progress bars, are automatically implemented on the browser which provides users with a sense of their position within a page or document. 


### Navigation Using Color
The chosen scroll behavior was iterated after beginning A3 as I realised that it was not clear which section/view of the website the user was on. 
![navigation tabs](documentationImg/navTabs.png)
- **Color contrast:** The application ensures that the color combinations used for navigation elements adhere to accessibility standards, providing sufficient contrast for users with visual impairments, meeting `AA WACG standards`.
- **Consistent color scheme:** A consistent color scheme is employed throughout the navigation elements, helping users quickly identify and associate specific colors with different sections or actions carried on from the colour scheme of A2.
```CSS
#getArtists.active, #getTracks.active, #getColours.active {
    background-color: #03DAC5; 
    color: rgb(0, 0, 0); }
```
- **Clear visual cues:** The application uses a bright blue to strategically highlight active navigation items, making it easier for users to understand their current location within the application.
![navigation colour](documentationImg/navTabs2.png)

### Hyperlink Images
The use of hyperlink images was a later iteration when working with media queries as there was too much text content in the body of the list.
- **Cleaner UI:** This massively reduced clutter and still enabled the users to navigate to the source if they required.
- **Visual cues:** Hyperlink images are easily recognizable and provide visual cues to indicate interactive elements within the application.
- **Title:** Each hyperlink image is accompanied by appropriate text which can be read when the mouse is hovering. This text also ensures that users who rely on screen readers or have images disabled can understand the purpose of the content.
- **Consistent styling:** Hyperlink images are designed consistently, making them easily identifiable across different pages or sections of the application.
![Hyperlink Images](documentationImg/hyperlinkImg.png)

### Hover Dialogues
Hover dialogues contribute to usability and accessibility in the web application.

- **Additional context:** Hover dialogues provide supplementary information or tooltips when users hover over each colour. This enhances usability by offering additional explanations about their othewise absract `Musical Colour` without cluttering the main interface.
  ![Hover Dialouge](documentationImg/hoverDialouge.png)
  ``` Javascript
      // Add event listeners for hovering over 
      colourPalette.addEventListener('mouseover', function () {
        // Show the dialogue pop-up when hovering over the color block
        paletteDesc.style.display = 'block';
      });
  
      colourPalette.addEventListener('mouseleave', function () {
        // Hide the dialogue pop-up when leaving the color block
        paletteDesc.style.display = 'none';
      });
  ```

```javascript
const message = "Hello, world!";
console.log(message);
```


## Future improvements 

## Conclusion

## References 📖

Authorization Code Flow | Spotify for Developers. (n.d.). Retrieved June 6, 2023, from https://developer.spotify.com/documentation/web-api/tutorials/code-flow
Baranowicz, T. (2023). Tombaranowicz/SpotifyPlaylistExport [JavaScript]. https://github.com/tombaranowicz/SpotifyPlaylistExport (Original work published 2020)
Better design for bigger screens. (n.d.). Material Design. Retrieved June 6, 2023, from https://material.io/blog/material-you-large-screens
Browse Fonts. (n.d.). Google Fonts. Retrieved June 5, 2023, from https://fonts.google.com/
Chen, S. (2020). Spotify recommender + insights [JavaScript]. https://github.com/stephaniejnc/spotify-recommender (Original work published 2020)
Colorful-equalizer-wave-background_52683-33072.jpg (1800×1200). (n.d.). Retrieved June 4, 2023, from https://img.freepik.com/free-vector/colorful-equalizer-wave-background_52683-33072.jpg?w=1800&t=st=1685856615~exp=1685857215~hmac=76451a4d3a7a22329ae85e7329460411764ef04c8f74b7cd8fc330a8313d3719
Free Vector | Colorful equalizer wave background. (n.d.). Freepik. Retrieved June 4, 2023, from https://www.freepik.com/xhr/detail/6849398?type=vector&amp;query=sound%20waves
Hardt, D. (2012). The OAuth 2.0 Authorization Framework (Request for Comments RFC 6749). Internet Engineering Task Force. https://doi.org/10.17487/RFC6749
HTML Tutorial. (n.d.). Retrieved June 6, 2023, from https://www.w3schools.com/html/default.asp
Imdad Codes (Director). (2021, January 17). Getting Started with Spotify API (Complete Overview). https://www.youtube.com/watch?v=c5sWvP9h3s8
Kevin Powell (Director). (2022, July 6). Build a responsive website with HTML & CSS | Part one: Analyzing the project and setting the stage. https://www.youtube.com/watch?v=h3bTwCqX4ns
Maker At Play Coding (Director). (2021, February 1). How to Authenticate and use Spotify Web API. https://www.youtube.com/watch?v=1vR3m0HupGI
Material-web/button at main · material-components/material-web. (n.d.). GitHub. Retrieved June 6, 2023, from https://github.com/material-components/material-web
Modals Will Never Be The Same—HTML dialog Element. (n.d.). Retrieved June 6, 2023, from https://blog.webdevsimplified.com/2023-04/html-dialog/
README-template.md/README.md at master · scottydocs/README-template.md · GitHub. (n.d.). Retrieved June 6, 2023, from https://github.com/scottydocs/README-template.md/blob/master/README.md?plain=1
replit. (n.d.). How To Create Interactive Star Ratings. Replit. Retrieved June 6, 2023, from https://replit.com/@DECO2017/How-To-Create-Interactive-Star-Ratings#index.html
Spotify Web API Examples. (2023). [HTML]. Spotify. https://github.com/spotify/web-api-examples (Original work published 2014)
Star Vector SVG Icon (25). (n.d.). SVG Repo. Retrieved June 6, 2023, from https://www.svgrepo.com/svg/13695/star
Web API Reference | Spotify for Developers. (n.d.-a). Retrieved June 6, 2023, from https://developer.spotify.com/documentation/web-api/reference/get-several-audio-features
Web API Reference | Spotify for Developers. (n.d.-b). Retrieved June 6, 2023, from https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
Web Dev Simplified (Director). (2023, May 3). The New dialog HTML Element Changes Modals Forever. https://www.youtube.com/watch?v=ywtkJkxJsdg