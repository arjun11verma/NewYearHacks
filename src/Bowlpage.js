import React, { Component } from 'react';
import { Grid, Paper, Typography, Button, Container, TextField } from '@material-ui/core/';
import axios from 'axios';
import { base_url, socket_url } from './APIENDPOINT';
import socketIOClient from 'socket.io-client';
import Appbar from './Appbar';
import levenshtein from 'js-levenshtein';
import Scoreboard from './Scoreboard';

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
            currentUsers: []
        }
    }

    renderUserList = (entries) => {
        return entries.map((entry) => {
            return <Scoreboard username = {entry[0]} score = {entry[1]}></Scoreboard>
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
            }, 100);
            this.setState({
                activeInterval: questionInterval
            });
        }
    }

    nextQuestion = () => {
        this.setState({
            questionText: ""
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

    parseAnswer = (answer) => {
        const d = "arjunvermaarjun";
        const accept = answer.replace(";", d).replace("[", d).replace("]", d).replace("or", d).replace("OR", d).replace(",", d).split(d);
        return accept
    }

    checkAnswer = () => {
        const answer = document.getElementById('answerText').value;
        const answers = this.parseAnswer(this.state.activeQuestion.questionanswer);
        var correct = false;

        answers.forEach((potentialAnswer) => {
            if(levenshtein(potentialAnswer, answer) < answer.length/3) {
                correct = true;
            }
        });

        return correct;
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
                this.setState((prevState) => {
                    return {
                        currentUsers: prevState.currentUsers.set(data.username, prevState.currentUsers.get(data.username) + 10)
                    }
                });
                this.nextQuestion();
            } else {
                this.setState({
                    paused: false
                });
            }
        });

        console.log(socket);
    }

    render() { // owenier
        const styles = {
            root: {

            },
            papers: {
                backgroundColor: "whitesmoke",
                height: 350,
                width: 950,
                margin: 10,
                display: 'flex',
                flexWrap: 'wrap',
            }
        }

        return (
            <div >
                <Appbar/>
                <Grid container style={styles.root} >
                    <Grid item xs={8}>
                        <Grid container direction="row">
                            <Paper style={styles.papers} elevation={3}>
                                <Typography>{this.state.questionText}</Typography>
                            </Paper>
                            <Container align="center">
                                <Button variant="contained" onClick={this.nextQuestion}>Next Question</Button>
                                <Button variant="contained" onClick={this.buzzIn}>Submit Answer</Button>
                            </Container>
                            <Container align="center">
                                <Grid item xs={4}>
                                    <TextField id="answerText" label="Answer">Answer</TextField>
                                </Grid>
                            </Container>
                        </Grid>
                    </Grid>
                    <Grid item xs={4}>
                        {this.renderUserList(this.state.currentUsers)}
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default Bowlpage;