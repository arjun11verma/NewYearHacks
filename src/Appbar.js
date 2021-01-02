import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { IconButton, Grid, TextField, colors} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search'
import AppbarMenu from './AppbarMenu';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Potato from './potato.png';
import {Link} from 'react-router-dom'

const location = window.location.href.split("/");
const email = location[location.length - 1];

class Appbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
          random: ""
        }
    }

    searchClick(){
      console.log('fuck osu, change later')
      //TO DO
    }

    accountClick(){
      console.log("been")
      //TO DO
    }

    render() {

      const styles = {
        searchText: {
          position: 'absolute', 
          right: '4%', 
          top: '5%',
          transform: 'translate(-50%, -50%)'
        },
        paper: {
          backgroundColor: "#94DBFF",
          height: 60,
          width: 'auto',
          margin: 5,
          display: 'flex',
          flexWrap: 'wrap',
        },
        textButton: {
          position: 'absolute', 
          left: '10%', 
          top: '6%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: "#240F03",
          color: "white",
          fontSize: "100%",
          fontFamily: "Comic Sans MS"
          //backgroundImage: "url(./potato.png)",
        },
        searchButton: {
          position: 'absolute', 
          right: '5%', 
          top: '7%',
          transform: 'translate(-50%, -50%)',
        },
        accountIcon: {
          position: 'absolute', 
          right: '1%', 
          top: '7%',
          transform: 'translate(-50%, -50%)'
        }
      }


        return (
          <div> 
            <Grid style={styles.paper} container spacing={3}> 

              <Grid item xs={11} style={styles.menuButton}>
                <AppbarMenu/>
              </Grid>

              <Grid item xs={9}>
                <IconButton component={Link} to={"/Homepage/" + email} style={styles.textButton}>
                  <Typography style={{fontFamily:"Comic Sans MS", fontSize:18}}> PotatoBowl </Typography>
                </IconButton>
                
              </Grid>

              <Grid item xs={1} >
                <IconButton style={styles.searchButton} onClick={this.searchClick}>
                  <SearchIcon />
                </IconButton>
                <TextField id="standard-basic" label="search" style={styles.searchText}/>
              </Grid>

              <Grid item>
                <IconButton style={styles.accountIcon} onClick={this.accountClick} href="/Homepage/:id/Settings">
                  <AccountCircleIcon />
                </IconButton>
              </Grid>

            </Grid>
            
            </div>
        )
    }
}



export default Appbar;