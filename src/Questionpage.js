import React, { Component } from 'react';
import axios from 'axios';
import {base_url} from './APIENDPOINT';
import { Paper, Container, Typography, TextField, Button } from '@material-ui/core';

const url_list = document.location.href.split("/");

class FormField extends React.Component {
    render() {
        return <div>
            <TextField
                variant="outlined"
                margin="normal"
                required
                label={this.props.label}
                id={this.props.id}
                autoFocus
                onChange={this.props.onChange}
                style={{ width: "100%", marginLeft: "0%" }}
            />
            <br />
            {this.props.subtext}
            <br />
            <br />
        </div>
    }
}


class Questionpage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: url_list[url_list.length - 2],
            questionBody: '',
            answerBody: '',
            category: '',
            publicity: '',
            packet: ''
        }
    }

    setQuestionValue = input => event => {
        this.setState({ [input]: event.target.value })
    }

    createQuestion = (e) => {
        e.preventDefault();

        const questionBody = this.state.questionBody;
        const answer = this.state.answerBody;
        const difficulty = 5;
        const category = this.state.category;
        const publicity = this.state.publicity;
        const packetName = this.state.packet;

        axios.post(base_url + 'createQuestion', { 'questionBody': questionBody, 'answer': answer, 'difficulty': difficulty, 'category': category, 'publicity': publicity, 'username': this.state.username, 'packetName': packetName }).then((res) => {
            if (res.status) {window.location.reload()}
        });
    }

    render() {
        return (
            <div>
                <Container component="main" maxWidth="lg" style={{ paddingTop: "11%" }}>
                    <Paper style={{ backgroundColor: "white", display: "flex", flexDirection: "column", alignItems: "center" }} elevation={24}>
                        <Typography style={{ paddingTop: "5%", marginBottom: "2%" }} component="h1" variant="h5">
                            Upload a Question
                            </Typography>
                        <form>
                            <FormField
                                label="Question"
                                id="questionbody"
                                onChange={this.setQuestionValue("questionBody")}
                            />
                            <FormField
                                label="Answer"
                                id="answer"
                                onChange={this.setQuestionValue("answerBody")}
                                subtext='Use format: "Acceptable: answer1, answer2, answer3, answer4 Promt On: promtable1, promtable2 Unacceptable: wrong"'
                            />
                            <FormField
                                label="Category"
                                id="category"
                                onChange={this.setQuestionValue("category")}
                            />
                            <FormField
                                label="Publicity"
                                id="publicity"
                                onChange={this.setQuestionValue("publicity")}
                            />
                            <FormField
                                label="Packet Name"
                                id="packetName"
                                onChange={this.setQuestionValue("packet")}
                            />
                            <Button
                                onClick={this.createQuestion}
                                type="submit"
                                fullWidth
                                variant="contained"
                                style={{ width: "80%", marginLeft: "10%", marginTop: "3%", marginBottom: "5%" }}
                            >
                                Submit Question
                                </Button>
                        </form>
                    </Paper>
                </Container>
            </div>
        )
    }
}

export default Questionpage;