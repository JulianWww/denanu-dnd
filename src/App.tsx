import React from 'react';
import { Route, Routes, useNavigate, PathRouteProps } from 'react-router-dom';
import { NotFound } from './components/notFound';
import logo from './logo.svg';
import './App.css';
import StatBlock from './pages/CharacterSheet';
import Login from './Login/Login';
import SignUp from "./Login/SignUp";
import useToken from './Login/UseToken';
import StatBlockSelector from "./pages/SelectMonserStatBlock";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { ThemeOptions, ThemeProvider, createTheme } from '@mui/material/styles';
import EncounterPlaner from './pages/EncounterPlaner';
import EncounterList from './pages/EncounterList';
import EncounterVerview from './pages/EncounterVerview';
import Campains from './pages/Campains';
import MainMenu from './components/MainMenu';
import SpellList from './pages/SpellList';
import SpellPage from './pages/SpellPage';

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

// Apply Dark mode more prevelently

function App() {
  const token = useToken();
  const navigate = useNavigate();
  return (<>
    <ThemeProvider theme={darkTheme}>
      <MainMenu {...token}>
        <Routes>
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
          <Route path="*" element={<NotFound item="page" id="unknown" />}/>
        </Routes>
        <ToastContainer />
      </MainMenu>
    </ThemeProvider>
    </>
  );
}

export default App;
