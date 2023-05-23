import React from 'react';
import {sha512} from 'crypto-hash';
import { lastUrl } from "../components/MainMenu"
import {Token} from "./UseToken"
import { NavigateFunction } from 'react-router-dom';
import { backendUrl } from './ServerApi';
import { Avatar, Box, Button, Container, CssBaseline, Grid, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import InternalLink from '../components/Link';

interface State {
  username?: string;
  password?: string;
}
interface Props {
  setToken: any;
  token?: Token;
  nav: NavigateFunction;
}

export default class Login extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  loginUser = async (credentials: any, backendURL: string) => {
    return fetch(backendURL + '/login.php?' +  new URLSearchParams({
        username: credentials.username,
        password: await sha512(credentials.password)
      }), {
      method: 'POST',
      headers: {
      }
    })
      .then(data => data.json())
  }

  render = () => {
    const {username, password} = this.state;

    const handleSubmit = async (e: any) => {
      if (username && password) {
        e.preventDefault();
        const token = await this.loginUser({
          username,
          password
        }, backendUrl);
        console.log(token);
        if (token.status === "success") {
          this.props.setToken(token.data);
          this.props.nav(lastUrl);
        }
      }  
    }

    return(
      <Container maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="uname"
              label="User Name"
              name="uname"
              autoComplete="uname"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
              </Grid>
              <Grid item>
                <InternalLink url="/signup">
                  Don't have an account? Sign Up
                </InternalLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    )
  }
}
