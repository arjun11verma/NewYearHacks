import React, {Component} from 'react';
import {Paper, Typography, Grid} from '@material-ui/core';

class Scoreboard extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const styles = {
            paper: {
                width: "auto"
            }
        }

        return (
            <Paper style = {styles.paper}>
                <Grid container direction = "row" alignItems = "center">
                    <Grid item xs = {11} alignContent = "center">
                        <Typography style = {{textAlign: "left", fontFamily: "Comic Sans MS"}}>
                            {this.props.username}
                        </Typography>
                    </Grid>
                    <Grid item xs = {1} alignContent = "center">
                        <Typography style = {{textAlign: "right", fontFamily: "Comic Sans MS"}}>
                            {this.props.score}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        )
    }
}

export default Scoreboard;