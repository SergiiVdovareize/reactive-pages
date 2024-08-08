import CloudService from "../utils/CloudService";
import CloudButton from "./CloudButton";

const GooglePrimeButton = () => {
    return <CloudButton
        calculate={CloudService.getPrimeNumber}
        label='Get Prime number by index using Google Cloud Functions'
        inputPlaceholder='Enter index between 1 and 1000000'
        resultPlaceholder='prime number of _index_ is'/>
}

export default GooglePrimeButton;