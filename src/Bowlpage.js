import React, {Component} from 'react';
import {Grid, Paper, Typography, Button, Container, TextField} from '@material-ui/core/';
import axios from 'axios';
import base_url from './APIENDPOINT';




class Bowlpage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questionText: "",
            questionNums: this.range(1,99),
            qcount: 0,
            maxQuestions: 0,
            activeQuestion: ""
        }
    }

    range = (min, max) => {
        var a = [];
        for (var i = min; i <= max; i++) {
            a.push(i)
        }
        for (var j = 0; j < a.length; j++) {
            a = this.swap(a, j)
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
    

    addToQuestion = () => {
        var questionFromDB, nextWord, count = 0; //Math.floor(Math.random() * this.state.maxQuestions.length);
        axios.post(base_url + 'getQuestions', {'user': false, 'ID': this.state.questionNums[this.state.qcount]}).then((res) => {
            this.setState({
                activeQuestion: res.data.questionList[0]
            });
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
                    
                }
            }, 100);
        });
    }

    nextQuestion = () =>{
        this.setState((prevState) => {
            return{
                qcount: prevState.qcount + 1,
                questionText: ""
            }
        }, () => {
            this.addToQuestion();
        });
    }

    checkAnswer = () =>{
        const answer = document.getElementById('answerText').value;
        const answers = this.state.activeQuestion.questionanswer.split(" ");

        console.log(answer, answers);
        
        return answers.includes(answer);
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
                width: 950,
                margin: 10,
                display: 'flex',
                flexWrap: 'wrap',
            }
        }

        return (
            <div >
                <Grid container style={styles.root} >
                    <Grid item xs={8}> 
                    <Grid container direction = "row">
                        <Paper style={styles.papers} elevation={3}> 
                            <Typography>{this.state.questionText}</Typography>
                        </Paper>
                        <Container align = "center">
                            <Button variant="contained" onClick={this.nextQuestion}>Next Question</Button>
                            <Button variant="contained" onClick={this.checkAnswer}>Submit Answer</Button>
                        </Container>
                        <Container align="center">
                            <Grid item xs={4}>
                                <TextField id="answerText" label="Answer">Answer</TextField>
                            </Grid>
                        </Container>
                    </Grid>
                    </Grid>
                    <Grid item xs={4}>
                        <h1> hi right side</h1>
                    </Grid>
                    <Grid item xs={1}>

                    </Grid>

                </Grid>
            </div>
        )
    }
}

export default Bowlpage;