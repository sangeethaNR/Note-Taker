const express = require("express");

const app = express();
const fs = require("fs")
 const path = require("path");

const PORT = process.env.PORT || 3001;
const uuid = require('./helpers/uuid');
// middleware 

app.use(express.urlencoded({extended : true}));

app.use(express.json());

app.use(express.static("public"));

// get index.html on default

app.get('/',(req,res) =>{

    res.sendFile(path.join(__dirname, '/public/index.html'))
})

app.get('/notes',(req,res) =>{

    res.sendFile(path.join(__dirname, '/public/notes.html'))
})

app.get('/api/notes',(req,res) => {
let noteTitle  = JSON.parse(fs.readFileSync('./db/db.json','utf-8'));
res.json(noteTitle);
})

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a review`);
      // Destructuring assignment for the items in req.body
  const { title, text } = req.body;
// If all the required properties are present
if (title && text ) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
   note_id: uuid()
    };

readAndAppend(newNote,"./db/db.json")
res.json('Note added sucessfully');
}
else{
    res.error('Error in adding note')
}
 
});

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
  const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);


