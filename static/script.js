// Claude created basic functionality

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const moodBtns = document.querySelectorAll('.mood-btn');
const genreBtns = document.querySelectorAll('.genre-btn');
const trendingBtn = document.getElementById('trendingBtn');
const popularBtn = document.getElementById('popularBtn');
const topRatedBtn = document.getElementById('topRatedBtn');
const resultsSection = document.getElementById('resultsSection');
const resultsTitle = document.getElementById('resultsTitle');
const movieGrid = document.getElementById('movieGrid');
const movieModal = document.getElementById('movieModal');
const closeModal = document.querySelector('.close');
const movieDetails = document.getElementById('movieDetails');

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

moodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all mood buttons
        moodBtns.forEach(b => b.classList.remove('active'));
        // Remove active class from genre and quick access buttons
        genreBtns.forEach(b => b.classList.remove('active'));
        trendingBtn.classList.remove('active');
        popularBtn.classList.remove('active');
        topRatedBtn.classList.remove('active');
        // Add active class to clicked button
        btn.classList.add('active');
        handleMoodClick(btn.dataset.mood);
    });
});

genreBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all genre buttons
        genreBtns.forEach(b => b.classList.remove('active'));
        // Remove active class from mood and quick access buttons
        moodBtns.forEach(b => b.classList.remove('active'));
        trendingBtn.classList.remove('active');
        popularBtn.classList.remove('active');
        topRatedBtn.classList.remove('active');
        // Add active class to clicked button
        btn.classList.add('active');
        handleGenreClick(btn.dataset.genre);
    });
});

trendingBtn.addEventListener('click', () => {
    // Remove active class from all buttons
    moodBtns.forEach(b => b.classList.remove('active'));
    genreBtns.forEach(b => b.classList.remove('active'));
    popularBtn.classList.remove('active');
    topRatedBtn.classList.remove('active');
    // Add active class to trending button
    trendingBtn.classList.add('active');
    handleTrending();
});

popularBtn.addEventListener('click', () => {
    // Remove active class from all buttons
    moodBtns.forEach(b => b.classList.remove('active'));
    genreBtns.forEach(b => b.classList.remove('active'));
    trendingBtn.classList.remove('active');
    topRatedBtn.classList.remove('active');
    // Add active class to popular button
    popularBtn.classList.add('active');
    handlePopular();
});

topRatedBtn.addEventListener('click', () => {
    // Remove active class from all buttons
    moodBtns.forEach(b => b.classList.remove('active'));
    genreBtns.forEach(b => b.classList.remove('active'));
    trendingBtn.classList.remove('active');
    popularBtn.classList.remove('active');
    // Add active class to top rated button
    topRatedBtn.classList.add('active');
    handleTopRated();
});

closeModal.addEventListener('click', () => {
    movieModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === movieModal) {
        movieModal.style.display = 'none';
    }
});

// API Functions
async function searchMovies(query) {
    try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Search error:', error);
        return null;
    }
}

