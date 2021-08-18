const express = require("express");

const app = express();

 const path = require("path");
 
const PORT = process.env.PORT || 3001;

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
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
