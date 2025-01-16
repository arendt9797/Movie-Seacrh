import getMovieData from "../api/movieData.js"
import { makeMovieList } from "./card.js"
import { NOW_PLAYING_URL } from "../constants.js"

// 검색 API 호출 및 생성
const setSearchApiUrl = async (movieSearchInput) => {
    // search API는 이미 대소문자 구별 없이 검색이 가능하도록 되어있다.
    const movieSearchInputQuery = `query=${movieSearchInput}&`
    const SEARCH_URL = `https://api.themoviedb.org/3/search/movie?${movieSearchInputQuery}include_adult=false&language=ko-KR&page=1`
    const url = movieSearchInput ? SEARCH_URL : NOW_PLAYING_URL
    
    try {
        const movieData = await getMovieData(url)
        makeMovieList(movieData)
    } catch {
        console.error("Error occured while setting Search API URL : ", err)
    }
}

export default setSearchApiUrl