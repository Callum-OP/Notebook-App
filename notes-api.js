const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Sequelize = require('sequelize');

const app = express();
const port = 3000;

const path = 'mysql://callum:password@localhost:3306/testdb';
const sequelize = new Sequelize(path, {
    operatorsAliases: false,
    logging: false
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let Note = sequelize.define('notes', {
    description: Sequelize.STRING
});

let notes;

async function findAllRows() {

    notes = await Note.findAll({ raw: true });
    console.log(notes);
}

async function deleteRow(id) {

    let n = await Note.destroy({ where: { id } });
    console.log(`number of deleted rows: ${n}`);
}

//showing all notes
app.get('/notes', (req, res) => {
    findAllRows();
        res.send(notes)
});

//add a note
app.post('/note', (req, res) => {
    const note = Note.build(req.body);
    // output the note to the console for debugging
    console.log(note);
    note.save().then(() => {
    console.log('new note saved');
    }).finally(() => {
    });

    res.send('Note added to the database');
});

//deleting a notes
app.delete('/note/:id', (req, res) => {
    // reading id from the URL
    const id = req.params.id;
    res.send(deleteRow(id))
});

app.listen(port, () => console.log(`To Do List app listening on port ${port}!`));