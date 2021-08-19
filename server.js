
// require express from nodemodules
const express = require("express");

const app = express();
//file system
const fs = require("fs");

const path = require("path");

const PORT = process.env.PORT || 3001;
//generate unique id
const uuid = require('./helpers/uuid');

// middleware
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(express.static("public"));

// get index.html on default

app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, '/public/index.html'))
})
// load note.html when this route is being called
app.get('/notes', (req, res) => {

    res.sendFile(path.join(__dirname, '/public/notes.html'))
})

// api to get notes
app.get('/api/notes', (req, res) => {
    let noteTitle;
    //JSON.parse(fs.readFileSync('./db/db.json','utf-8'));
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            noteTitle = JSON.parse(data);
            res.json(noteTitle);
        }
    });

})

// api to post notes to db.json
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a review`);
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
    // If all the required properties are present
    if (title && text) {
        // Variable for the object we will save
        const newNote = {
            title,
            text,
            id: uuid()
        };
        // read the json file and append 
        readAndAppend(newNote, "./db/db.json")
        res.json('Note added sucessfully');
    }
    else {
        res.error('Error in adding note')
    }

});
// function read the json file and append 
const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedData = JSON.parse(data);
            parsedData.push(content);
            writeToFile(file, parsedData);
        }
    });
};

//function to write to a file
const writeToFile = (destination, content) =>
    fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
        err ? console.error(err) : console.info(`\nData written to ${destination}`)
    );

//Delete a particular note
app.delete('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    console.log("id" + id)
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {

            const parsedNote = JSON.parse(data);
            const note = parsedNote.find(notes => notes.id === (id));
            console.log("note: " + JSON.stringify(note))
            if (!note) console.error(err);
            else {

                let index = parsedNote.indexOf(note);
                console.log('index:' + index)
                parsedNote.splice(index, 1);
                console.log(JSON.stringify(parsedNote))
                writeToFile('./db/db.json', parsedNote)
                res.json("Deleted note")
            }
        }
    });

});
// to listen to the port
app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);


