# Basic functionality created by Claude

from flask import Flask, render_template, request, jsonify
from config import Config
from services.recommendation_service import RecommendationService
from services.tmdb_service import TMDBService
from services.omdb_service import OMDBService

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Validate configuration on startup
try:
    Config.validate_config()
except ValueError as e:
    print(f"Configuration Error: {e}")
    print("Please check your .env file and ensure API keys are set.")

# Initialize services
recommendation_service = RecommendationService()
tmdb_service = TMDBService()
omdb_service = OMDBService()


@app.route('/')
def index():
    """Render the main page"""
    moods = recommendation_service.get_available_moods()
    genres = recommendation_service.get_available_genres()
    return render_template('index.html', moods=moods, genres=genres)


@app.route('/api/recommend/mood/<mood>')
def recommend_by_mood(mood):
    """Get movie recommendations based on mood"""
    limit = request.args.get('limit', 10, type=int)
    results = recommendation_service.get_recommendations_by_mood(mood, limit)

    if results:
        return jsonify(results)
    else:
        return jsonify({'error': 'Mood not found or no results'}), 404


@app.route('/api/recommend/genre/<genre>')
def recommend_by_genre(genre):
    """Get movie recommendations based on genre"""
    limit = request.args.get('limit', 10, type=int)
    results = recommendation_service.get_recommendations_by_genre(genre, limit)

    if results:
        return jsonify({'genre': genre, 'movies': results})
    else:
        return jsonify({'error': 'Genre not found or no results'}), 404


@app.route('/api/recommend/similar/<int:movie_id>')
def recommend_similar(movie_id):
    """Get similar movie recommendations"""
    limit = request.args.get('limit', 10, type=int)
    results = recommendation_service.get_similar_movies(movie_id, limit)

    if results:
        return jsonify({'movie_id': movie_id, 'similar_movies': results})
    else:
        return jsonify({'error': 'Movie not found or no similar movies'}), 404


@app.route('/api/movie/<int:movie_id>')
def get_movie_details(movie_id):
    """Get detailed information about a specific movie"""
    tmdb_details = tmdb_service.get_movie_details(movie_id)

    if tmdb_details:
        enriched = recommendation_service.get_enriched_movie_details(tmdb_details)
        return jsonify(enriched)
    else:
        return jsonify({'error': 'Movie not found'}), 404


@app.route('/api/search')
def search_movies():
    """Search for movies by title"""
    query = request.args.get('q', '')
    page = request.args.get('page', 1, type=int)

    if not query:
        return jsonify({'error': 'Query parameter "q" is required'}), 400

    # Search using TMDB
    results = tmdb_service.search_movies(query, page)

    if results:
        return jsonify(results)
    else:
        return jsonify({'error': 'Search failed'}), 500


@app.route('/api/trending')
def get_trending():
    """Get trending movies"""
    time_window = request.args.get('time_window', 'day')
    results = tmdb_service.get_trending_movies(time_window)

    if results:
        return jsonify(results)
    else:
        return jsonify({'error': 'Failed to fetch trending movies'}), 500


@app.route('/api/popular')
def get_popular():
    """Get popular movies"""
    page = request.args.get('page', 1, type=int)
    results = tmdb_service.get_popular_movies(page)

    if results:
        return jsonify(results)
    else:
        return jsonify({'error': 'Failed to fetch popular movies'}), 500


@app.route('/api/top-rated')
def get_top_rated():
    """Get top rated movies"""
    page = request.args.get('page', 1, type=int)
    results = tmdb_service.get_top_rated_movies(page)

    if results:
        return jsonify(results)
    else:
        return jsonify({'error': 'Failed to fetch top rated movies'}), 500


@app.route('/api/moods')
def get_moods():
    """Get available moods"""
    moods = recommendation_service.get_available_moods()
    return jsonify({'moods': moods})


@app.route('/api/genres')
def get_genres():
    """Get available genres"""
    genres = recommendation_service.get_available_genres()
    return jsonify({'genres': genres})


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({'error': 'Not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({'error': 'Internal server error'}), 500


# For Vercel deployment, the app object is used directly
# For local development, uncomment the lines below:
# if __name__ == '__main__':
#     app.run(debug=Config.DEBUG, host='0.0.0.0', port=8000)
