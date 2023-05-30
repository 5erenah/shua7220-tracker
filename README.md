# shua7220-tracker

Development Process
taken from https://github.com/scottydocs/README-template.md

Project name is a <utility/tool/feature> that allows <insert_target_audience> to do <action/task_it_does>.

ui and design pro
run using NPM start 

- Exploring options of how to incorportate the spotify API and deep research into learning about the OAUTH 2.0 authentication methods 
- Reading Spotify for developers information package
- Created own Spotfify app as part of their API implementation guide
- Back and forth debate about selecting the correct grant type (or flow) to request and get an access token
- Chose to use the 'authorization code flow' as it is suitable for long-running applications and enables retrieval of user's personalised data which is integral to the input of my data model
- selecting 'scopes' (https://developer.spotify.com/documentation/web-api/concepts/scopes) of information which I will be requesting access from the user I have chosen these 3 scopes 
1. user-read-email
2. user-read-playback-state (Read access to a user’s player state.)
3. user-top-read (Read access to a user's top artists and tracks)
- Found greater clarity on the OAuth 2.0 framework, (https://datatracker.ietf.org/doc/html/rfc6749#section-1.3) as authentication error kept reoccuring
- fixed small errors until data was display from API as expected
