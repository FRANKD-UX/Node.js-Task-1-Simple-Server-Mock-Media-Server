// server.js
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const dataManager = require('./dataManager');

// Initialize the data files when the server starts
dataManager.initializeDataFiles();

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

// Function to serve the HTML documentation page
const serveDocumentationPage = (res) => {
  const filePath = path.join(__dirname, 'public', 'index.html');
  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(content);
  });
};

// Function to handle media routes (movies, series, songs)
async function handleMediaRoute(req, res, method, dataType) {
  switch (method) {
    case 'GET':
      // Return the entire array
      const data = dataManager.getData(dataType);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
      break;
      
    case 'POST':
      try {
        // Add a new item
        const newItem = await getRequestBody(req);
        if (!newItem || Object.keys(newItem).length === 0) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'No data provided' }));
          return;
        }
        
        const updatedData = dataManager.addItem(dataType, newItem);
        
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(updatedData));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request data', message: error.message }));
      }
      break;
      
    case 'PUT':
      try {
        // Update an existing item
        const updatedItem = await getRequestBody(req);
        if (!updatedItem || !updatedItem.id) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid data or missing ID' }));
          return;
        }
        
        const result = dataManager.updateItem(dataType, updatedItem);
        
        if (result.error) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: result.error }));
          return;
        }
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result.data));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request data', message: error.message }));
      }
      break;
      
    case 'DELETE':
      try {
        // Delete an item
        const { id } = await getRequestBody(req);
        
        if (!id) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing ID' }));
          return;
        }
        
        const result = dataManager.deleteItem(dataType, id);
        
        if (result.error) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: result.error }));
          return;
        }
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result.data));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request data', message: error.message }));
      }
      break;
      
    default:
      // Method not allowed
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method not allowed' }));
  }
}

// Create and configure the server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;
  
  try {
    // Handle routes based on path and method
    if (path === '/') {
      // Serve the API documentation page
      serveDocumentationPage(res);
    } else if (path === '/movies') {
      handleMediaRoute(req, res, method, 'movies');
    } else if (path === '/series') {
      handleMediaRoute(req, res, method, 'series');
    } else if (path === '/songs') {
      handleMediaRoute(req, res, method, 'songs');
    } else {
      // 404 for any other route
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Resource not found' }));
    }
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal server error', message: error.message }));
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API documentation available at http://localhost:${PORT}/`);
});
