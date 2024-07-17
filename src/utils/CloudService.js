import Constants from "./Constants";

const getResult = async (url) => {
    try {
        const data = await fetch(url)
        return await data.json()
    } catch (error) {
        return {
            success: false,
            message: error.message,
        }
    }
}

const CloudService = {
    async getFibonacciNumber(index) {
        return await getResult(`${Constants.FIBONACCI_URL}?index=${index}`)
    },

    async getPrimeNumber(index) {
        return await getResult(`${Constants.PRIME_URL}?index=${index}`)
    }
}

export default CloudService