// dataManager.js
const fs = require('fs');
const path = require('path');

// Define paths for data files
const DATA_DIR = path.join(__dirname, 'data');
const MOVIES_FILE = path.join(DATA_DIR, 'movies.json');
const SERIES_FILE = path.join(DATA_DIR, 'series.json');
const SONGS_FILE = path.join(DATA_DIR, 'songs.json');

// Sample data
const sampleData = {
  movies: [
    { id: 1, title: "Inception", director: "Christopher Nolan", year: 2010, genre: "Sci-Fi", rating: 8.8 },
    { id: 2, title: "The Shawshank Redemption", director: "Frank Darabont", year: 1994, genre: "Drama", rating: 9.3 },
    { id: 3, title: "The Dark Knight", director: "Christopher Nolan", year: 2008, genre: "Action", rating: 9.0 },
    { id: 4, title: "Pulp Fiction", director: "Quentin Tarantino", year: 1994, genre: "Crime", rating: 8.9 },
    { id: 5, title: "Forrest Gump", director: "Robert Zemeckis", year: 1994, genre: "Drama", rating: 8.8 }
  ],
  series: [
    { id: 1, title: "Breaking Bad", creator: "Vince Gilligan", seasons: 5, startYear: 2008, endYear: 2013, genre: "Crime Drama", rating: 9.5 },
    { id: 2, title: "Game of Thrones", creator: "David Benioff, D.B. Weiss", seasons: 8, startYear: 2011, endYear: 2019, genre: "Fantasy", rating: 9.2 },
    { id: 3, title: "Stranger Things", creator: "The Duffer Brothers", seasons: 4, startYear: 2016, endYear: null, genre: "Sci-Fi", rating: 8.7 },
    { id: 4, title: "The Crown", creator: "Peter Morgan", seasons: 6, startYear: 2016, endYear: 2023, genre: "Historical Drama", rating: 8.7 },
    { id: 5, title: "The Office", creator: "Greg Daniels", seasons: 9, startYear: 2005, endYear: 2013, genre: "Comedy", rating: 8.9 }
  ],
  songs: [
    { id: 1, title: "Bohemian Rhapsody", artist: "Queen", album: "A Night at the Opera", year: 1975, genre: "Rock", duration: "5:55" },
    { id: 2, title: "Billie Jean", artist: "Michael Jackson", album: "Thriller", year: 1982, genre: "Pop", duration: "4:54" },
    { id: 3, title: "Imagine", artist: "John Lennon", album: "Imagine", year: 1971, genre: "Pop", duration: "3:03" },
    { id: 4, title: "Shape of You", artist: "Ed Sheeran", album: "÷", year: 2017, genre: "Pop", duration: "3:53" },
    { id: 5, title: "Despacito", artist: "Luis Fonsi ft. Daddy Yankee", album: "VIDA", year: 2017, genre: "Reggaeton", duration: "3:47" }
  ]
};

// Function to ensure data directory exists
const ensureDataDirectoryExists = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log(`Created data directory at ${DATA_DIR}`);
  }
};

// Function to initialize data files
const initializeDataFiles = () => {
  ensureDataDirectoryExists();
  
  // Initialize movies file if it doesn't exist
  if (!fs.existsSync(MOVIES_FILE)) {
    fs.writeFileSync(MOVIES_FILE, JSON.stringify(sampleData.movies, null, 2));
    console.log(`Created movies data file with sample data at ${MOVIES_FILE}`);
  }
  
  // Initialize series file if it doesn't exist
  if (!fs.existsSync(SERIES_FILE)) {
    fs.writeFileSync(SERIES_FILE, JSON.stringify(sampleData.series, null, 2));
    console.log(`Created series data file with sample data at ${SERIES_FILE}`);
  }
  
  // Initialize songs file if it doesn't exist
  if (!fs.existsSync(SONGS_FILE)) {
    fs.writeFileSync(SONGS_FILE, JSON.stringify(sampleData.songs, null, 2));
    console.log(`Created songs data file with sample data at ${SONGS_FILE}`);
  }
};

// Function to get the appropriate file path for a data type
const getFilePath = (dataType) => {
  switch (dataType) {
    case 'movies':
      return MOVIES_FILE;
    case 'series':
      return SERIES_FILE;
    case 'songs':
      return SONGS_FILE;
    default:
      throw new Error(`Invalid data type: ${dataType}`);
  }
};

// Function to read data from a file
const getData = (dataType) => {
  const filePath = getFilePath(dataType);
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${dataType} data:`, error);
    return [];
  }
};

// Function to write data to a file
const saveData = (dataType, data) => {
  const filePath = getFilePath(dataType);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error saving ${dataType} data:`, error);
    return false;
  }
};

// Function to add a new item
const addItem = (dataType, newItem) => {
  const data = getData(dataType);
  
  // Generate a new ID
  const newId = Math.max(...data.map(item => item.id), 0) + 1;
  newItem.id = newId;
  
  // Add to array
  const updatedData = [...data, newItem];
  saveData(dataType, updatedData);
  
  return updatedData;
};

// Function to update an existing item
const updateItem = (dataType, updatedItem) => {
  const data = getData(dataType);
  const index = data.findIndex(item => item.id === updatedItem.id);
  
  if (index === -1) {
    return { error: 'Item not found' };
  }
  
  // Update the item
  const updatedData = [...data];
  updatedData[index] = updatedItem;
  saveData(dataType, updatedData);
  
  return { data: updatedData };
};

// Function to delete an item
const deleteItem = (dataType, id) => {
  const data = getData(dataType);
  const initialLength = data.length;
  const updatedData = data.filter(item => item.id !== id);
  
  if (updatedData.length === initialLength) {
    return { error: 'Item not found' };
  }
  
  saveData(dataType, updatedData);
  return { data: updatedData };
};

module.exports = {
  initializeDataFiles,
  getData,
  addItem,
  updateItem,
  deleteItem
};
