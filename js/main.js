import config from "../config/apiKey.js"
const APIKEY = config.apiKey
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${APIKEY}`
    }
};

fetch('https://api.themoviedb.org/3/movie/now_playing?language=ko-KR&page=1', options)
    .then(res => res.json())
    .then(res => {
        res.results.forEach((movie, i) => {
            let template = `
            <div class="movie-card">
                <img src="https://image.tmdb.org/t/p/w200${res.results[i].poster_path}" alt="poster" class="movie-poster">
                <div class="movie-title">${res.results[i].original_title}</div>
                <div class="movie-rating">평점: ${res.results[i].vote_average}</div>
            </div>
            `
            document.querySelector(".movie-container").insertAdjacentHTML("beforeend", template)
        });


    })
    .catch(err => console.error(err));