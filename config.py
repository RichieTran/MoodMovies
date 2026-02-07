# Boilerplate created by Claude

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Config:
    """Application configuration class"""

    # Flask Configuration
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    FLASK_APP = os.getenv('FLASK_APP', 'app.py')
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    DEBUG = FLASK_ENV == 'development'

    # API Keys
    TMDB_API_KEY = os.getenv('TMDB_API_KEY')
    OMDB_API_KEY = os.getenv('OMDB_API_KEY')

    # API Base URLs
    TMDB_BASE_URL = 'https://api.themoviedb.org/3'
    OMDB_BASE_URL = 'http://www.omdbapi.com/'

    # TMDB Image Base URL
    TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/'

    @staticmethod
    def validate_config():
        """Validate that required configuration is present"""
        if not Config.TMDB_API_KEY:
            raise ValueError("TMDB_API_KEY is not set in environment variables")
        if not Config.OMDB_API_KEY:
            raise ValueError("OMDB_API_KEY is not set in environment variables")
