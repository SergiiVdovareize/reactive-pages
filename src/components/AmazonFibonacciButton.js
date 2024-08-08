import CloudService from "../utils/CloudService";
import CloudButton from "./CloudButton";

const AmazonFibonacciButton = () => {
    return <CloudButton
        calculate={CloudService.getFibonacciNumber}
        label='Get Fibonacci number by index using AWS Lambda'
        inputPlaceholder='Enter index between 1 and 300'
        resultPlaceholder='fibonacci number of _index_ is'/>
}

export default AmazonFibonacciButton;