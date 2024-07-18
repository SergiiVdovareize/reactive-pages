import { Container } from "@chakra-ui/react";
import AzureArmstrongButton from "./AzureArmstrongButton";
import GooglePrimeButton from "./GooglePrimeButton";
import AmazonFibonacciButton from "./AmazonFibonacciButton";

const MainContainer = () => {
    return <Container p={0}>
        <AzureArmstrongButton/>
        <GooglePrimeButton/>
        <AmazonFibonacciButton/>
    </Container>
}

export default MainContainer;