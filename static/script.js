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
    btn.addEventListener('click', () => handleMoodClick(btn.dataset.mood));
});

genreBtns.forEach(btn => {
    btn.addEventListener('click', () => handleGenreClick(btn.dataset.genre));
});

trendingBtn.addEventListener('click', handleTrending);
popularBtn.addEventListener('click', handlePopular);
topRatedBtn.addEventListener('click', handleTopRated);

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

// Event Handlers
async function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

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

    if (data) {
        displayMovieDetails(data);
    } else {
        alert('Failed to load movie details');
    }
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
                    <span>⭐</span>
                    <span>${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                </div>
                <p class="movie-overview">${movie.overview || 'No overview available'}</p>
            </div>
        `;

        movieGrid.appendChild(card);
    });

    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function displayMovieDetails(data) {
    const combined = data.combined || {};
    const tmdb = data.tmdb || {};
    const omdb = data.omdb || {};

    const posterUrl = combined.poster || 'https://via.placeholder.com/300x450?text=No+Poster';

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
                <p><strong>TMDB Rating:</strong> ${combined.tmdb_rating ? combined.tmdb_rating.toFixed(1) : 'N/A'}/10</p>
                <p><strong>IMDb Rating:</strong> ${combined.imdb_rating || 'N/A'}/10</p>
            </div>
        </div>
        <div class="movie-detail-plot">
            <h3>Plot</h3>
            <p>${combined.plot || 'No plot available'}</p>
        </div>
        ${combined.ratings && combined.ratings.length > 0 ? `
            <div class="movie-detail-ratings">
                <h3>Ratings</h3>
                ${combined.ratings.map(r => `<p><strong>${r.Source}:</strong> ${r.Value}</p>`).join('')}
            </div>
        ` : ''}
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
