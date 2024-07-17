import { Container } from "@chakra-ui/react";
import AmazonFibonacciButton from "./AmazonFibonacciButton"
import GooglePrimeButton from "./GooglePrimeButton";

const MainContainer = () => {
    return <Container>
        <AmazonFibonacciButton/>
        <GooglePrimeButton/>
    </Container>
}

export default MainContainer;