import React, { Component } from 'react';
import { Grid, Paper, Typography, Button, Container, TextField, CardActionArea } from '@material-ui/core/';
import { base_url, socket_url } from './APIENDPOINT';
import socketIOClient from 'socket.io-client';
import Appbar from './Appbar';
import levenshtein from 'js-levenshtein';
import Scoreboard from './Scoreboard';
import axios from 'axios';

const url_list = document.location.href.split("/");
var socket;

class Bowlpage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questionText: "",
            qcount: 0,
            maxQuestions: 0,
            activeQuestion: "",
            username: url_list[url_list.length - 2],
            activeInterval: null,
            paused: false,
            buzzed: false,
            currentUsers: [],
            userPackets: [],
            showedAnswer: "Answer:",
            showedPrompt: "",
            userPacketNames: [],
        }
    }

    renderUserList = (entries) => {
        return entries.map((entry) => {
            if(entry[0]) return <Scoreboard username = {entry[0]} score = {entry[1]}></Scoreboard>
        });
    }

    addToQuestion = (data) => {
        if(!this.state.paused) {
            var questionFromDB, nextWord, count = 0;
            this.setState({
                activeQuestion: data.questionList[0]
            });
            questionFromDB = data.questionList[0].questionbody.split(" ");
            console.log(questionFromDB);
            var questionInterval = setInterval(() => {
                nextWord = questionFromDB[count];
                this.setState((prevState) => {
                    return {
                        questionText: prevState.questionText + nextWord + " "
                    }
                });
                count++;
                if (count === questionFromDB.length) {
                    clearInterval(questionInterval);
                }
            }, 120);
            this.setState({
                activeInterval: questionInterval
            });
        }
    }

    nextQuestion = () => {
        this.setState({
            questionText: "",
            showedAnswer: "Answer: ",
            showedPrompt: "",
        }, () => {
            socket.emit('newQuestion', {'user': false});
        });
    }

    buzzIn = () => {
        if(!this.state.buzzed) {
            this.setState({
                buzzed: false
            });
            socket.emit('buzzIn', {'correct': this.checkAnswer(), 'user': this.state.username});
        }
    }

    removeParentheses = (string) => {
        if (string.includes("(")) {
            var startI = 0, pCount = 0, removeSub = []
            for(var i = 0; i < string.length; i++) {
                if (string.charAt(i) ===  "(") {
                    if (pCount === 0) {
                        startI = i
                    }
                    pCount ++;
                } else if (string.charAt(i) === ")") {
                    pCount --;
                    if (pCount === 0) {
                        removeSub.push([startI, i])
                    }
                }
            }
            for (var j = removeSub.length - 1; j >= 0; j--) {
                string = string.substr(0, removeSub[j][0]) + " " + string.substr(removeSub[j][1] + 1, string.length)
            }
        }
        return string
    }

    parseAnswer = (answer) => {
        
        var setting = "A: "
        var d = "QQQQQQQQ"
        var myAns = this.removeParentheses(answer).replace(/[\s[]or\s/gi, d).replace(/\slike\s/gi).replace("[", d).replace(/;/g,d).replace("]", d).replace(/,/g, d).split(d).filter(function (el) {
            return el !== null && el !== undefined && el !== ''
        }).map((parsedAnswer) => {
            parsedAnswer = parsedAnswer.trim()
            if (parsedAnswer.includes(' ')) {
                var cutOff = 0
                if (parsedAnswer.search(/accept\s/gi) !== -1) {
                    setting = "A: ";
                    cutOff = parsedAnswer.search(/accept\s/gi) + 7
                } else if (parsedAnswer.search(/prompt\son\s/gi) !== -1) {
                    setting = "P: ";
                    cutOff = parsedAnswer.search(/prompt\son\s/gi) + 10
                } else if (parsedAnswer.search(/prompt\s/gi) !== -1) {
                    setting = "P: ";
                    cutOff = parsedAnswer.search(/prompt\s/gi) + 7
                    
                }
                parsedAnswer = parsedAnswer.substr(cutOff, parsedAnswer.length);
                cutOff = 0
                var variationsI = parsedAnswer.search(/such\sas/gi)
                if (variationsI !== -1) {
                    cutOff = variationsI + 7
                }
                parsedAnswer = parsedAnswer.substr(cutOff, parsedAnswer.length);
                cutOff = 0
                variationsI = parsedAnswer.search(/that\sindicate/gi);
                if (variationsI !== -1) {
                    cutOff = variationsI + 13
                }
                parsedAnswer = parsedAnswer.substr(cutOff, parsedAnswer.length);
            }
            if (parsedAnswer === " " || parsedAnswer === "") {
                return null
            }
            return setting + parsedAnswer;
        }).filter(function (el) {
            return el !== null
        });

        return myAns;
    }


    checkAnswer = () => {
        const answer = document.getElementById('answerText').value;
        const answers = this.parseAnswer(this.state.activeQuestion.questionanswer);
        var correct = false;

        answers.forEach((potentialAnswer) => {
            if(potentialAnswer.substr(0, 2) === "A:") {
                if(levenshtein(potentialAnswer.substr(2, potentialAnswer.length).trim(), answer) < (answer.length/3 < 2 ? 2 : answer.length/3)) correct = true;
            } else {

            }
        });

        return correct;
    }

    queryUserQuestions = () => {
        socket.emit('userQuestions', {'userList': this.state.userPacketNames});
    }

    showAnswer = () => {
        var ansStr = "Answer: " + this.parseAnswer(this.state.activeQuestion.questionanswer).map((e) => {
            if (e.match(/^P/)) {
                return ""
            }
            return " " + e;
        });
        var proStr = "Prompt: " + this.parseAnswer(this.state.activeQuestion.questionanswer).map((e) => {
            if (e.match(/^P/)) {
                return " " + e
            }
            return ""
        });
        this.setState({
            showedAnswer: ansStr,
            showedPrompt: proStr
        })
    }

    componentDidMount = () => {
        socket = socketIOClient(socket_url);
        socket.emit('newUser', {username: this.state.username});

        socket.on('youJoined', (data) => {
            console.log(data);
            this.setState({
                currentUsers: data.currentUsers
            });
        });

        socket.on('newQuestion', (data) => {
            this.setState({
                questionText: ""
            }, () => {
                clearInterval(this.state.activeInterval);
                this.addToQuestion(data);
            });
        });

        socket.on('buzzResponse', (data) => {
            if(data.correct) {
                console.log(data.username);
                var currentUsers = this.state.currentUsers;
                currentUsers.forEach((user) => {
                    if(user[0] === data.username) user[1] += 10;
                });
                this.setState({
                    currentUsers: currentUsers
                });
                this.nextQuestion();
            } else {
                var currentUsers = this.state.currentUsers;
                currentUsers.forEach((user) => {
                    if(user[0] === data.username) user[1] -= 5;
                });
                this.setState({
                    currentUsers: currentUsers,
                    paused: false
                });
            }
        });

        axios.post(base_url + 'getPublicSets', {'publicity': true}).then((res) => {
            if(res.data.packetList.length) {
                var packets = res.data.packetList, addingPackets = [];
                packets.forEach((packet) => {
                    if(!addingPackets.includes(packet.packetName)) addingPackets.push(packet.packetName);
                });

                this.setState({
                    userPackets: addingPackets.map((packet) => { if(true) return <Paper style = {{margin: 10}}> <CardActionArea onClick = {this.queryUserQuestions}> <Typography style = {{textAlign: "center", fontFamily: "Comic Sans MS"}}>{packet}</Typography> </CardActionArea> </Paper> }),
                    userPacketNames: addingPackets
                });
            }
            console.log(this.state.userPackets);
        });

        console.log(socket);
    }

    render() { // owenier
        const styles = {
            root: {

            },
            papers: {
                backgroundColor: "whitesmoke",
                height: 500,
                width: 950,
                margin: 10,
                display: 'flex',
                flexWrap: 'wrap',
            }
        }

        return (
            <div >
                <Grid container style={styles.root} >
                    <Grid item xs={7}>
                        <Grid container direction="row">
                            <Paper style={styles.papers} elevation={3}>
                                <Typography style = {{margin: 10, fontFamily: "Comic Sans MS"}}>
                                    {this.state.questionText}
                                </Typography>
                            </Paper>
                            <Paper style={{width:835, height:80, marginLeft:10, marginBottom:30, backgroundColor: "whitesmoke"}}>
                                <Typography style={{margin: 10, fontFamily: "Comic Sans MS", textAlign: "center"}}>
                                    {this.state.showedAnswer}
                                    <br/>
                                    {this.state.showedPrompt}
                                </Typography>
                            </Paper>
                            <Container align="center">
                                <Button variant="contained" onClick={this.nextQuestion}>Next Question</Button>
                                <Button variant="contained" onClick={this.buzzIn}>Submit Answer</Button>
                                <Button variant="contained" onClick={this.showAnswer}>Show Answer</Button>
                            </Container>
                            <Container align="center">
                                <Grid item xs={4}>
                                    <TextField id="answerText" label="Answer">Answer</TextField>
                                </Grid>
                            </Container>
                        </Grid>
                    </Grid>
                    <Grid item xs={5}>
                        <Paper style = {{overflowY: "scroll", height: 340}}>
                            <Typography variant = "h6" style = {{fontFamily: "Comic Sans MS", textAlign: "center"}}>Current Players</Typography>
                            {this.renderUserList(this.state.currentUsers)}
                        </Paper>
                        <Paper style = {{overflowY: "scroll", height: 340}}>
                            <Typography variant = "h6" style = {{fontFamily: "Comic Sans MS", textAlign: "center"}}>Available Sets</Typography>
                            {this.state.userPackets}
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default Bowlpage;