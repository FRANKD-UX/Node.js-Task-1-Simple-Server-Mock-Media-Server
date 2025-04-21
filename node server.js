// server.js
const http = require('http');
const url = require('url');

// Create sample data arrays
let movies = [
  { id: 1, title: "Inception", director: "Christopher Nolan", year: 2010, genre: "Sci-Fi", rating: 8.8 },
  { id: 2, title: "The Shawshank Redemption", director: "Frank Darabont", year: 1994, genre: "Drama", rating: 9.3 },
  { id: 3, title: "The Dark Knight", director: "Christopher Nolan", year: 2008, genre: "Action", rating: 9.0 },
  { id: 4, title: "Pulp Fiction", director: "Quentin Tarantino", year: 1994, genre: "Crime", rating: 8.9 },
  { id: 5, title: "Forrest Gump", director: "Robert Zemeckis", year: 1994, genre: "Drama", rating: 8.8 }
];

let series = [
  { id: 1, title: "Breaking Bad", creator: "Vince Gilligan", seasons: 5, startYear: 2008, endYear: 2013, genre: "Crime Drama", rating: 9.5 },
  { id: 2, title: "Game of Thrones", creator: "David Benioff, D.B. Weiss", seasons: 8, startYear: 2011, endYear: 2019, genre: "Fantasy", rating: 9.2 },
  { id: 3, title: "Stranger Things", creator: "The Duffer Brothers", seasons: 4, startYear: 2016, endYear: null, genre: "Sci-Fi", rating: 8.7 },
  { id: 4, title: "The Crown", creator: "Peter Morgan", seasons: 6, startYear: 2016, endYear: 2023, genre: "Historical Drama", rating: 8.7 },
  { id: 5, title: "The Office", creator: "Greg Daniels", seasons: 9, startYear: 2005, endYear: 2013, genre: "Comedy", rating: 8.9 }
];

let songs = [
  { id: 1, title: "Bohemian Rhapsody", artist: "Queen", album: "A Night at the Opera", year: 1975, genre: "Rock", duration: "5:55" },
  { id: 2, title: "Billie Jean", artist: "Michael Jackson", album: "Thriller", year: 1982, genre: "Pop", duration: "4:54" },
  { id: 3, title: "Imagine", artist: "John Lennon", album: "Imagine", year: 1971, genre: "Pop", duration: "3:03" },
  { id: 4, title: "Shape of You", artist: "Ed Sheeran", album: "÷", year: 2017, genre: "Pop", duration: "3:53" },
  { id: 5, title: "Despacito", artist: "Luis Fonsi ft. Daddy Yankee", album: "VIDA", year: 2017, genre: "Reggaeton", duration: "3:47" }
];

// Helper function to parse request body
const getRequestBody = (req) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      if (chunks.length) {
        const data = Buffer.concat(chunks).toString();
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(new Error('Invalid JSON'));
        }
      } else {
        resolve({});
      }
    });
    req.on('error', reject);
  });
};

// Create and configure the server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;
  
  // Set common headers
  res.setHeader('Content-Type', 'application/json');
  
  try {
    // Handle routes based on path and method
    if (path === '/movies') {
      handleMediaRoute(req, res, method, movies, (data) => movies = data);
    } else if (path === '/series') {
      handleMediaRoute(req, res, method, series, (data) => series = data);
    } else if (path === '/songs') {
      handleMediaRoute(req, res, method, songs, (data) => songs = data);
    } else {
      // 404 for any other route
      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'Resource not found' }));
    }
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Internal server error', message: error.message }));
  }
});

// Function to handle media routes (movies, series, songs)
async function handleMediaRoute(req, res, method, dataArray, updateDataCallback) {
  switch (method) {
    case 'GET':
      // Return the entire array
      res.statusCode = 200;
      res.end(JSON.stringify(dataArray));
      break;
      
    case 'POST':
      try {
        // Add a new item
        const newItem = await getRequestBody(req);
        if (!newItem || Object.keys(newItem).length === 0) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'No data provided' }));
          return;
        }
        
        // Generate a new ID
        const newId = Math.max(...dataArray.map(item => item.id), 0) + 1;
        newItem.id = newId;
        
        // Add to array
        const updatedData = [...dataArray, newItem];
        updateDataCallback(updatedData);
        
        res.statusCode = 201;
        res.end(JSON.stringify(updatedData));
      } catch (error) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Invalid request data', message: error.message }));
      }
      break;
      
    case 'PUT':
      try {
        // Update an existing item
        const updatedItem = await getRequestBody(req);
        if (!updatedItem || !updatedItem.id) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Invalid data or missing ID' }));
          return;
        }
        
        const index = dataArray.findIndex(item => item.id === updatedItem.id);
        
        if (index === -1) {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'Item not found' }));
          return;
        }
        
        // Update the item
        const updatedData = [...dataArray];
        updatedData[index] = updatedItem;
        updateDataCallback(updatedData);
        
        res.statusCode = 200;
        res.end(JSON.stringify(updatedData));
      } catch (error) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Invalid request data', message: error.message }));
      }
      break;
      
    case 'DELETE':
      try {
        // Delete an item
        const { id } = await getRequestBody(req);
        
        if (!id) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Missing ID' }));
          return;
        }
        
        const initialLength = dataArray.length;
        const updatedData = dataArray.filter(item => item.id !== id);
        
        if (updatedData.length === initialLength) {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'Item not found' }));
          return;
        }
        
        updateDataCallback(updatedData);
        
        res.statusCode = 200;
        res.end(JSON.stringify(updatedData));
      } catch (error) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Invalid request data', message: error.message }));
      }
      break;
      
    default:
      // Method not allowed
      res.statusCode = 405;
      res.end(JSON.stringify({ error: 'Method not allowed' }));
  }
}

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
