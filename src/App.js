import React from 'react';
import {
  ChakraProvider,
  theme,
  Heading,
  CircularProgress,
  Box,
  Button,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import SiteRoutes from './Components/common/SiteRoutes';
import { BrowserRouter, NavLink, useLocation } from 'react-router-dom';


function App() {
  const loader = useSelector(state => state.loader.loader);
  const location = useLocation();
  const token = sessionStorage.getItem('intechnology');
  return (
    <ChakraProvider theme={theme}>
      <Heading size="2xl" textAlign="center">
        INT Helpdesk
      </Heading>
      {/* {token && (
        <>
          <Button
            colorScheme={
              location.pathname === '/feed-question' ? 'blue' : 'gray'
            }
          >
            <NavLink to="/feed-question">Add Question answer</NavLink>
          </Button>
          <Button
            colorScheme={
              location.pathname === '/manage-qa' ? 'blue' : 'gray'
            }
          >
            <NavLink to="/manage-qa">Question table</NavLink>
          </Button>
          <Button colorScheme={location.pathname === '/' ? 'blue' : 'gray'}>
            <NavLink to="/">ChatBot</NavLink>
          </Button>
        </>
      )} */}
      {/* {loader ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress
            isIndeterminate
            color="blue.600"
            size="200px"
            thickness="5px"
          />
        </Box>
      ) : (
        <SiteRoutes />
      )} */}
      <SiteRoutes />
    </ChakraProvider>
  );
}

export default App;
