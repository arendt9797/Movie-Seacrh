import * as CNT from "../constants.js"

// 스토리지에 저장된 값을 string에서 DOM 요소로 변환
const stringToElement = (stringHTML) => {
    const objectHTML = document.createElement('div')
    objectHTML.innerHTML = stringHTML
    return objectHTML.firstChild
}

// 영화 ID 가져오기
const getMovieID = (modalBody) => modalBody.dataset.id

// 세션 스토리지에서 영화 카드 불러오기
const getMovieCardFromSession = (movieID) => {
    const storedCardHTML = sessionStorage.getItem(movieID)
    return stringToElement(storedCardHTML)
}

// 현재 목록에서 영화 카드 찾기
const findCurrentCard = (movieID, $modal) => {
    const movieCards = $modal.nextElementSibling.children
    return [...movieCards].find(card => card.dataset.id === movieID)
}

// 좋아요 상태 관리
const likeToggleHandler = (likeButton, movieID, storedCard, currentCard) => {
    const movieCardLiked = storedCard.querySelector('.movie-card-liked')
    const currentCardLiked = currentCard.querySelector('.movie-card-liked')

    // movieCardLiked는 로컬 스토리지에 저장될 영화 카드 업데이트를 위해 toggle 사용 불가능
    // currentCardLiked는 블록 밖에서 toggle 사용 가능하지만 통일성을 위해 사용하지 않음
    if (likeButton.classList.contains(CNT.LIKED)) {
        // 좋아요 해제
        likeButton.innerHTML = CNT.NOT_LIKE_TEXT
        movieCardLiked.classList.remove(CNT.VISIBLE)
        currentCardLiked.classList.remove(CNT.VISIBLE)
        localStorage.removeItem(movieID)
    } else {
        // 좋아요 설정
        likeButton.innerHTML = CNT.LIKE_TEXT
        movieCardLiked.classList.add(CNT.VISIBLE)
        currentCardLiked.classList.add(CNT.VISIBLE)
        localStorage.setItem(movieID, storedCard.outerHTML)
    }

    // 버튼 상태 토글
    likeButton.classList.toggle(CNT.LIKED)
}

// 좋아요한 영화 카드 목록 생성
const makeLikedMovieList = ($container) => {
    $container.innerHTML = ""
    Object.keys(localStorage).forEach((movieID) => {
        $container.innerHTML += localStorage.getItem(movieID)
    })
}

// 좋아요한 영화 없음 표시
const showEmptyLiked = ($container) => {
    $container.innerHTML = `<div class="empty-list">아직 좋아요한 영화가 없네요!</div>`
}

export { getMovieID, getMovieCardFromSession, findCurrentCard, likeToggleHandler, makeLikedMovieList, showEmptyLiked }