import React, { Component } from 'react';
import Appbar from './Appbar';
import {Container, Paper, Typography, Button} from '@material-ui/core';
import axios from 'axios';
import {base_url} from './APIENDPOINT.js';
import {Link} from 'react-router-dom';

const location = window.location.href.split("/");

class Yoursetspage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sets: [],
            username: location[location.length - 2]
        }
    }

    componentDidMount() {
        axios.post(base_url + 'getSets', {'username': this.state.username}).then((res) => {
            console.log(res.data);
            if(res.data.status && res.data.packetList.length) {
                this.setState({
                    sets: res.data.packetList.map((packet) => { return <Paper style = {{margin: 10}}> <Typography variant = "h4" style = {{textAlign: "center", fontFamily: "Comic Sans MS"}}>{packet.packetName}</Typography> </Paper> })
                });
            }
        });
    }

    addQuestionClick() {

    }

    render() {
        return (
            <div>
                <Appbar/>
                
                <Container style = {{align: "center"}}>
                    <Paper style = {{height: "90vh"}}>
                        <Typography variant = "h2" style = {{textAlign: "center", fontFamily: "Comic Sans MS"}}>
                            Welcome to your sets!
                        </Typography>
                        <br/>
                        <Container align = "center" style = {{align: "center"}}>
                            <Paper style = {{overflowY: "scroll", height: "60vh"}}>
                                {this.state.sets}
                            </Paper>

                            <br/>

                            <Button component={Link} to ="./Questionpage" style = {{textAlign: "center", fontFamily: "Comic Sans MS"}}>
                                Add a new question! 
                            </Button>
                        </Container>
                    </Paper>
                </Container>
            </div>
        )
    }
}

export default Yoursetspage;
