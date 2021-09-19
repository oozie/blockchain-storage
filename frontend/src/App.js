import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Paper } from '@mui/material';
import { Grid } from '@mui/material';
import { InjectedConnector } from '@web3-react/injected-connector'

import OutlinedInput from '@mui/material/OutlinedInput';


const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42],
})


function ButtonAppBar(props) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Blockchain Storage
          </Typography>
          <Button color="inherit" onClick={ props.active ? () => {} : props.connect }>
            { props.active ? props.account : "Connect wallet" }
        </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}



function App() {
  const { active, account, library, connector, activate, deactivate } = useWeb3React()

  const [ authorized, setAuthorized ] = useState(false);
  async function connect() {
    try {
      await activate(injected)
      console.log("conn")
    } catch (ex) {
      console.log(ex)
    }
  }

  async function disconnect() {
    try {
      await deactivate()
      setAuthorized(false);
      console.log("disc")
    } catch (ex) {
      console.log(ex)
    }
  }

  useEffect(() => {
    injected.isAuthorized().then((isAuth) => {
      setAuthorized(isAuth)
      if (isAuth) {
        activate(injected)
      }
    })
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <ButtonAppBar active={active} connect={connect} disconnect={disconnect} account={account} />
      </header>
      <Box sx={{ m: 4 }} />
      <Paper style={{width: "60vw", margin: "auto", height: "60vh", padding: 32}} elevation={6}>
        <Grid container justifyContent={"space-around"}>
          <Grid container>
            <Grid container>
              <Grid item xs={12}>
                <Button style={{width: "100%"}} variant="contained" disabled={!active}>publish to blockchain</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default App;
