import React, {Component} from 'react';
import Appbar from "./Appbar";
import {Grid, Paper, Typography} from '@material-ui/core';
import {base_url} from './APIENDPOINT';
import axios from 'axios';

const url_list = document.location.href.split("/");

class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: url_list[url_list.length - 1],
            sets: []
        }
    }

    getSets() {
        if(this.state.username === "") {
            this.setState({
                username: url_list[url_list.length - 2]
            }, () => {
                axios.post(base_url + 'getSets', {'username': this.state.username}).then((res) => {
                    console.log(res.data.packetList);
                    if(res.data.status && res.data.packetList.length) {
                        this.setState({
                            sets: res.data.packetList.map((packet) => {return packet.packetName})
                        });
                    }
                    console.log(this.state.sets);
                });
            });
        }
    }

    componentDidMount = () => {
        this.getSets();
    }

    getRecent(i) {
        if(this.state.sets[this.state.sets.length-i]){
            return this.state.sets[this.state.sets.length-i]
        }
        else {
            return "Create New Set"
        }
    }

    getActiveRooms = () => {
        
    }

    goToQuestionpage = () => {
        window.location.href = "./Questionpage";
    }

    goToBowlpage = () => {
        window.location.href = "./Bowlpage";
    }

    render() {
        const styles = {
            paper: {
                width: 250,
                height: 150,
                margin: 5,
                display:'flex',
                flexDirection:"column",
                justifyContent:"center",
                backgroundColor: "#FFC9C9",
            },
            setText: {
                fontFamily: "Comic Sans MS", 
                fontSize:"250%",
                textAlign:"center",
                verticalAlign: "middle",
            }
        }
        return (
            <div>
                <Appbar/>
                <h1 style= {{marginLeft: 300, fontFamily: "Comic Sans MS"}}>Recent Sets</h1>
                <Grid style = {{marginLeft: 300}} container spacing={3}>
                    <Grid container spacing ={3} direction="row"> 
                        <Grid item xs={3}>
                            <Paper elevation={3} style={styles.paper}>
                                <Typography style={ styles.setText }>
                                    {this.getRecent(1)}
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={3}>
                            <Paper elevation={3} style={styles.paper}>
                                <Typography style={ styles.setText }>
                                    {this.getRecent(2)}
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3} direction="row"> 
                        <Grid item xs={3}>
                            <Paper elevation={3} style={styles.paper}>
                                <Typography style={ styles.setText }>
                                    {this.getRecent(3)}
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={3}>
                            <Paper elevation={3} style={styles.paper}>
                                <Typography style={ styles.setText }>
                                    {this.getRecent(4)}
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default Homepage;