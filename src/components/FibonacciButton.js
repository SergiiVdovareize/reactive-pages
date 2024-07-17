import { Button, FormControl, FormErrorMessage, FormHelperText, FormLabel, Input, InputGroup, InputRightElement, Text } from "@chakra-ui/react";
import CloudService from "../utils/CloudService";
import { useRef, useState } from "react";

const FibonacciButton = (props) => {
    const handleClick = async () => {
        const startTime = Date.now();
        const fi = indexRef.current.value
        const result = await CloudService.getFibonacciNumber(fi);
        setResponseTime(Date.now() - startTime);
        
        if (result.success && result.data) {
            setErrorMessage(null);
            setIndex(fi)
            setResult(result.data)
        } else {
            setErrorMessage(result.message || 'unknown issue');
            setResult(null)
        }
    }

    const [responseTime, setResponseTime] = useState(null)
    const [index, setIndex] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)
    const [result, setResult] = useState(null)
    const indexRef = useRef(null)

    return <FormControl isInvalid={!!errorMessage}>
        <FormLabel>Get Fibonacci number by index using AWS Lambda:</FormLabel>
  
        <InputGroup size='md'>
            <Input
                ref={indexRef}
                pr='4.5rem'
                type='number'
                placeholder='Enter Fibonacci number index'
            />
  
            <InputRightElement width='4.5rem'>
                <Button size='sm' onClick={handleClick}>Calc</Button>
            </InputRightElement>    
        </InputGroup>

        { errorMessage && 
            <FormErrorMessage>{ errorMessage }</FormErrorMessage>
        }

        { result && <FormHelperText>
            <Text color='green'>{ `fibonacci number of ${index} is ` }
                <Text as='b'>{ result }</Text>
            </Text>
        </FormHelperText>}

        { responseTime && <FormHelperText>
            <Text as='i'>
                {`response time is ${responseTime}ms`}
            </Text>
        </FormHelperText>}
    </FormControl>
}

export default FibonacciButton;