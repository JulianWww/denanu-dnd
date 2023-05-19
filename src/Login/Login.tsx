import React, { useState } from 'react';
import {sha512} from 'crypto-hash';
import {
  Button,
  Container,
  Card,
  Form,
  Header,
  Icon,
  Image,
  List,
  Menu,
  Segment,
  Statistic,
  Sidebar,
  Visibility,
} from 'semantic-ui-react';
import MainMenu from "../components/MainMenu"
import {Token} from "./UseToken"
import { NavigateFunction } from 'react-router-dom';
import { backendUrl } from './ServerApi';

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
      .then(data => {console.log(data); return data.json()})
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
        if (token.status == "success") {
          this.props.setToken(token.data);
          this.props.nav(-1);
        }
      }  
    }

    return(
      <MainMenu token={this.props.token} setToken={this.props.setToken}>
        <Container>
          <Card className="thin">
            <Form onSubmit={handleSubmit} className="loginForm">
              <Form.Input fluid label='Username' placeholder='Username' onChange={(e) => this.setState({username: e.target.value})}/>
              <Form.Input fluid label='password' placeholder='password' onChange={(e) => this.setState({password: e.target.value})} type='password'/>
              <Form.Button primary>Log In</Form.Button>
            </Form>
          </Card>
        </Container>
      </MainMenu>
    )
  }
}
