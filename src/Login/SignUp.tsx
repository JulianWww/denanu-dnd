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
  noUname: boolean;
  noPassword: boolean;
  unameMessage?: string;
}
interface Props {
  setToken: any;
  token?: Token;
  nav: NavigateFunction;
}

export default class SignUp extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      noUname: false,
      noPassword: false,
    };
  }

  loginUser = async (credentials: any, backendURL: string) => {
    return fetch(backendURL + '/signup.php?' +  new URLSearchParams({
        username: credentials.username,
        password: await sha512(credentials.password),
        email: credentials.email,
      }), {
      method: 'POST',
      headers: {
      }
    })
      .then(data => data.json())
  }

  render = () => {
    const { noUname, noPassword, unameMessage } = this.state;

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);

      const username = data.get("uname");
      const password = data.get("password");
      const email = data.get("email");

      this.setState({
        noUname: !Boolean(username),
        noPassword: !Boolean(password),
        unameMessage: undefined,
      })


      if (username && password) {
        const token = await this.loginUser({
          username,
          password,
          email,
        }, backendUrl);


        if (token.status === "success") {
          this.props.setToken(token.data);
          this.props.nav(lastUrl);
          return;
        }
        if (token.reason === "uname Exists") {
          this.setState({
            unameMessage: "User Name already Exists",
            noUname: true,
          })
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
            Sign Up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              autoComplete="uname"
              name="uname"
              required
              fullWidth
              id="uname"
              label="User Name"
              autoFocus
              error={noUname}
              helperText={unameMessage}
            />
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              sx={{mt:3}}
              error={noPassword}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 4, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <InternalLink url="/login" variant="body2">
                  Already have an account? Sign in
                </InternalLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    )
  }
}
