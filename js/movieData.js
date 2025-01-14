import config from "../config/apiKey.js"

const getMovieData = async (url) => {
    try {
        const APIKEY = config.apiKey
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${APIKEY}`
            }
        };
        const res = await fetch(url, options)
        const data = await res.json()
        return data;
    } catch (err) {
        console.error("Error occured in getMovieData : ", err);
    };
};

export default getMovieData