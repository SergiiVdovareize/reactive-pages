import { Center, Container } from '@chakra-ui/react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import './App.css';
import MainContainer from './components/MainContainer';

function App() {
  return (
    <ChakraProvider value={defaultSystem}>
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
