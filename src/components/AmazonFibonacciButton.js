import CloudService from "../utils/CloudService";
import CloudButton from "./CloudButton";

const AmazonFibonacciButton = () => {
    return <CloudButton
        calculate={CloudService.getPrimeNumber}
        label='Get Prime number by index using Google Cloud Functions'
        inputPlaceholder='Enter Prime number index' 
        resultPlaceholder='prime number of _index_ is'/>
}

export default AmazonFibonacciButton;