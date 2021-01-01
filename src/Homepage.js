import React, {Component} from 'react';

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
        return (
            <div>
                
            </div>
        )
    }
}

export default Homepage;