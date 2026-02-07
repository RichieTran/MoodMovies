from services.tmdb_service import TMDBService
from services.omdb_service import OMDBService


class RecommendationService:
    """Service for generating movie recommendations based on mood and preferences"""

    def __init__(self):
        self.tmdb = TMDBService()
        self.omdb = OMDBService()

        # Mood to genre mapping (TMDB genre IDs)
        self.mood_to_genres = {
            'happy': [35, 10751, 16],  # Comedy, Family, Animation
            'sad': [18, 10749],  # Drama, Romance
            'excited': [28, 12, 878],  # Action, Adventure, Sci-Fi
            'romantic': [10749, 35],  # Romance, Comedy
            'scared': [27, 53],  # Horror, Thriller
            'thoughtful': [18, 99, 36],  # Drama, Documentary, History
            'adventurous': [12, 14, 28],  # Adventure, Fantasy, Action
            'relaxed': [10751, 35, 16],  # Family, Comedy, Animation
            'mysterious': [9648, 53, 80],  # Mystery, Thriller, Crime
            'inspired': [99, 36, 10402]  # Documentary, History, Music
        }

        # TMDB Genre IDs reference
        self.genre_reference = {
            28: 'Action',
            12: 'Adventure',
            16: 'Animation',
            35: 'Comedy',
            80: 'Crime',
            99: 'Documentary',
            18: 'Drama',
            10751: 'Family',
            14: 'Fantasy',
            36: 'History',
            27: 'Horror',
            10402: 'Music',
            9648: 'Mystery',
            10749: 'Romance',
            878: 'Science Fiction',
            10770: 'TV Movie',
            53: 'Thriller',
            10752: 'War',
            37: 'Western'
        }

    def get_recommendations_by_mood(self, mood, limit=10):
        """
        Get movie recommendations based on user's mood
        """
        mood = mood.lower()
        genre_ids = self.mood_to_genres.get(mood)

        if not genre_ids:
            # Default to popular movies if mood not found
            return self.tmdb.get_popular_movies()

        # Discover movies matching the mood genres
        results = self.tmdb.discover_movies(genre_ids=genre_ids, sort_by='vote_average.desc')

        if results and 'results' in results:
            return {
                'mood': mood,
                'genres': [self.genre_reference.get(gid) for gid in genre_ids],
                'movies': results['results'][:limit]
            }

        return None

    def get_similar_movies(self, movie_id, limit=10):
        """
        Get movies similar to a specific movie
        """
        results = self.tmdb.get_similar_movies(movie_id)

        if results and 'results' in results:
            return results['results'][:limit]

        return None

    def get_recommendations_by_genre(self, genre_name, limit=10):
        """
        Get movie recommendations by genre name
        """
        # Find genre ID by name
        genre_id = None
        for gid, gname in self.genre_reference.items():
            if gname.lower() == genre_name.lower():
                genre_id = gid
                break

        if not genre_id:
            return None

        results = self.tmdb.discover_movies(genre_ids=[genre_id], sort_by='popularity.desc')

        if results and 'results' in results:
            return results['results'][:limit]

        return None

    def get_enriched_movie_details(self, tmdb_movie):
        """
        Enrich TMDB movie data with OMDb ratings and additional info
        """
        # Get IMDb ID from TMDB movie data
        imdb_id = tmdb_movie.get('imdb_id')

        if not imdb_id and 'id' in tmdb_movie:
            # Fetch full details if we only have TMDB ID
            full_details = self.tmdb.get_movie_details(tmdb_movie['id'])
            if full_details:
                imdb_id = full_details.get('imdb_id')

        if imdb_id:
            omdb_data = self.omdb.get_movie_by_imdb_id(imdb_id)
            if omdb_data:
                # Combine data from both APIs
                return {
                    'tmdb': tmdb_movie,
                    'omdb': omdb_data,
                    'combined': {
                        'title': tmdb_movie.get('title'),
                        'year': omdb_data.get('Year'),
                        'rated': omdb_data.get('Rated'),
                        'runtime': omdb_data.get('Runtime'),
                        'director': omdb_data.get('Director'),
                        'actors': omdb_data.get('Actors'),
                        'plot': omdb_data.get('Plot') or tmdb_movie.get('overview'),
                        'poster': self.tmdb.get_poster_url(tmdb_movie.get('poster_path')),
                        'imdb_rating': omdb_data.get('imdbRating'),
                        'tmdb_rating': tmdb_movie.get('vote_average'),
                        'ratings': omdb_data.get('Ratings', [])
                    }
                }

        # Return just TMDB data if OMDb lookup fails
        return {
            'tmdb': tmdb_movie,
            'omdb': None,
            'combined': {
                'title': tmdb_movie.get('title'),
                'plot': tmdb_movie.get('overview'),
                'poster': self.tmdb.get_poster_url(tmdb_movie.get('poster_path')),
                'tmdb_rating': tmdb_movie.get('vote_average')
            }
        }

    def get_available_moods(self):
        """Get list of available moods"""
        return list(self.mood_to_genres.keys())

    def get_available_genres(self):
        """Get list of available genres"""
        return list(self.genre_reference.values())
