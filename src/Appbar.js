import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { IconButton, Grid, TextField} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search'
import AppbarMenu from './AppbarMenu';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';


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
        text: {
          position: 'absolute', 
          left: '50%', 
          top: '5%',
          transform: 'translate(-50%, -50%)'
        },
        searchButton: {
          position: 'absolute', 
          right: '5%', 
          top: '7%',
          transform: 'translate(-50%, -50%)'
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

              <Grid item xs={9} style={styles.text}>
                <Typography> Welcome to Potato Bowl!!</Typography>
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