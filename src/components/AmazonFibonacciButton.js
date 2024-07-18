import CloudService from "../utils/CloudService";
import CloudButton from "./CloudButton";

const AmazonFibonacciButton = () => {
    return <CloudButton
        calculate={CloudService.getFibonacciNumber}
        label='Get Fibonacci number by index using AWS Lambda'
        resultPlaceholder='fibonacci number of _index_ is'/>
}

export default AmazonFibonacciButton;