import CloudService from "../utils/CloudService";
import CloudButton from "./CloudButton";

const AzureArmstrongButton = () => {
    return <CloudButton
        calculate={CloudService.getArmstrongNumber}
        label='Get Armstrong number by index using Azure Functions'
        inputPlaceholder='Enter index between 1 and 25'
        resultPlaceholder='armstrong number of _index_ is'/>
}

export default AzureArmstrongButton;