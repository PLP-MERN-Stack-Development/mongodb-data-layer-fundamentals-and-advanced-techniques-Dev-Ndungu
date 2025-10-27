# MongoDB Fundamentals - Week 1

## Setup Instructions

Before you begin this assignment, please make sure you have the following installed:

1. **MongoDB Community Edition** - [Installation Guide](https://www.mongodb.com/docs/manual/administration/install-community/)
2. **MongoDB Shell (mongosh)** - This is included with MongoDB Community Edition
3. **Node.js** - [Download here](https://nodejs.org/)

### Node.js Package Setup

Once you have Node.js installed, run the following commands in your assignment directory:

```bash
# Initialize a package.json file
npm init -y

# Install the MongoDB Node.js driver
npm install mongodb
```

## Assignment Overview

This week focuses on MongoDB fundamentals including:
- Creating and connecting to MongoDB databases
- CRUD operations (Create, Read, Update, Delete)
- MongoDB queries and filters
- Aggregation pipelines
- Indexing for performance

## Submission

Complete all the exercises in this assignment and push your code to GitHub using the provided GitHub Classroom link.

## Getting Started

1. Accept the GitHub Classroom assignment invitation
2. Clone your personal repository that was created by GitHub Classroom
3. Install MongoDB locally or set up a MongoDB Atlas account
4. Run the provided `insert_books.js` script to populate your database
5. Complete the tasks in the assignment document

## Files Included

- `Week1-Assignment.md`: Detailed assignment instructions
- `insert_books.js`: Script to populate your MongoDB database with sample book data
 - `queries.js`: File containing all MongoDB queries, aggregation pipelines, index creation, and explain() examples for the assignment

## How to run the scripts added for this assignment

1. Install dependencies (if you haven't already):

```bash
npm install
```

2. Populate the database (this will drop the `books` collection if it already exists and insert sample data):

```powershell
node insert_books.js
```

3. Run the read/demo queries (non-destructive):

```powershell
node queries.js
```

4. Notes about destructive operations and indexes:
- `queries.js` includes `runDestructiveExamples()` which contains update and delete examples; it is commented out by default—uncomment to run.
- To see index creation and performance comparison using `explain()`, uncomment the call to `demoExplain()` inside `queries.js`.

5. If you are using MongoDB Atlas, set the `MONGO_URI` environment variable before running scripts. In PowerShell:

```powershell
$env:MONGO_URI = "your-atlas-connection-string"
node queries.js
```

6. Submission checklist (what to push to GitHub):
 - `insert_books.js` (script used to populate the DB)
 - `queries.js` (all required queries and pipelines)
 - `README.md` (this file with run instructions)
 - A screenshot of your MongoDB Compass or Atlas showing the `plp_bookstore` database and `books` collection with sample data


## Requirements

- Node.js (v18 or higher)
- MongoDB (local installation or Atlas account)
- MongoDB Shell (mongosh) or MongoDB Compass

## Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB University](https://university.mongodb.com/)
- [MongoDB Node.js Driver](https://mongodb.github.io/node-mongodb-native/) 