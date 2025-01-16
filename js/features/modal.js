import getMovieData from "../api/movieData.js";
import * as CNT from "../constants.js";

// 모달 열기
const openMovieModal = ($modal) => {
    $modal.classList.add("visible");
};

// 모달 닫기
const closeMovieModal = ($modal) => {
    $modal.classList.remove("visible");
};

// 모달 생성
const makeMovieModal = async (id, $modal) => {
    $modal.innerHTML = ""
    try {
        const MODAL_URL = `https://api.themoviedb.org/3/movie/${id}?language=ko-KR`
        const movieData = await getMovieData(MODAL_URL)

        let poster = movieData.poster_path
        let title = movieData.title
        let rating = movieData.vote_average.toFixed(2)
        let releaseDate = movieData.release_date
        let overview = movieData.overview

        // 좋아요 상태에 따라 좋아요 버튼 다르게 하기
        let currentLike = localStorage.getItem(id) ? CNT.LIKED : ''
        let currentText = localStorage.getItem(id) ? CNT.LIKE_TEXT : CNT.NOT_LIKE_TEXT

        // 상세페이지에 id를 속성으로 넣어주기
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
        $modal.innerHTML = template
    } catch (err) {
        console.error("Error occured while making modal : ", err)
    }
}

export { openMovieModal, makeMovieModal, closeMovieModal }