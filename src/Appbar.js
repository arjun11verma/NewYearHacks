import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { IconButton, Grid, TextField} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search'
import {grey} from '@material-ui/core/colors';
import AppbarMenu from './AppbarMenu'


class Appbar extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
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
          backgroundColor: "grey",
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
        menuButton: {
          
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
                <IconButton style={styles.searchButton}>
                  <SearchIcon />
                </IconButton>
                <TextField id="standard-basic" label="search" style={styles.searchText}/>
              </Grid>

            </Grid>
            
            </div>
        )
    }
}



export default Appbar;