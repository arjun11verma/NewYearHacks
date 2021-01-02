import React, { Component } from 'react';
import Appbar from './Appbar';
import axios from 'axios';


class Yoursetspage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    componentDidMount() {
        console.log("got em")
    }

    render() {
        return (
            <div>
                <Appbar/>
                <h1>Yo momma</h1>
            </div>
        )
    }
}

export default Yoursetspage;
