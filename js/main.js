import getMovieData from "./api/movieData.js"
import debounceHandler from "./utils/debounce.js"
import { makeMovieList } from "./features/card.js"
import { openMovieModal, makeMovieModal, closeMovieModal } from "./features/modal.js"
import { getMovieID, getMovieCardFromSession, findCurrentCard, likeToggleHandler, makeLikedMovieList, showEmptyLiked } from "./features/like.js"
import setSearchApiUrl from "./features/search.js"
import * as CNT from "./constants.js"

const $mainTitle = document.querySelector(".main-title")
const $movieLikedList = document.querySelector(".movie-liked")
const $movieContainer = document.querySelector(".movie-container")
const $movieSearchInput = document.querySelector("#movie-search-input")
const $movieModal = document.querySelector(".movie-modal")

// ============== 영화 기본 목록 =============== //
// 현재 상영작을 기본 목록으로 로드
const initializeMovieList = async () => {
    $movieSearchInput.value = ""
    try {
        const movieData = await getMovieData(CNT.NOW_PLAYING_URL)
        makeMovieList(movieData, $movieContainer)
    } catch(err) {
        console.err("Error occured while initializing : ", err)
    }
}

// 영화 기본 목록 로드
initializeMovieList()

// 타이틀 클릭 시 기본 영화 목록 로드
$mainTitle.addEventListener("click", async () => {
    initializeMovieList()
})

// ================ 영화 검색  ================= //
// debounce를 이용한 함수 호출 빈도 제어
$movieSearchInput.addEventListener("input", debounceHandler($movieSearchInput, setSearchApiUrl, 100))

// ================= 모달 팝업 ================= //
// 모달 열기 및 생성
$movieContainer.addEventListener("click", (event) => {
    const movieCard = event.target.closest(".movie-card")
    if (!(movieCard && $movieContainer.contains(movieCard))) {
        return
    }
    // 클릭한 영화의 id와 카드를 세션 스토리지에 저장
    const movieID = movieCard.dataset.id
    sessionStorage.setItem(movieID, movieCard.outerHTML)

    // 영화 카드 모달 열기
    openMovieModal($movieModal)

    // 영화 카드 모달 생성
    makeMovieModal(movieID, $movieModal)
})

// 모달 닫기
// 모달 밖을 클릭할 경우 닫기 가능, 모달 내에서는 닫기 버튼으로만 닫기 가능
$movieModal.addEventListener("click", (event) => {
    if (event.target.classList.contains('modal-element'))
        return
    closeMovieModal($movieModal)
})

// ================== 좋아요 기능 =================== //
// 좋아요 상태 관리
$movieModal.addEventListener("click", (event) => {
    const movieModalBody = event.target.closest('.movie-modal-body')
    const likeButton = event.target.closest('.like-btn')
    if (!likeButton || !movieModalBody) {
        return
    }
    // 상세페이지 div에 넣어뒀던 movie id 가져오기
    const movieID = getMovieID(movieModalBody)

    // 세션 스토리지에 저장한 영화 카드 요소를 불러오기
    const movieCardFromStorage = getMovieCardFromSession(movieID)

    // 현재 목록에서 영화 카드 찾기
    const currentCard = findCurrentCard(movieID, $movieModal)

    // 좋아요 상태 토글
    likeToggleHandler(likeButton, movieID, movieCardFromStorage, currentCard)
})

// 좋아요한 영화 카드 목록 생성
$movieLikedList.addEventListener("click", () => {
    $movieSearchInput.value = ""
    // 좋아요가 없으면 빈 목록 표시
    if (localStorage.length < 1) {
        showEmptyLiked($movieContainer)
        return
    }
    makeLikedMovieList($movieContainer)
})