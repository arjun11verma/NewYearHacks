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

const PORT = 8080;

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
    if(!Number.isNaN(parseInt(values[values.length - 1]))) return returnString + parseInt(values[values.length - 1]) + ")";
    else {
        console.log(returnString + "'" + values[values.length - 1] + "')");
        return returnString + "'" + values[values.length - 1] + "')";
    }
}

app.post('/api/loginUser', (req, res) => {
    console.log(req.body);

    const username = req.body.username;
    const password = req.body.password;

    database.query("SELECT * FROM Users WHERE username = '" + username + "' AND password = '" + password + "'", (error, results, fields) => {
        console.log(results);
        if (error) res.send({ 'status': false });
        else res.send({ 'status': results.length });
    });
});

app.post('/api/createAccount', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;

    database.query("INSERT INTO Users (username, password, email) VALUES " + "('" + username + "', '" +  password + "', '" + email + "')", (error, results, fields) => {
        console.log(error);
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

app.post('/api/getSets', (req, res) => {
    const body = req.body;

    database.query("SELECT packetName FROM Userquestions WHERE username = '" + body.username + "'", (error, results, fields) => {
        console.log(results);
        if(error) res.send({'status': false});
        else res.send({'status': true, 'packetList': results});
    });
});

app.post('/api/getPublicSets', (req, res) => {
    database.query("SELECT packetName FROM Userquestions WHERE Publicity = 1", (error, results, fields) => {
        if(error) res.send({'packetList': null});
        else res.send({'packetList': results});
    })
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
var userQuestionList = [];

io.on('connection', (socket) => {
    socket.on('newUser', (data) => {
        if(!users.has(data.username)) users.set(data.username, 0);
        io.emit('youJoined', {'currentUsers': Array.from(users.entries())});
    });

    socket.on('userQuestions', (data) => {
        userQuestionList = (data.userList);
        console.log(userQuestionList);
    });

    socket.on('newQuestion', (data) => {
        var questionData;
        if(userQuestionList.length) {
            database.query("SELECT * FROM Userquestions WHERE packetName IN " + formatValues(userQuestionList) + " ORDER BY RAND() LIMIT 1", (error, results, fields) => {
                if(!error) questionData = results;
                console.log(error, results, userQuestionList);
                io.emit('newQuestion', {'questionList': questionData});
                userQuestionList.splice(0, 1);
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
        if(data.correct) users.set(data.user, users.get(data.user) + 10);
        else users.set(data.user, users.get(data.user) - 5);
        io.emit('buzzResponse', {'correct': data.correct, 'username': data.user});
    });
});

server.listen(PORT, () => {
    console.log("Listening on port " + PORT);
});