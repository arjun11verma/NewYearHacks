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
        }
    }

    addToQuestion = () => {
        var questionFromDB, nextWord, count = 0;
        axios.post(base_url + '/api/getQuestions', {'user': false, questionID: 73}).then((res) => {
            console.log(res);
            questionFromDB = res.questionList.questionBody.split(" ");
            console.log(questionFromDB);
            var questionInterval = setInterval(() => {
                nextWord = questionFromDB[count];
                this.setState((prevState) => {
                    return{
                        questionText: prevState.questionText + nextWord
                    }
                });
                count++;
                if(count === questionFromDB.length) clearInterval(questionInterval);
            }, 500);
        });
    }

    componentDidMount = () => {
        this.addToQuestion();
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