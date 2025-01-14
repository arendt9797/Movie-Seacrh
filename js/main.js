import getMovieData from "./movieData.js"

const $mainTitle = document.querySelector(".main-title")
const $movieContainer = document.querySelector(".movie-container")
// const $movieCard = document.querySelector(".movie-card")
const $movieSearchInput = document.querySelector("#movie-search-input")
const $movieModal = document.querySelector(".movie-modal")
const $movieModalBody = document.querySelector(".movie-modal-body")
const NOW_PLAYING_URL = "https://api.themoviedb.org/3/movie/now_playing?language=ko-KR&page=1"
let debounceTimeout = null

// ============== 영화 카드 목록 생성 =============== //
// 영화 카드 목록 생성 함수
const makeMovieList = (data) => {
    $movieContainer.innerHTML = ""
    data.results.forEach((movie) => {
        let poster = movie.poster_path
        let title = movie.title
        let rating = movie.vote_average.toFixed(2)
        let id = movie.id
        let releaseDate = movie.release_date
        let overview = movie.overview

        let template = `
            <div class="movie-card" data-id="${id}">
                <img src="https://image.tmdb.org/t/p/w200${poster}" onerror="this.src='./src/no_image.png';" alt="poster" class="movie-poster">
                <div class="movie-title">${title}</div>
                <div class="movie-rating">평점: ${rating}</div>
            </div>
        `
        $movieContainer.innerHTML += template
    })
}
// id, overview, release_date

// 현재 상영작을 기본 목록으로 로드하기
const movieData = await getMovieData(NOW_PLAYING_URL);
makeMovieList(movieData)

// ================ 영화 검색 기능 ================= //
// debounce를 이용한 함수 호출 빈도 제어
$movieSearchInput.addEventListener("input", (event) => {
    clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(() => {
        setSearchApiUrl(event.target.value)
    }, 100)
})

// 검색 API를 위한 URL 생성 및 API 호출 함수
const setSearchApiUrl = async (movieSearchInput) => {
    const movieSearchInputQuery = `query=${movieSearchInput.toLowerCase()}&`
    const SEARCH_URL = `https://api.themoviedb.org/3/search/movie?${movieSearchInputQuery}include_adult=false&language=ko-KR&page=1`
    const url = movieSearchInput ? SEARCH_URL : NOW_PLAYING_URL

    const movieData = await getMovieData(url)
    makeMovieList(movieData)
}

// ============== 모달 팝업 ================ //
// 카드 클릭 시 모달 창 열기
// 클릭한 영화의 id를 모달 생성 함수로 보내기
$movieContainer.addEventListener("click", (event) => {
    // const currentClassList = event.target.classList
    // const parentClassList = event.target.parentNode.classList
    // if (currentClassList.contains('movie-card') || parentClassList.contains('movie-card')) {
    //     $movieModal.classList.add('visible')
    // }
    const movieCard = event.target.closest(".movie-card")
    if (movieCard && $movieContainer.contains(movieCard)){
        $movieModal.classList.add("visible")
    }

    let id = movieCard.dataset.id
    makeMovieDetail(id)
})

// 영화 상세정보 모달 생성 함수
const makeMovieDetail = async (id) => {
    $movieModal.innerHTML = ""
    const MODAL_URL = `https://api.themoviedb.org/3/movie/${id}?language=ko-KR`
    const movieData = await getMovieData(MODAL_URL)

    let poster = movieData.poster_path
    let title = movieData.title
    let rating = movieData.vote_average.toFixed(2)
    let releaseDate = movieData.release_date
    let overview = movieData.overview
    
    let template = `
        <div class="movie-modal-body modal-element">
            <img src="https://image.tmdb.org/t/p/w500${poster}" onerror="this.src='./src/no_image.png';">
            <div class="modal-element">${title}</div>
            <div class="modal-element">${overview}</div>
            <div>${releaseDate}</div>
            <div>${rating}</div>
            
            <button type="button" class="close_btn">닫기</button>
            <button type="button" class="bookmark_btn">북마크</button>
        </div>
    `
    $movieModal.innerHTML = template
}

// 모달 창 닫기
// 모달 내에서는 닫기 버튼으로만 닫을 수 있고, 모달 밖을 눌러도 닫을 수 있음
$movieModal.addEventListener("click", (event) => {
    if (event.target.classList.contains('modal-element'))
        return
    $movieModal.classList.remove('visible')
})

// ============== 메인 페이지 이동 ================ //
// 타이틀 클릭 시 기본 목록 로드
$mainTitle.addEventListener("click", async (event) => {
    $movieSearchInput.value = ''
    const movieData = await getMovieData(NOW_PLAYING_URL)
    makeMovieList(movieData)
})