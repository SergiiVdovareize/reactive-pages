import Constants from "./Constants";

const getResult = async (url) => {
    try {
        const data = await fetch(url)
        const json = await data.json()
        if (json.type === 'sync') {
            return json.data;
        }

        if (json.type === 'async') {
            return await getAsyncResult(`${Constants.RESULT_URL}/${json.data}`)
        }

        return {
            success: false,
            message: 'unknown issue',
        }
    } catch (error) {
        return {
            success: false,
            message: error.message,
        }
    }
}

const getAsyncResult = async (url) => {
    try {
        const data = await fetch(url)
        const json = await data.json()
        
        if (json.success) {
            return json
        }

        if (!json.success && json.status === 2) {
            return await getAsyncResult(url);
        }

        return {
            success: false,
            message: 'unknown issue',
        }
    } catch (error) {
        return {
            success: false,
            message: error.message,
        }
    }
}

const CloudService = {
    async getFibonacciNumber(index) {
        return await getResult(`${Constants.FIBONACCI_URL}/${index}`)
    },

    async getPrimeNumber(index) {
        return await getResult(`${Constants.PRIME_URL}/${index}`)
    },

    async getArmstrongNumber(index) {
        return await getResult(`${Constants.ARMSTRONG_URL}/${index}`)
    },
}

export default CloudService