import React, {Component} from 'react';
import {Paper, Typography} from '@material-ui/core';

class Scoreboard extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const styles = {
            paper: {
                height: 60,
                width: "auto"
            }
        }

        return (
            <Paper style = {styles.paper}>
                <Typography style = {{textAlign: "left"}}>
                    {this.props.username}
                </Typography>
                <Typography style = {{textAlign: "right"}}>
                    {this.props.score}
                </Typography>
            </Paper>
        )
    }
}

export default Scoreboard;