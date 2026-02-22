import { Box, Button, Field, Group, Input, Text } from "@chakra-ui/react";
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
        const res = await calculate(value);
        setResponseTime(Date.now() - startTime);

        if (res.success && res.data) {
            setErrorMessage(null);
            setIndex(value)
            setResult(res.data)
            setCalculationTime(res.calculationTime)
        } else {
            setErrorMessage(res.message || 'unknown issue');
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
        <Field.Root invalid={!!errorMessage}>
            <Field.Label>
                {label}:
            </Field.Label>

            <Group attached w="full">
                <Input
                    ref={indexRef}
                    type='number'
                    data-index={true}
                    placeholder={inputPlaceholder}
                    onKeyDown={handleKeyDown}
                    disabled={isCalculating}
                />
                <Button loading={isCalculating} size='sm' onClick={submitIndex}>Calc</Button>
            </Group>

            {errorMessage &&
                <Field.ErrorText>{errorMessage}</Field.ErrorText>
            }

            {result && <Field.HelperText>
                <Text color='green'>{`${composeResult()} `}
                    <Text as='b'>{result}</Text>
                </Text>
            </Field.HelperText>}

            {responseTime && <Field.HelperText>
                <Text as='i'>
                    {`response time is ${responseTime}ms`}
                    {(!isNaN(calculationTime) && calculationTime !== null) && `, calculation time is ${calculationTime}ms`}
                </Text>
            </Field.HelperText>}
        </Field.Root>
    </Box>
}

export default CloudButton;