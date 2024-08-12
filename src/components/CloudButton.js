import { Box, Button, FormControl, FormErrorMessage, FormHelperText, FormLabel, Input, InputGroup, InputRightElement, Text } from "@chakra-ui/react";
import { useRef, useState } from "react";

const CloudButton = (props) => {
    const { 
        calculate,
        label,
        inputPlaceholder = 'Enter index',
        resultPlaceholder,
    } = props

    const [responseTime, setResponseTime] = useState(null)
    const [calculationTime, setCalculationTime] = useState(null)
    const [index, setIndex] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)
    const [result, setResult] = useState(null)
    const [isCalculating, setIsCalculating] = useState(false)
    const indexRef = useRef(null)

    const submitIndex = async () => {
        if (isCalculating) {
            return;
        }

        const startTime = Date.now();
        setIsCalculating(true);
        const value = indexRef.current.value
        const result = await calculate(value);
        setResponseTime(Date.now() - startTime);
        
        if (result.success && result.data) {
            setErrorMessage(null);
            setIndex(value)
            setResult(result.data)
            setCalculationTime(result.calculationTime)
        } else {
            setErrorMessage(result.message || 'unknown issue');
            setResult(null);
        }
        setIsCalculating(false);
        restoreFocus();
    }

    const restoreFocus = () => {
        if (document.activeElement.dataset?.index !== 'true') {
            setTimeout(() => {
                indexRef.current.focus();
            }, 100);
        }
    }

    const handleKeyDown = (event) => {
        if (event.keyCode === 13) {
            submitIndex();
        }
    }

    const composeResult = () => {
        return resultPlaceholder.replace('_index_', index)
    }

    return <Box borderWidth={1} borderRadius={5} p={4} mb={4}>
        <FormControl isInvalid={!!errorMessage}>
            <FormLabel>
                { label }:
            </FormLabel>
    
            <InputGroup size='md'>
                <Input
                    ref={indexRef}
                    pr='4.5rem'
                    type='number'
                    data-index={true}
                    placeholder={inputPlaceholder}
                    onKeyDown={handleKeyDown}
                    disabled={isCalculating}
                />
    
                <InputRightElement width='4.5rem'>
                    <Button isLoading={isCalculating} size='sm' onClick={submitIndex}>Calc</Button>
                </InputRightElement>    
            </InputGroup>

            { errorMessage && 
                <FormErrorMessage>{ errorMessage }</FormErrorMessage>
            }

            { result && <FormHelperText>
                <Text color='green'>{ `${composeResult()} ` }
                    <Text as='b'>{ result }</Text>
                </Text>
            </FormHelperText>}

            { responseTime && <FormHelperText>
                <Text as='i'>
                    {`response time is ${responseTime}ms`}
                    { (!isNaN(calculationTime) && calculationTime !== null) && `, calculation time is ${calculationTime}ms`}
                </Text>
            </FormHelperText>}
        </FormControl>
    </Box>
}

export default CloudButton;