async function getRecommendationsByMood(mood) {
    try {
        const response = await fetch(`/api/recommend/mood/${mood}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Mood recommendation error:', error);
        return null;
    }
}

async function getRecommendationsByGenre(genre) {
    try {
        const response = await fetch(`/api/recommend/genre/${encodeURIComponent(genre)}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Genre recommendation error:', error);
        return null;
    }
}

async function getTrending() {
    try {
        const response = await fetch('/api/trending');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Trending error:', error);
        return null;
    }
}

async function getPopular() {
    try {
        const response = await fetch('/api/popular');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Popular error:', error);
        return null;
    }
}

async function getTopRated() {
    try {
        const response = await fetch('/api/top-rated');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Top rated error:', error);
        return null;
    }
}

async function getMovieDetails(movieId) {
    try {
        const response = await fetch(`/api/movie/${movieId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Movie details error:', error);
        return null;
    }
}

async function getSimilarMovies(movieId) {
    try {
        const response = await fetch(`/api/recommend/similar/${movieId}?limit=5`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Similar movies error:', error);
        return null;
    }
}

// Event Handlers
async function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    // Remove active class from all buttons when searching
    moodBtns.forEach(b => b.classList.remove('active'));
    genreBtns.forEach(b => b.classList.remove('active'));
    trendingBtn.classList.remove('active');
    popularBtn.classList.remove('active');
    topRatedBtn.classList.remove('active');

    showLoading();
    const data = await searchMovies(query);

    if (data && data.results) {
        displayMovies(data.results, `Search Results for "${query}"`);
    } else {
        showError('No results found');
    }
}

async function handleMoodClick(mood) {
    showLoading();
    const data = await getRecommendationsByMood(mood);

    if (data && data.movies) {
        displayMovies(data.movies, `Movies for when you're feeling ${mood}`);
    } else {
        showError('Failed to load recommendations');
    }
}

async function handleGenreClick(genre) {
    showLoading();
    const data = await getRecommendationsByGenre(genre);

    if (data && data.movies) {
        displayMovies(data.movies, `${genre} Movies`);
    } else {
        showError('Failed to load recommendations');
    }
}

async function handleTrending() {
    showLoading();
    const data = await getTrending();

    if (data && data.results) {
        displayMovies(data.results, 'Trending Movies');
    } else {
        showError('Failed to load trending movies');
    }
}

async function handlePopular() {
    showLoading();
    const data = await getPopular();

    if (data && data.results) {
        displayMovies(data.results, 'Popular Movies');
    } else {
        showError('Failed to load popular movies');
    }
}

async function handleTopRated() {
    showLoading();
    const data = await getTopRated();

    if (data && data.results) {
        displayMovies(data.results, 'Top Rated Movies');
    } else {
        showError('Failed to load top rated movies');
    }
}

async function handleMovieClick(movieId) {
    const data = await getMovieDetails(movieId);
    const similarData = await getSimilarMovies(movieId);

    if (data) {
        const similarMovies = similarData && similarData.similar_movies ? similarData.similar_movies : [];
        displayMovieDetails(data, similarMovies, movieId);
    } else {
        alert('Failed to load movie details');
    }
}

// Helper function to generate star rating HTML
function generateStarRating(rating) {
    const totalStars = 5;

    if (!rating) {
        // No rating available - show all grey stars
        let starsHTML = '';
        for (let i = 0; i < totalStars; i++) {
            starsHTML += '<span class="star empty">★</span>';
        }
        return starsHTML;
    }

    // Convert TMDB rating (out of 10) to 5-star rating
    const convertedRating = rating / 2;

    const wholePart = Math.floor(convertedRating);
    const decimalPart = convertedRating - wholePart;

    let filledStars = wholePart;
    let hasHalfStar = false;

    // Check if decimal is between 0.2 and 0.8 for half star
    if (decimalPart >= 0.2 && decimalPart <= 0.8) {
        hasHalfStar = true;
    } else if (decimalPart > 0.8) {
        // Round up if decimal > 0.8
        filledStars += 1;
    }

    const emptyStars = totalStars - filledStars - (hasHalfStar ? 1 : 0);

    let starsHTML = '';

    // Add filled stars (yellow)
    for (let i = 0; i < filledStars; i++) {
        starsHTML += '<span class="star filled">★</span>';
    }

    // Add half star if needed
    if (hasHalfStar) {
        starsHTML += '<span class="star half">★</span>';
    }

    // Add empty stars (grey)
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<span class="star empty">★</span>';
    }

    return starsHTML;
}

// Display Functions
function displayMovies(movies, title) {
    resultsTitle.textContent = title;
    movieGrid.innerHTML = '';

    movies.forEach(movie => {
        const posterPath = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : 'https://via.placeholder.com/500x750?text=No+Poster';

        const card = document.createElement('div');
        card.className = 'movie-card';
        card.onclick = () => handleMovieClick(movie.id);

        card.innerHTML = `
            <img src="${posterPath}" alt="${movie.title}">
            <div class="movie-card-content">
                <h3>${movie.title}</h3>
                <div class="movie-rating">
                    ${generateStarRating(movie.vote_average)}
                    <span class="rating-text">(TMDb: ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'})</span>
                </div>
                <p class="movie-overview">${movie.overview || 'No overview available'}</p>
            </div>
        `;

        movieGrid.appendChild(card);
    });

    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function displayMovieDetails(data, similarMovies = [], currentMovieId = null) {
    const combined = data.combined || {};
    const tmdb = data.tmdb || {};
    const omdb = data.omdb || {};

    const posterUrl = combined.poster || 'https://via.placeholder.com/300x450?text=No+Poster';

    // Extract ratings from OMDb
    let imdbRating = 'N/A';
    let rtRating = 'N/A';

    if (omdb && omdb.Ratings) {
        const imdbRatingObj = omdb.Ratings.find(r => r.Source === 'Internet Movie Database');
        const rtRatingObj = omdb.Ratings.find(r => r.Source === 'Rotten Tomatoes');

        if (imdbRatingObj) imdbRating = imdbRatingObj.Value;
        if (rtRatingObj) rtRating = rtRatingObj.Value;
    }

    // Fallback to imdbRating from combined if not in Ratings array
    if (imdbRating === 'N/A' && combined.imdb_rating) {
        imdbRating = `${combined.imdb_rating}/10`;
    }

    // Build similar movies HTML
    let similarMoviesHtml = '';
    if (similarMovies && similarMovies.length > 0) {
        similarMoviesHtml = `
            <div class="similar-movies-section">
                <h3>Similar Movies</h3>
                <div class="similar-movies-grid">
                    ${similarMovies.map(movie => {
                        const moviePoster = movie.poster_path
                            ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                            : 'https://via.placeholder.com/200x300?text=No+Poster';
                        return `
                            <div class="similar-movie-card" onclick="handleMovieClick(${movie.id})">
                                <img src="${moviePoster}" alt="${movie.title}">
                                <div class="similar-movie-info">
                                    <h4>${movie.title}</h4>
                                    <div class="similar-movie-rating">
                                        <span>⭐</span>
                                        <span>${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    movieDetails.innerHTML = `
        <div class="movie-detail-header">
            <img src="${posterUrl}" alt="${combined.title}" class="movie-detail-poster">
            <div class="movie-detail-info">
                <h2>${combined.title}</h2>
                <p><strong>Year:</strong> ${combined.year || 'N/A'}</p>
                <p><strong>Rated:</strong> ${combined.rated || 'N/A'}</p>
                <p><strong>Runtime:</strong> ${combined.runtime || 'N/A'}</p>
                <p><strong>Director:</strong> ${combined.director || 'N/A'}</p>
                <p><strong>Actors:</strong> ${combined.actors || 'N/A'}</p>
                <div class="ratings-row">
                    <p><strong>IMDb:</strong> ${imdbRating}</p>
                    <p><strong>Rotten Tomatoes:</strong> ${rtRating}</p>
                </div>
            </div>
        </div>
        <div class="movie-detail-plot">
            <h3>Plot</h3>
            <p>${combined.plot || 'No plot available'}</p>
        </div>
        ${similarMoviesHtml}
    `;

    movieModal.style.display = 'block';
}

function showLoading() {
    movieGrid.innerHTML = '<div class="loading">Loading...</div>';
    resultsSection.style.display = 'block';
}

function showError(message) {
    movieGrid.innerHTML = `<div class="loading">${message}</div>`;
    resultsSection.style.display = 'block';
}
