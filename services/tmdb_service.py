import requests
from config import Config


class TMDBService:
    """Service for interacting with The Movie Database (TMDB) API"""

    def __init__(self):
        self.api_key = Config.TMDB_API_KEY
        self.base_url = Config.TMDB_BASE_URL
        self.image_base_url = Config.TMDB_IMAGE_BASE_URL

    def _make_request(self, endpoint, params=None):
        """Make a request to the TMDB API"""
        if params is None:
            params = {}
        params['api_key'] = self.api_key

        try:
            response = requests.get(f"{self.base_url}{endpoint}", params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error making TMDB API request: {e}")
            return None

    def search_movies(self, query, page=1):
        """Search for movies by title"""
        endpoint = '/search/movie'
        params = {
            'query': query,
            'page': page,
            'include_adult': False
        }
        return self._make_request(endpoint, params)

    def get_movie_details(self, movie_id):
        """Get detailed information about a specific movie"""
        endpoint = f'/movie/{movie_id}'
        params = {
            'append_to_response': 'credits,videos,similar'
        }
        return self._make_request(endpoint, params)

    def get_similar_movies(self, movie_id, page=1):
        """Get movies similar to a specific movie"""
        endpoint = f'/movie/{movie_id}/similar'
        params = {'page': page}
        return self._make_request(endpoint, params)

    def discover_movies(self, genre_ids=None, year=None, sort_by='popularity.desc', page=1):
        """Discover movies based on filters"""
        endpoint = '/discover/movie'
        params = {
            'sort_by': sort_by,
            'page': page,
            'include_adult': False
        }

        if genre_ids:
            params['with_genres'] = ','.join(map(str, genre_ids))
        if year:
            params['year'] = year

        return self._make_request(endpoint, params)

    def get_genres(self):
        """Get the list of official genres"""
        endpoint = '/genre/movie/list'
        return self._make_request(endpoint)

    def get_trending_movies(self, time_window='day'):
        """Get trending movies (time_window: 'day' or 'week')"""
        endpoint = f'/trending/movie/{time_window}'
        return self._make_request(endpoint)

    def get_popular_movies(self, page=1):
        """Get popular movies"""
        endpoint = '/movie/popular'
        params = {'page': page}
        return self._make_request(endpoint)

    def get_top_rated_movies(self, page=1):
        """Get top rated movies"""
        endpoint = '/movie/top_rated'
        params = {'page': page}
        return self._make_request(endpoint)

    def get_poster_url(self, poster_path, size='w500'):
        """Get the full URL for a movie poster"""
        if not poster_path:
            return None
        return f"{self.image_base_url}{size}{poster_path}"
