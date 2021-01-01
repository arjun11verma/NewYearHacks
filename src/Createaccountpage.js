import React, {Component} from 'react';
import {Paper, Container, Typography, TextField, Button} from '@material-ui/core';
import axios from 'axios';
import base_url from './APIENDPOINT';

class Createaccountpage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            failedCreate: false
        }
    }

    createAccount = (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const email = document.getElementById('email').value;

        axios.post(base_url + 'createAccount', {'username': username, 'password': password, 'email': email}).then((res) => {
            if(res.data.status) window.location.href = "/";
            else this.setState({failedCreate: true});
        });
    }

    render() {
        return (
            <div class="animated-background" style={{height: "100vh"}}>
                <div>
                    <Container component="main" maxWidth="sm" style={{paddingTop: "11%"}}>
                        <Paper style={{backgroundColor: "white", display: "flex", flexDirection: "column", alignItems: "center"}} elevation={24}>
                            <Typography style={{paddingTop: "5%", marginBottom: "2%"}} component="h1" variant="h5">
                                Create a Potatobowl Account
                            </Typography>
                            <form>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    label="Username"
                                    id="username"
                                    error={this.state.failedCreate}
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
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Email"
                                    id="email"
                                    style={{width: "80%", marginLeft: "10%"}}
                                />
                                <Button
                                    onClick = {this.createAccount}
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    style={{width: "80%", marginLeft: "10%", marginTop: "3%", marginBottom: "5%"}}
                                >
                                    Create Account!
                                </Button>
                            </form>
                        </Paper>
                    </Container>
                </div>
            </div>
        )
    }
}

export default Createaccountpage;