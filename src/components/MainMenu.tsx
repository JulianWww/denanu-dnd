import * as React from 'react';
import {Token} from "../Login/UseToken"
import { AppBar, Button, Collapse, Tab, Tabs, Toolbar } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import NavigateButton from './NavitageButton';


export var setMainMenuHidden: ( val: boolean ) => void = (val: boolean) => {}

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
  "encounter-planer",
  "campains",
  "spells"
]

function getLoc(url: string) {
  const [,base] = url.split("/", 2);
  return pages.indexOf(base);
}

export var lastUrl = "/monsters";

function DesktopContainer(props: DesktopContainerProps) {
  const nav = useNavigate();
  const loc = useLocation();
  var idx = getLoc(loc.pathname);
  if (idx === -1) {
    idx = getLoc(lastUrl);
  }
  else {
    lastUrl = loc.pathname;
  }


  return (
      <AppBar>
        <Toolbar>
          <Tabs value={idx} sx={{ flexGrow: 1, alignSelf: 'flex-end' }}>
            {
              pages.map((val: string)=> <Tab key={val} label={val.replace("-", " ")} onClick={()=>nav("/" + val)}/>)
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
                <NavigateButton url="/login">
                  Log in
                </NavigateButton>
                <NavigateButton url="/signup" style={{ marginLeft: '0.5em' }}>
                  Sign up
                </NavigateButton>
              </>
            }
          </>
        </Toolbar>
      </AppBar>
    )
}

interface ResponsiveContainerProps extends DesktopContainerProps{
  children?: React.ReactNode;
}

// <MobileContainer>{children}</MobileContainer>

class MainMenu extends React.Component<ResponsiveContainerProps, {}>{

  render = () => (
        <DesktopContainer token={this.props.token} setToken={this.props.setToken}>{}</DesktopContainer>
  )
}

export default MainMenu;