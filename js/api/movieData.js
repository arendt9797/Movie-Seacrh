// .gitingore를 통해 API key를 숨기고 싶을 경우. 배포를 위해 비활성화
// import config from "../../config/apiKey.js"

const getMovieData = async (url) => {
    try {
        const APIKEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2OGZiMzRlYzIxMDIwYzEzZDQ3M2Q5MDRiMjAxYTc1MyIsIm5iZiI6MTczNjI5NjkyMy4zMjUsInN1YiI6IjY3N2RjOWRiMTI2Njc5Njg4NTRlNTA1NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.a5bQzmbRDYQUi4oZnHJuUMnSD6HXe3zE2k3C5etrbLk"
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
        console.error("Error occured while getting Movie Data : ", err);
    };
};

export default getMovieData