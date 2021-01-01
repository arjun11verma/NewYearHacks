const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const database = require('./Database');

const app = express();
app.use(cors());
app.use(bodyparser.json());

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const PORT = 3001;

var rooms = new Map();

const formatValues = (values) => {
    var returnString = "(";
    for (var i = 0; i < values.length - 1; i++) {
        returnString += "'" + values[i] + "', ";
    }
    return returnString + "'" + values[values.length - 1] + "')";
}

app.post('/api/loginUser', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    database.query("SELECT * FROM Users WHERE username = '" + username + "' AND password = '" + password + "'", (error, results, fields) => {
        if (error) res.send({ 'status': false });
        else res.send({ 'status': results.length });
    });
});

app.post('/api/createAccount', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;

    database.query("INSERT INTO Users (username, password, email) VALUES " + formatValues([username, password, email]), (error, results, fields) => {
        if (error) res.send({ 'status': false });
        else res.send({ 'status': true });
    });
});

app.post('/api/createQuestion', (req, res) => {
    const body = req.body;
    database.query("INSERT INTO Userquestions (questionbody, questionanswer, difficulty, username, packetName, category, Publicity) VALUES " + formatValues([body.questionBody, body.answer, body.difficulty, body.username, body.packetName, body.category, body.publicity]), (error, results, fields) => {
        if(error) res.send({'status': true});
        else res.send({'status': false});
    });
});

app.post('/api/getQuestions', (req, res) => {
    const body = req.body;
    if(body.user) {
        database.query("SELECT * FROM Userquestions WHERE username IN " + body.userList, (error, results, fields) => {
            if(error || !results) res.send({'questionList': null});
            else res.send({'questionList': results});
        });
    } else {
        database.query("SELECT * FROM Publicquestions", (error, results, fields) => {
            if(error) res.send({'questionsList': null});
            else res.send({'questionList': results});
        });
    }
});

app.get('/api/userQuestionOptions', (req, res) => {
    database.query("SELECT username FROM Userquestions WHERE Publicity = 1", (error, results, fields) => {
        if(error || !results) res.send({'userList': null});
        else res.send({'userList': results});
    });
});

app.get('/api/getNewRooms', (req, res) => {
    res.send({'roomList': rooms.keys});
});

io.on('connection', (socket) => {
    socket.on('newUser', (data) => {
        if(rooms.has(data.roomName)) rooms.set(data.roomName, rooms.get(data.roomName).push(data.user));
        else {
            rooms.set(data.roomName, [data.user]);
            socket.emit('newRoom', rooms.keys);
        }
    });

    socket.on('buzzIn', (data) => {
        
    });
});

server.listen(PORT, () => {
    console.log("Listening on port " + PORT);
});