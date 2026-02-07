# MoodMovies - Mood-Based Movie Recommendation System

A Python web application that recommends movies based on your mood, preferences, and similar movies using TMDB and OMDb APIs.

## Features

- Movie recommendations based on mood
- Movie recommendations based on preferences (genre, year, etc.)
- Similar movie recommendations
- Detailed movie information from both TMDB and OMDb

## API Keys

- **TMDB API Key**: Get it from [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
- **OMDb API Key**: Get it from [http://www.omdbapi.com/apikey.aspx](http://www.omdbapi.com/apikey.aspx)

## Project Structure

```
moodMovies/
├── app.py                  # Main Flask application
├── config.py               # Configuration management
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables (not in git)
├── .gitignore             # Git ignore file
├── services/              # API and business logic services
│   ├── __init__.py
│   ├── tmdb_service.py
│   ├── omdb_service.py
│   └── recommendation_service.py
├── templates/             # HTML templates
│   └── index.html
└── static/               # Static files
    ├── style.css
    └── script.js
```

## Technologies Used

- **Backend**: Flask (Python)
- **APIs**: TMDB API, OMDb API
- **Frontend**: HTML, CSS, JavaScript
- **Environment Management**: python-dotenv
