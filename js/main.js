import getMovieData from "./movieData.js"

const $mainTitle = document.querySelector(".main-title")
const $movieLikedList = document.querySelector(".movie-liked")
const $movieContainer = document.querySelector(".movie-container")
const $movieSearchInput = document.querySelector("#movie-search-input")
const $movieModal = document.querySelector(".movie-modal")
const NOW_PLAYING_URL = "https://api.themoviedb.org/3/movie/now_playing?language=ko-KR&page=1"

let debounceTimeout = null

const LIKED = "liked"
const LIKE_TEXT = '좋아요 ❤️'
const NOT_LIKE_TEXT = '좋아요 누르기 🤍'

// ============== 영화 카드 목록 생성 =============== //
// 영화 카드 목록 생성 함수
const makeMovieList = (data) => {
    $movieContainer.innerHTML = ""
    data.results.forEach((movie) => {
        let poster = movie.poster_path
        let title = movie.title
        let rating = movie.vote_average.toFixed(2)
        let id = movie.id

        let template = `
            <div class="movie-card" data-id="${id}">
                <img src="https://image.tmdb.org/t/p/w200${poster}" onerror="this.src='./src/no_image.png';" alt="poster" class="movie-poster">
                <div class="movie-title">${title}</div>
                <div class="movie-rating">평점: ${rating}</div>
                <div class="movie-card-liked">❤️</div>
            </div>
        `
        $movieContainer.innerHTML += template
    })
}

// 현재 상영작을 기본 목록으로 로드하는 함수
const initializeMovieList = async () => {
    $movieSearchInput.value = ''
    const movieData = await getMovieData(NOW_PLAYING_URL)
    makeMovieList(movieData)
}

// 영화 기본 목록 로드하기
initializeMovieList()

// 타이틀 클릭 시 기본 목록 로드하기
$mainTitle.addEventListener("click", async () => {
    initializeMovieList()
})

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
    // search API는 이미 대소문자 구별 없이 검색이 가능하도록 되어있다.
    const movieSearchInputQuery = `query=${movieSearchInput.toLowerCase()}&`
    const SEARCH_URL = `https://api.themoviedb.org/3/search/movie?${movieSearchInputQuery}include_adult=false&language=ko-KR&page=1`
    const url = movieSearchInput ? SEARCH_URL : NOW_PLAYING_URL

    const movieData = await getMovieData(url)
    makeMovieList(movieData)
}

// ============== 모달 팝업 ================ //
// 카드 클릭 시 모달 창 열기
// 클릭한 영화의 id를 모달 생성 함수로 보내기
// id와 해당 카드를 세션 스토리지에 저장
$movieContainer.addEventListener("click", (event) => {
    const movieCard = event.target.closest(".movie-card")
    if (movieCard && $movieContainer.contains(movieCard)) {
        $movieModal.classList.add("visible")
    }
    const id = movieCard.dataset.id
    sessionStorage.setItem(id, movieCard.outerHTML)
    makeMovieModal(id)
})

// 영화 상세정보 모달 생성 함수
const makeMovieModal = async (id) => {
    $movieModal.innerHTML = ""
    const MODAL_URL = `https://api.themoviedb.org/3/movie/${id}?language=ko-KR`
    const movieData = await getMovieData(MODAL_URL)

    let poster = movieData.poster_path
    let title = movieData.title
    let rating = movieData.vote_average.toFixed(2)
    let releaseDate = movieData.release_date
    let overview = movieData.overview

    // 좋아요 상태에 따라 보이는 버튼 다르게 하기
    let currentLike = localStorage.getItem(id) ? LIKED : ''
    let currentText = localStorage.getItem(id) ? LIKE_TEXT : NOT_LIKE_TEXT

    // 상세페이지 div에 movie id를 속성으로 넣어주기
    let template = `
        <div class="movie-modal-body modal-element" data-id="${id}">
            <div class="modal-poster modal-element">   
                <img src="https://image.tmdb.org/t/p/w300${poster}" onerror="this.src='./src/no_image.png';" class="modal-element">
            </div>
            <div class="modal-details modal-element">
                <div class="modal-element" id="modal-title">${title}</div>
                <div class="modal-element" id="modal-overview">${overview}</div>
            </div>
            <div class="modal-footer modal-element">
                <div class="modal-element" id="modal-date">개봉일 : ${releaseDate}</div>
                <div class="modal-element" id="modal-rating">평점 : ${rating}</div>
                <button type="button" class="close-btn">x</button>
                <button type="button" class="like-btn modal-element ${currentLike}">${currentText}</button>
            </div>
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


// =============== 모달 내 좋아요 버튼 & 좋아요 페이지 ================= //
const stringToElement = (stringHTML) => {
    const objectHTML = document.createElement('div')
    objectHTML.innerHTML = stringHTML
    return objectHTML.firstChild
}

// 좋아요 버튼 토글
// 좋아요 누른 영화 배열에 추가/삭제
$movieModal.addEventListener("click", (event) => {
    const movieModalBody = event.target.closest('.movie-modal-body')
    const likeButton = event.target.closest('.like-btn')
    if (!likeButton || !movieModalBody)
        return
    
    // 상세페이지 div에 넣어뒀던 movie id 가져오기
    const movieID = movieModalBody.dataset.id

    let movieCardFromStorage = sessionStorage.getItem(movieID)
    movieCardFromStorage = stringToElement(movieCardFromStorage)
    const movieCardLiked = movieCardFromStorage.querySelector('.movie-card-liked')
    
    if (likeButton.classList.contains(LIKED)) {
        likeButton.innerHTML = NOT_LIKE_TEXT
        localStorage.removeItem(movieID)
    } else {
        likeButton.innerHTML = LIKE_TEXT
        movieCardLiked.classList.add('visible')
        localStorage.setItem(movieID, movieCardFromStorage.outerHTML)
    }
    likeButton.classList.toggle(LIKED)
})

// 좋아요한 영화 버튼 누르면 localStorage 순회
$movieLikedList.addEventListener("click", () => {
    if (localStorage.length < 1) {
        $movieContainer.innerHTML = `<div class="empty-list">아직 좋아요한 영화가 없네요!</div>`
        return
    }
    $movieContainer.innerHTML = ""
    Object.keys(localStorage).forEach((movieID) => {
        $movieContainer.innerHTML += localStorage.getItem(movieID)
    })
})