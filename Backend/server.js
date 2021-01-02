const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const database = require('./Database');

const app = express();
app.use(cors());
app.use(bodyparser.json());

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
});

const PORT = 3001;

const formatValues = (values) => {
    var returnString = "(";
    for (var i = 0; i < values.length - 1; i++) {
        if(Number.isInteger(values[i])) {
            returnString += values[i] + ", ";
        }
        else {
            returnString += "'" + values[i].replace("'", " ") + "', ";
        }
    }
    if(Number.isInteger(values[values.length - 1]) || parseInt(values[values.length - 1]) !== null) return returnString + values[values.length - 1] + ")";
    else return returnString + "'" + values[values.length - 1] + "')";
}

app.post('/api/loginUser', (req, res) => {
    console.log(req.body);

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
    console.log("INSERT INTO Userquestions (questionbody, questionanswer, difficulty, username, packetName, category, Publicity) VALUES " + formatValues([body.questionBody, body.answer, body.difficulty, body.username, body.packetName, body.category, body.publicity]));
    database.query("INSERT INTO Userquestions (questionbody, questionanswer, difficulty, username, packetName, category, Publicity) VALUES " + formatValues([body.questionBody, body.answer, body.difficulty, body.username, body.packetName, body.category, body.publicity]), (error, results, fields) => {
        console.log(error, results);
        
        if(error) res.send({'status': false});
        else res.send({'status': true});
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
        console.log("SELECT * FROM Publicquestions WHERE questionID = " + body.ID);
        database.query("SELECT * FROM Publicquestions WHERE questionID = " + body.ID, (error, results, fields) => {
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

range = (min, max) => {
    var a = [];
    for (var i = min; i <= max; i++) {
        a.push(i)
    }
    for (var j = 0; j < a.length; j++) {
        a = swap(a, j)
    }
    return a;
}

swap = (arr, i) => {
    var temp = arr[i];
    var ri = Math.floor(Math.random() *arr.length);
    arr[i] = arr[ri];
    arr[ri] = temp;
    return arr;
}

var questionNums = range(1, 99);
var qcount = 0;
var users = new Map();

io.on('connection', (socket) => {
    socket.on('newUser', (data) => {
        if(!users.has(data.username)) users.set(data.username, 0);
        io.emit('youJoined', {'currentUsers': Array.from(users.entries())});
    });

    socket.on('newQuestion', (data) => {
        var questionData;
        if(data.user) {
            database.query("SELECT * FROM Userquestions WHERE username IN " + data.userList, (error, results, fields) => {
                if(!error) questionData = results;
                
                io.emit('newQuestion', {'questionList': questionData});
            });
        } else {
            database.query("SELECT * FROM Publicquestions WHERE questionID = " + questionNums[qcount], (error, results, fields) => {
                if(!error) questionData = results;
                qcount++;

                io.emit('newQuestion', {'questionList': questionData});
            });
        }
    });

    socket.on('buzzIn', (data) => {
        if(data.correct) users.set(data.username, users.get(data.username) + 10);
        io.emit('buzzResponse', {'correct': data.correct, 'username': data.user});
    });
});

server.listen(PORT, () => {
    console.log("Listening on port " + PORT);
});