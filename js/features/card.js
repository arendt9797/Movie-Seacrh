const $movieContainer = document.querySelector(".movie-container")

// 검색한 결과 없음 표시
const showEmptyMovie = ($container) => {
    $container.innerHTML = `<div class="empty-list">아쉽게도 영화를 못찾았어요...</div>`
}

// 영화 카드 목록 생성
const makeMovieList = (data, $container = $movieContainer) => {
    $container.innerHTML = ""
    // 검색한 결과가 없으면 빈 목록 표시
    if (data.results.length < 1) {
        showEmptyMovie($movieContainer)
    }
    data.results.forEach((movie) => {
        let poster = movie.poster_path
        let title = movie.title
        let rating = movie.vote_average.toFixed(2)
        let id = movie.id

        let liked = localStorage.getItem(id) ? 'visible' : ''

        let template = `
            <div class="movie-card" data-id="${id}">
                <img src="https://image.tmdb.org/t/p/w200${poster}" onerror="this.src='./src/no_image.png';" alt="poster" class="movie-poster">
                <div class="movie-title">${title}</div>
                <div class="movie-rating">평점: ${rating}</div>
                <div class="movie-card-liked ${liked}">❤️</div>
            </div>
        `
        $container.innerHTML += template
    })
}

export { makeMovieList }