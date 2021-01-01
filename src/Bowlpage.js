import React, {Component} from 'react';
import {Grid, Paper, Typography} from '@material-ui/core/';
import axios from 'axios';
import base_url from './APIENDPOINT';
import { red } from '@material-ui/core/colors';

class Bowlpage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questionText: "",
            maxQuestions: []
        }
    }

    addToQuestion = () => {
        var questionFromDB, nextWord, count = 0, questionNum = this.state.maxQuestions[Math.floor(Math.random() * this.state.maxQuestions.length)];
        axios.post(base_url + 'getQuestions', {'user': false, 'ID': questionNum}).then((res) => {
            questionFromDB = res.data.questionList[0].questionbody.split(" ");
            console.log(questionFromDB);
            var questionInterval = setInterval(() => {
                nextWord = questionFromDB[count];
                this.setState((prevState) => {
                    return{
                        questionText: prevState.questionText + nextWord + " "
                    }
                });
                count++;
                if(count === questionFromDB.length) {
                    clearInterval(questionInterval);
                    this.setState((prevState) => {
                        return{
                            maxQuestions: prevState.maxQuestions.splice(questionNum, 1)
                        }
                    });
                }
            }, 100);
        });
    }

    getRandomNumber = () => {

    }

    componentDidMount = () => {
        var maxQuestions = [];
        for(var i = 1; i < 100; i++) {maxQuestions.push(i);}
        this.setState({
            maxQuestions: maxQuestions
        }, () => {
            this.addToQuestion();
        });
    }

    render() {

        const styles = {
            root: {

            },
            papers: {
                backgroundColor: "whitesmoke",
                height: 350,
                width: 'auto',
                margin: 10,
                display: 'flex',
                flexWrap: 'wrap',
            }
        }

        return (
            <div >
                <Grid container className={styles.root} >
                    <Grid item xs={8}> 
                        <Paper style={styles.papers} elevation={3}> 
                            <Typography>{this.state.questionText}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={4}>
                        <h1> hi right side</h1>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default Bowlpage;