const $movieContainer = document.querySelector(".movie-container")
const $movieSearchInput = document.querySelector("#movie-search-input")

const NOW_PLAYING_URL = "https://api.themoviedb.org/3/movie/now_playing?language=ko-KR&page=1"
let SEARCH_URL = ''

// --------------- 영화 데이터 불러오기 -------------- //
// fetch에 필요한 API key와 options
import config from "../config/apiKey.js"
const APIKEY = config.apiKey
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${APIKEY}`
    }
};

// 영화 데이터 불러오는 함수
// url에 따라 기본 데이터를 가져올지, 검색 데이터를 가져올지 결정
const getMovieData = async (url) => {
    try {
        const res = await fetch(url, options)
        const data = await res.json()
        return data;
    } catch (err) {
        console.error("Error occured in getMovieData : ", err);
    };
};

// 영화 카드 배치 함수
const makeMovieList = (data) => {
    data.results.forEach((movie) => {
        let poster = movie.poster_path
        let title = movie.title
        let rating = movie.vote_average
        
        let template = `
        <div class="movie-card">
        <img src="https://image.tmdb.org/t/p/w200${poster}" onerror="this.src='./src/no_image.png';" alt="poster" class="movie-poster">
        <div class="movie-title">${title}</div>
        <div class="movie-rating">평점: ${rating}</div>
        </div>
        `
        $movieContainer.insertAdjacentHTML("beforeend", template)
    })
}

// 로드 시 첫 화면을 현재 상영작 목록으로 표시
const movieData = await getMovieData(NOW_PLAYING_URL); 
makeMovieList(movieData)

// ------------------- 영화 검색 기능 ----------------- //
/** 
 * 한글로 검색할 시 IME(입력기) 동작 방식 충돌로 인해 비정상적인 동작이 일어날 수 있음: 
 * 1. 한글이 다 써지지도 않았는데 이벤트가 발생 ('ㄱ'만 쓰는 경우)
 * 2. IME 입력 상태에서 다른 곳을 클릭하거나 엔터를 치는 경우 그 시점에서 이벤트가 한 번 더 발생
 * 
 * 해결 방법: 
 * compositionstart, compositionend 이벤트를 사용하여 IME 입력이 완료되었을 때만 이벤트가 발생하도록 만든다.
 * debounce를 이용하여 이벤트 발생에 대기 시간을 준다. 일정 시간동안 입력이 없을 경우 입력이 끝난것으로 간주하도록 만든다.
 * 
 * 그런데 한글 검색 중에도 검색은 하도록 만들고 싶으니, debounce만 적용하자.
 */

// debounce를 이용한 검색 API URL 생성
let debounceTimeout = null

$movieSearchInput.addEventListener("input", (event) => {
    // clearTimeout(debounceTimeout)
    // debounceTimeout = setTimeout(() => {
    //     setApiUrl(event.target.value)
    // }, 50)
    setApiUrl(event.target.value)
    console.log(event.target.value)
})

// 검색 API를 위한 URL 생성 및 API 호출 함수
const setApiUrl = async (movieSearchInput) => {
    const movieSearchInputAmpersand = `query=${movieSearchInput}&`
    SEARCH_URL = `https://api.themoviedb.org/3/search/movie?${movieSearchInputAmpersand}include_adult=false&language=ko-KR&page=1`
    const url = movieSearchInput ? SEARCH_URL : NOW_PLAYING_URL

    $movieContainer.innerHTML = ""

    const movieData = await getMovieData(url)
    makeMovieList(movieData)
}

//
// let debounceTimeout = null;
// let isComposing = false; // IME 입력 상태 추적
// let lastSearchQuery = ""; // 마지막 검색어 저장

// $movieSearchInput.addEventListener("compositionstart", () => {
//     isComposing = true; // IME 입력 시작
// });

// $movieSearchInput.addEventListener("compositionend", (event) => {
//     isComposing = false; // IME 입력 종료

//     const query = event.target.value;
//     if (query !== lastSearchQuery) { // 이전 검색어와 다를 경우에만 호출
//         lastSearchQuery = query;
//         handleSearch(query); // 즉시 API 호출
//     }
// });

// $movieSearchInput.addEventListener("input", (event) => {
//     if (isComposing) return; // IME 입력 중에는 무시

//     clearTimeout(debounceTimeout);

//     const query = event.target.value;
//     debounceTimeout = setTimeout(() => {
//         if (query !== lastSearchQuery) { // 이전 검색어와 다를 경우에만 호출
//             lastSearchQuery = query;
//             handleSearch(query); // 디바운싱 후 호출
//         }
//     }, 50); // 50ms 딜레이
// });

// // API 호출 및 데이터 처리
// const handleSearch = async (movieSearchInput) => {
//     const movieSearchInputAmpersand = `query=${movieSearchInput}&`;
//     const SEARCH_URL = `https://api.themoviedb.org/3/search/movie?${movieSearchInputAmpersand}include_adult=false&language=ko-KR&page=1`;
//     const url = movieSearchInput ? SEARCH_URL : NOW_PLAYING_URL;

//     $movieContainer.innerHTML = ""; // 기존 결과 초기화

//     const movieData = await getMovieData(url); // API 호출
//     makeMovieList(movieData); // 데이터 렌더링
// };
