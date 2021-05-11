# RecFilmsServer
HTTP Server for RecFilms to handle the add/remove from database functions as well as serving the list webpage.

Requires Pugjs

## Usage
Add a .env or environment variable with key 'DBURI' and value 'your-mongodb-driver'.
To customize list result page, edit the .pug file and style.css in the views folder. Be sure not to change the 'movies' variable
