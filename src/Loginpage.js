import React, { Component } from 'react';
import { Grid, Paper, Container, Typography, TextField, Button, Link} from '@material-ui/core';
import axios from 'axios';
import {base_url} from './APIENDPOINT';

class Loginpage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            failedLogin: false
        }
    }

    login = (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        axios.post(base_url + 'loginUser', {'username': username, 'password': password}).then((res) => {
            if(res.data.status) window.location.href = "/Homepage/" + username;
            else this.setState({failedLogin: true});
        });
    }

    render() {
        return (
            <div class="animated-background" style={{height: "100vh"}}>
                <div>
                    <Container component="main" maxWidth="sm" style={{paddingTop: "12%"}}>
                        <Paper style={{backgroundColor: "white", display: "flex", flexDirection: "column", alignItems: "center"}} elevation={24}>
                            <Typography style={{paddingTop: "5%", marginBottom: "2%"}} component="h1" variant="h5">
                                Welcome to Potatobowl! Please Sign in
                            </Typography>
                            <form>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    label="Username"
                                    id="username"
                                    autoFocus
                                    style={{width: "80%", marginLeft: "10%"}}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    id="password"
                                    style={{width: "80%", marginLeft: "10%"}}
                                />
                                <Button
                                    onClick = {this.login}
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    style={{width: "80%", marginLeft: "10%", marginTop: "3%", marginBottom: "5%"}}
                                >
                                    Sign In
                                </Button>
                                <Grid container style={{marginBottom: "5%"}}>
                                    <Grid item xs>
                                        <Link style={{width: "80%", marginLeft: "10%", marginTop: "5%", marginBottom: "5%"}} href="/CreateAccount">
                                            {"Don't have an account? Sign up!"}
                                        </Link>
                                    </Grid>
                                </Grid>
                            </form>
                        </Paper>
                    </Container>
                </div>
            </div>
        )
    }
}

export default Loginpage;