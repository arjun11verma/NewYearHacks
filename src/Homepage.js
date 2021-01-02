import React, {Component} from 'react';
import Appbar from "./Appbar";
import {Grid, Paper} from '@material-ui/core';

class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {

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
                backgroundColor: "#FFC9C9",
            }
        }
        return (
            <div>
                <Appbar/>
                <h1 style= {{marginLeft: 300, fontFamily: "Comic Sans MS"}}>Recent Sets</h1>
                <Grid style = {{marginLeft: 300}} container spacing={3}>
                    
                <Grid container spacing ={3} direction="row"> 
                        <Grid item xs={3}>
                            <Paper elevation={3} style={styles.paper}/>
                        </Grid>

                        <Grid item xs={3}>
                            <Paper elevation={3} style={styles.paper}/>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3} direction="row"> 
                        <Grid item xs={3}>
                            <Paper elevation={3} style={styles.paper}/>
                        </Grid>

                        <Grid item xs={3}>
                            <Paper elevation={3} style={styles.paper}/>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default Homepage;