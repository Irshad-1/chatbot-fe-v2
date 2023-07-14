import React from 'react';
import {
  ChakraProvider,
  theme, Heading, CircularProgress, Box
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import SiteRoutes from './Components/common/SiteRoutes';

function App() {
  const loader = useSelector((state) => state.loader.loader);
  return (
    <ChakraProvider theme={theme}>
      <Heading size="3xl" color="#2B4865" textAlign="center">INT Chat-bot</Heading>{
        loader ? <Box display="flex" justifyContent="center"><CircularProgress isIndeterminate color="blue.600" size="200px" thickness="5px" /></Box> : <SiteRoutes />
      }
    </ChakraProvider>
  );
}

export default App;
