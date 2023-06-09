import { Route, Routes, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { NotFound } from './components/notFound';
import './App.css';
import StatBlock from './pages/CharacterSheet';
import Login from './Login/Login';
import SignUp from "./Login/SignUp";
import useToken from './Login/UseToken';
import StatBlockSelector from "./pages/SelectMonserStatBlock";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import "./animations.css";
import { ThemeOptions, ThemeProvider, createTheme } from '@mui/material/styles';
import EncounterPlaner from './pages/EncounterPlaner';
import EncounterList from './pages/EncounterList';
import EncounterVerview from './pages/EncounterVerview';
import Campains from './pages/Campains';
import MainMenu from './components/MainMenu';
import SpellList from './pages/SpellList';
import SpellPage from './pages/SpellPage';
import { Box } from '@mui/material';
import{ SaveUkraineBanScreen, SaveUkraineRibbon } from "stand-with-ukraine-react";
import PlayerCharacterSheet from './components/player/CharSheet';
import TextWraper from './components/TextWraper';

const themeProps: ThemeOptions = {
  typography: {
    button: {
      textTransform: "none",
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiButtonGroup: {
      defaultProps: {
        
      },
    },
    MuiCard: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "standard",
      },
    },
    MuiSelect: {
      defaultProps: {
        variant: "standard"
      },
    },
    MuiTooltip: {
      defaultProps: {
        arrow: true,
      }
    }
  },
}

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  ...themeProps,
});

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
  ...themeProps,
});

/*
<SaveUkraineRibbon style={{height: "100px"}}/>
        <SaveUkraineBanScreen isCancelable/>
*/

// Apply Dark mode more prevelently

function App() {
  const token = useToken();
  const navigate = useNavigate();
  const location = useLocation();

  return (<>
    <ThemeProvider theme={darkTheme}>
      <MainMenu {...token}/>
      <Box sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
      }}>
        <TextWraper>
          <main style={{marginTop: "80px"}}>
            <Routes location={location}>
              <Route path="/" element={<Navigate to="/monsters"/>}/>
              <Route path="/login" element={<Login {...token} nav={navigate}/>}/>
              <Route path="/signup" element={<SignUp {...token} nav={navigate}/>}/>
              <Route path="/monsters" element={<StatBlockSelector {...token}/>}/>
              <Route path="/monsters/:group/:source/:name" element={<StatBlock {...token}/>}/>
              <Route path="/encounters" element={<EncounterList {...token}/>}/>
              <Route path="/encounters/:group/:source/:name" element={<EncounterVerview {...token}/>}/>
              <Route path="/encounter-planer/" element={<EncounterPlaner {...token}/>}/>
              <Route path="/campains" element={<Campains {...token}/>}/>
              <Route path="/spells" element={<SpellList {...token}/>}/>
              <Route path="/spells/:group/:source/:name" element={<SpellPage {...token}></SpellPage>}/>
              <Route path="/player" element={<PlayerCharacterSheet/>}/>
              <Route path="*" element={<NotFound item="page" id="unknown" />}/>
            </Routes>
          </main>
        </TextWraper>
          
        <ToastContainer style={{
          marginTop: "70px"
        }}/>
      </Box>
    </ThemeProvider>
    </>
  );

}

export default App;
