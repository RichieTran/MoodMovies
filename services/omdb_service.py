import requests
from config import Config


class OMDBService:
    """Service for interacting with the Open Movie Database (OMDb) API"""

    def __init__(self):
        self.api_key = Config.OMDB_API_KEY
        self.base_url = Config.OMDB_BASE_URL

    def _make_request(self, params):
        """Make a request to the OMDb API"""
        params['tomatoes'] = 'true'
        params['apikey'] = self.api_key

        try:
            response = requests.get(self.base_url, params=params)
            response.raise_for_status()
            data = response.json()

            if data.get('Response') == 'False':
                print(f"OMDb API Error: {data.get('Error')}")
                return None

            return data
        except requests.exceptions.RequestException as e:
            print(f"Error making OMDb API request: {e}")
            return None

    def get_movie_by_title(self, title, year=None, plot='short'):
        """
        Get movie details by title
        plot: 'short' or 'full'
        """
        params = {
            't': title,
            'plot': plot
        }
        if year:
            params['y'] = year

        return self._make_request(params)

    def get_movie_by_imdb_id(self, imdb_id, plot='short'):
        """
        Get movie details by IMDb ID
        plot: 'short' or 'full'
        """
        params = {
            'i': imdb_id,
            'plot': plot
        }
        return self._make_request(params)

    def search_movies(self, query, page=1):
        """Search for movies by title"""
        params = {
            's': query,
            'page': page,
            'type': 'movie'
        }
        return self._make_request(params)

    def get_detailed_info(self, imdb_id):
        """
        Get detailed information about a movie including ratings from multiple sources
        """
        return self.get_movie_by_imdb_id(imdb_id, plot='full')
