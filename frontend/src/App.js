import { useEffect, useState } from 'react';
import { useWeb3React, Web3ReactProvider } from '@web3-react/core';
import axios from 'axios';
import { Web3Provider } from "@ethersproject/providers";
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
  supportedChainIds: [1, 3, 4, 5, 42, 1337],
})

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}


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
  const [ contract, setContract] = useState(null);
  const [ value, setValue] = useState();
  const [ newValue, setNewValue] = useState(0);

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

  useEffect(() => {
    if (library === undefined) {
      return
    }
    axios.get("/contracts/Storage.json")
      .then((response) => {
        const abi = response.data.abi;
        const network_id = Object.keys(response.data.networks)[0];
        const address = response.data.networks[network_id].address;
        const storageContract = new library.eth.Contract(abi, address);
        setContract(storageContract);
      })
      .catch((error) => {
        console.log(error)
    });
  }, [library])


  const retreiveFromBlockchain = () => {
    contract.methods.retrieve().call()
      .then((result) => {
        setValue(result)
      })
  }

  useEffect(() => {
    if (contract === null) {
      return
    }
    retreiveFromBlockchain();
  }, [contract])

  const publish = () => {
    contract.methods.store(newValue).send({from: account})
      .then((result) => {
         console.log(result);
         retreiveFromBlockchain();
       })
      .catch((error) => {
         console.log(error);
      })
  }

  const handleInput = (event) => {
    const v = event.target.value;
    if (v.includes(".")) return;
    if (!isNaN(event.target.value)) {
      setNewValue(event.target.value);
    }
  }

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <div className="App">
        <header className="App-header">
          <ButtonAppBar active={active} connect={connect} disconnect={disconnect} account={account} />
        </header>
        <Box sx={{ m: 4 }} />
        <Paper style={{width: "60vw", margin: "auto", height: "60vh", padding: 32}} elevation={6}>
          <Grid container justifyContent={"space-around"}>
            <Grid container>
              <Grid container direction="column" alignItems="center" >
                <Grid item >
                  <Typography variant="h1">
                  {value}
                  </Typography>
                </Grid>
                <Grid item >
                  <Typography variant="h1">
                    <OutlinedInput onChange={handleInput} value={newValue} />
                  </Typography>
                </Grid>
                <Grid item >
                  <Button onClick={publish} style={{width: "100%"}} variant="contained" disabled={!active}>publish "{newValue}" to blockchain</Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </div>
    </Web3ReactProvider>
  );
}

export default App;
