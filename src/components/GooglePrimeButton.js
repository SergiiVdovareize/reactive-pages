import CloudService from "../utils/CloudService";
import CloudButton from "./CloudButton";

const GooglePrimeButton = () => {
    return <CloudButton
        calculate={CloudService.getFibonacciNumber}
        label='Get Fibonacci number by index using AWS Lambda'
        inputPlaceholder='Enter Fibonacci number index' 
        resultPlaceholder='fibonacci number of _index_ is'/>
}

export default GooglePrimeButton;