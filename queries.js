// queries.js
// A collection of MongoDB queries and aggregation pipelines for the Week 1 assignment.
//
// Usage:
// 1. Set MONGO_URI environment variable if you're using Atlas, e.g.:
//    setx MONGO_URI "your-atlas-connection-string"
// 2. Install dependencies: npm install mongodb
// 3. Run examples (they will connect to the `plp_bookstore` database):
//    node queries.js
//
// The script exposes functions for each required task. By default `main()` runs
// a safe demonstration that lists results. Destructive operations (update/delete)
// are included as functions and invoked in `runDestructiveExamples()` which is
// commented out by default. Uncomment to run them.

const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = 'plp_bookstore';
const collectionName = 'books';

async function withCollection(fn) {
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  try {
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection(collectionName);
    return await fn(col, db);
  } finally {
    await client.close();
  }
}

// Task 2: Basic CRUD operations
async function findByGenre(genre, projection = { title: 1, author: 1, price: 1 }) {
  return withCollection(col => col.find({ genre }).project(projection).toArray());
}

async function findPublishedAfter(year, projection = { title: 1, author: 1, published_year: 1 }) {
  return withCollection(col => col.find({ published_year: { $gt: year } }).project(projection).toArray());
}

async function findByAuthor(author, projection = { title: 1, genre: 1, price: 1 }) {
  return withCollection(col => col.find({ author }).project(projection).toArray());
}

async function updatePriceByTitle(title, newPrice) {
  return withCollection(col => col.updateOne({ title }, { $set: { price: newPrice } }));
}

async function deleteByTitle(title) {
  return withCollection(col => col.deleteOne({ title }));
}

// Task 3: Advanced Queries
async function findInStockAndPublishedAfter(year, projection = { title: 1, author: 1, published_year: 1, in_stock: 1 }) {
  return withCollection(col => col.find({ in_stock: true, published_year: { $gt: year } }).project(projection).toArray());
}

async function sortByPrice(order = 'asc', projection = { title: 1, price: 1 }) {
  const dir = order === 'asc' ? 1 : -1;
  return withCollection(col => col.find({}).project(projection).sort({ price: dir }).toArray());
}

async function paginate(page = 1, perPage = 5, projection = { title: 1, author: 1, price: 1 }) {
  const skip = (page - 1) * perPage;
  return withCollection(col => col.find({}).project(projection).skip(skip).limit(perPage).toArray());
}

// Task 4: Aggregation Pipelines
async function aggregateAvgPriceByGenre() {
  const pipeline = [
    { $group: { _id: '$genre', averagePrice: { $avg: '$price' }, count: { $sum: 1 } } },
    { $sort: { averagePrice: -1 } }
  ];
  return withCollection(col => col.aggregate(pipeline).toArray());
}

async function aggregateAuthorWithMostBooks() {
  const pipeline = [
    { $group: { _id: '$author', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 }
  ];
  return withCollection(col => col.aggregate(pipeline).toArray());
}

async function aggregateGroupByDecade() {
  // Create a decade field like 1990, 2000 etc.
  const pipeline = [
    { $project: { decade: { $multiply: [{ $floor: { $divide: ['$published_year', 10] } }, 10] } } },
    { $group: { _id: '$decade', count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ];
  return withCollection(col => col.aggregate(pipeline).toArray());
}

// Task 5: Indexing and explain
async function createIndexes() {
  return withCollection(async (col) => {
    const titleIndex = await col.createIndex({ title: 1 });
    const authorYearIndex = await col.createIndex({ author: 1, published_year: -1 });
    return { titleIndex, authorYearIndex };
  });
}

async function explainFindByTitle(title) {
  return withCollection(col => col.find({ title }).explain('executionStats'));
}

// A safe demonstration that prints examples of non-destructive queries
async function demoReads() {
  console.log('\nFind 1: Books in genre "Fiction" (projection title/author/price)');
  console.log(await findByGenre('Fiction'));

  console.log('\nFind 2: Books published after 2000');
  console.log(await findPublishedAfter(2000));

  console.log('\nFind 3: Books by George Orwell');
  console.log(await findByAuthor('George Orwell'));

  console.log('\nAdvanced Query: In stock & published after 2010');
  console.log(await findInStockAndPublishedAfter(2010));

  console.log('\nSorting: books by price ascending (top)');
  console.log(await sortByPrice('asc'));

  console.log('\nPagination: page 1 (5 per page)');
  console.log(await paginate(1, 5));

  console.log('\nAggregation: average price by genre');
  console.log(await aggregateAvgPriceByGenre());

  console.log('\nAggregation: author with most books');
  console.log(await aggregateAuthorWithMostBooks());

  console.log('\nAggregation: group books by decade and count');
  console.log(await aggregateGroupByDecade());
}

// Destructive examples (update/delete) - commented out by default. Uncomment to run.
async function runDestructiveExamples() {
  console.log('\nUpdating price of "The Alchemist" to 12.99');
  console.log(await updatePriceByTitle('The Alchemist', 12.99));

  console.log('\nDeleting book titled "Moby Dick"');
  console.log(await deleteByTitle('Moby Dick'));
}

// Demonstrate explain() before and after indexes
async function demoExplain(title = 'The Hobbit') {
  console.log('\nExplain before creating indexes for title query:');
  console.log(await explainFindByTitle(title));

  console.log('\nCreating indexes...');
  console.log(await createIndexes());

  console.log('\nExplain after creating indexes for title query:');
  console.log(await explainFindByTitle(title));
}

// Main entry - runs non-destructive demos. Adjust or call functions directly as needed.
async function main() {
  try {
    await demoReads();
    // To see explain() results and index creations, uncomment the following line:
    // await demoExplain();

    // To run updates/deletes uncomment the following line (destructive):
    // await runDestructiveExamples();
  } catch (err) {
    console.error('Error in queries.js:', err);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  findByGenre,
  findPublishedAfter,
  findByAuthor,
  updatePriceByTitle,
  deleteByTitle,
  findInStockAndPublishedAfter,
  sortByPrice,
  paginate,
  aggregateAvgPriceByGenre,
  aggregateAuthorWithMostBooks,
  aggregateGroupByDecade,
  createIndexes,
  explainFindByTitle,
};
