# Node.js-Task-1-Simple-Server-Mock-Media-Server

# Node.js Media API Server

A simple Node.js server that provides RESTful API endpoints for movies, series, and songs data.

## Features

- RESTful API with support for GET, POST, PUT, and DELETE operations
- Three endpoints: `/movies`, `/series`, and `/songs`
- In-memory data storage with sample data
- Error handling for all routes and methods

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/nodejs-media-server.git
   cd nodejs-media-server
   ```

2. Install dependencies (none required for this basic server):
   ```
   npm init -y
   ```

3. Run the server:
   ```
   node server.js
   ```

The server will start on port 3000 by default. You can change this by setting the `PORT` environment variable.

## API Endpoints

### Movies

- `GET /movies` - Retrieve all movies
- `POST /movies` - Add a new movie
- `PUT /movies` - Update an existing movie
- `DELETE /movies` - Delete a movie by ID

### Series

- `GET /series` - Retrieve all series
- `POST /series` - Add a new series
- `PUT /series` - Update an existing series
- `DELETE /series` - Delete a series by ID

### Songs

- `GET /songs` - Retrieve all songs
- `POST /songs` - Add a new song
- `PUT /songs` - Update an existing song
- `DELETE /songs` - Delete a song by ID

## Example Requests

### GET Request

```
GET http://localhost:3000/movies
```

### POST Request

```
POST http://localhost:3000/movies
Content-Type: application/json

{
  "title": "The Matrix",
  "director": "The Wachowskis",
  "year": 1999,
  "genre": "Sci-Fi",
  "rating": 8.7
}
```

### PUT Request

```
PUT http://localhost:3000/movies
Content-Type: application/json

{
  "id": 1,
  "title": "Inception (Director's Cut)",
  "director": "Christopher Nolan",
  "year": 2010,
  "genre": "Sci-Fi/Thriller",
  "rating": 9.0
}
```

### DELETE Request

```
DELETE http://localhost:3000/movies
Content-Type: application/json

{
  "id": 5
}
```

## Error Handling

The server handles various error cases:

- 404 for resources not found
- 400 for invalid request data
- 405 for methods not allowed
- 500 for internal server errors

## License

MIT
