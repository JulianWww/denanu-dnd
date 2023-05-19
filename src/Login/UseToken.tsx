import { useState } from 'react';

export default function useToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    if (tokenString) {
      const userToken: Token = JSON.parse(tokenString);
      return userToken
    }
    return undefined;
  };

  const [token, setToken] = useState(getToken());

  const saveToken = (userToken: Token) => {
    if (userToken) {
      localStorage.setItem('token', JSON.stringify(userToken));
    }
    else {
      localStorage.removeItem("token");
    }
    setToken(userToken);
  };

  return {
    setToken: saveToken,
    token
  }
}

export interface Token {
  username: string;
  token: string;
}

export interface IToken {
  token?: Token;
  setToken: (t: Token) => void;
}