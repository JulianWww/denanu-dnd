import * as React from 'react';
import {Token} from "../Login/UseToken"
import { AppBar, Box, Button, Tab, Tabs, Toolbar, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

interface HomepageHeadingProps {
  mobile: boolean;
}

const REPO_LINK = 'https://github.com/MaxwellBo/Muncoordinated-2';



interface DesktopContainerProps {
  children?: React.ReactNode;
  token?: Token;
  setToken: any;
}
/* Heads up!
 * Neither Semantic UI nor Semantic UI React offer a responsive navbar, however, it can be implemented easily.
 * It can be more complicated, but you can create really flexible markup.
 */

const pages = [
  "monsters",
  "encounters",
  "campains",
  "spells"
]

function DesktopContainer(props: DesktopContainerProps) {
  const nav = useNavigate();
  const loc = useLocation();
  const [,base] = loc.pathname.split("/", 2)

  console.log(base, loc);


  return <AppBar>
    <Toolbar>
      <Tabs value={pages.indexOf(base)} sx={{ flexGrow: 1, alignSelf: 'flex-end' }}>
        {
          pages.map((val: string)=> <Tab key={val} label={val} onClick={()=>nav("/" + val)}/>)
        }
      </Tabs>
      <>
        {props.token ?
          <>
            <Button onClick={(e) => props.setToken(undefined)}>
              Log Out
            </Button>
            <p style={{ marginLeft: '0.5em' }}>
              Logged in as {props.token.username}
            </p>
          </>
          :
          <>
            <Button href="/login">
              Log in
            </Button>
            <Button href="/signup" style={{ marginLeft: '0.5em' }}>
              Sign up
            </Button>
          </>
        }
      </>
    </Toolbar>
  </AppBar>
}

interface ResponsiveContainerProps extends DesktopContainerProps{
  children?: React.ReactNode;
}

// <MobileContainer>{children}</MobileContainer>

class MainMenu extends React.Component<ResponsiveContainerProps, {}>{

  render = () => (<Box sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}>
        <DesktopContainer token={this.props.token} setToken={this.props.setToken}>{}</DesktopContainer>
        <main style={{marginTop: "80px"}}>
          {this.props.children}
        </main>
      </Box>
  )
}

export default MainMenu;