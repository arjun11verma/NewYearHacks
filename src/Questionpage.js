import React, {Component} from 'react';
import axios from 'axios';
import base_url from './APIENDPOINT';

const url_list = document.location.href.split("/");

class Questionpage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: url_list[url_list.length - 2]
        }
    }

    createQuestion = () => {
        const questionBody = document.getElementById('questionbody').value;
        const answer = document.getElementById('answer').value;
        const difficulty = document.getElementById('difficulty').value;
        const category = document.getElementById('category').value;
        const publicity = document.getElementById('publicity').value;
        const packetName = document.getElementById('packet').value;

        axios.post(base_url + 'createQuestion', {'questionBody': questionBody, 'answer': answer, 'difficulty': difficulty, 'category': category, 'publicity': publicity, 'username': this.state.username, 'packetName': packetName}).then((res) => {
            if(res.status) console.log("Question Created Successfully");
            else console.log("Question Not Created. Bummer");
        });
    }

    render() {
        return (
            <div>
                
            </div>
        )
    }
}

export default Questionpage;