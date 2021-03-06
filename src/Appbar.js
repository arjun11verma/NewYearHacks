import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { IconButton, Grid, TextField, colors, AppBar } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search'
import AppbarMenu from './AppbarMenu';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Potato from './potato.png';
import { Link } from 'react-router-dom'
import Settings from './Settings'

const location = window.location.href.split("/");
const username = location[location.length - 2];

class Appbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      random: ""
    }
  }

  comp = () => {
    /*
     <Grid item xs={3} >
              <IconButton style={styles.searchButton} onClick={this.searchClick}>
                <SearchIcon />
              </IconButton>
              <TextField id="standard-basic" label="search" style={styles.searchText} />
            </Grid>
    */
  }

  searchClick() {
    console.log('fuck osu, change later')
    //TO DO
  }

  accountClick() {
    console.log("been")
    //TO DO
  }

  render() {

    const styles = {
      searchText: {
      },
      paper: {
        backgroundColor: "#94DBFF",
        height: 60,
        width: 'auto',
        margin: 5,
      },
      textButton: {
        backgroundColor: "#240F03",
        color: "white",
        fontSize: "100%",
        fontFamily: "Comic Sans MS"
        //backgroundImage: "url(./potato.png)",
      },
      searchButton: {
      },
      accountIcon: {
        fontSize: 500
      }
    }


    return (
      <div>
        <AppBar style = {{position: "static"}}>
          <Grid style={styles.paper} container alignContent = "center" alignItems = "center">
            <Grid item xs = {10} style={{marginLeft: 20, paddingRight: 105}}>
              <AppbarMenu />
            </Grid>

            <Grid item>
              <IconButton component={Link} to={"/Homepage/" + username + "/"} style={styles.textButton}>
                <Typography style={{ fontFamily: "Comic Sans MS", fontSize: 18 }}> PotatoBowl </Typography>
              </IconButton>
            </Grid>

            <Grid item>
              <Settings/>
            </Grid>
          </Grid>
        </AppBar>
      </div>
    )
  }
}



export default Appbar;