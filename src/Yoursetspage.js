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
                    sets: res.data.packetList.map((packet) => { return <Paper> {packet.packetName} </Paper> })
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
                    <Paper>
                        <Typography style = {{textAlign: "center"}}>
                            Welcome to your sets!
                        </Typography>
                        <Container align = "center" style = {{align: "center"}}>
                            {this.state.sets}

                            <Button component={Link} to ="./Questionpage" style = {{textAlign: "center"}}>
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
