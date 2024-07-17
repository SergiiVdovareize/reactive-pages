import './App.css';
import MainContainer from './components/MainContainer';

import { Center, ChakraProvider, Container } from '@chakra-ui/react'

function App() {
  return (
    <ChakraProvider>
      <Container>
        <Center>
          <img src='./cloud.png' className="App-logo" alt="logo" />
        </Center>
        <MainContainer/>
      </Container>
    </ChakraProvider>
  );
}

export default App;
