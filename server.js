const { MongoClient } = require("mongodb");
require('dotenv').config();
const URI = process.env.DBURI;
const express = require('express');
const cors = require('cors');
const path = require('path');

let app = express();
app.set('view engine', 'pug')

// when receiving id and movie form server, adds movie to corresponding list in database
app.get('/add', cors(), async function(req, res) {
    let id = req.query.id;
    let movieData = req.query.movie;
    let movieObj = JSON.parse(movieData);

    const client = new MongoClient(URI);

    try {
        await client.connect();
        var db = client.db('recfilms');

        // insert new document if it is new movie list
        if (await db.collection('lists').countDocuments({id: id}) === 0) {
            var data = {
                id: id,
                movies: [movieObj]
            }
            db.collection('lists').insertOne(data, function(err, res) {
                if (err) {
                    throw err;
                } else {
                    console.log('successful addition');
                }
            });
        } else {
            var movieDoc = await db.collection('lists').findOne(
                {id: id},
                {movies: 1}
            );

            var newList = movieDoc.movies;
            newList.push(movieObj);
            await db.collection('lists').updateOne(
                { id: id },
                {
                    $set: {movies: newList}
                }
            );
            console.log(newList);
        }
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }

    res.send([id, movieData]);
});

// removes movie from corresponding list
app.get('/remove', cors(), async function(req, res) {
    let id = req.query.id;
    let movieData = req.query.movie;
    let movieObj = JSON.parse(movieData);

    const client = new MongoClient(URI);

    try {
        await client.connect();
        var db = client.db('recfilms');

        var movieDoc = await db.collection('lists').findOne(
            {id: id},
            {movies: 1}
        );

        let movieList = movieDoc.movies;
        const index = movieList.indexOf(movieObj);
        movieList.splice(index, 1);
        await db.collection('lists').updateOne(
            { id: id },
            {
                $set: {movies: movieList}
            }
        );
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }

    res.send([id]);
});

// serve webpage to show list
app.get('/lists', cors(), async function(req, res) {
    let id = req.query.id;

    const client = new MongoClient(URI);

    try {
        await client.connect();
        var db = client.db('recfilms');
        var movieDoc = await db.collection('lists').findOne(
            {id: id},
            {movies: 1}
        );

        let movieList = movieDoc.movies;
        console.log(movieList);
        res.render('list', {movies: movieList});
        //res.send(movieList);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}); 

app.listen(process.env.PORT || 3001, () => {
    console.log("server listening...");
});
