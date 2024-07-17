import Constants from "./Constants";

const CloudService = {
    async getFibonacciNumber(index) {
        const data = await fetch(`${Constants.FIBONACCI_URL}?index=${index}`)
        const json = await data.json()
        return json;
    }
}

export default CloudService