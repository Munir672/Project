import express from 'express';
import { client, connection } from './database/database.js';  // Import the database connection
import setupCollections from './schema/UserHobbySchema.js';
import { ObjectId } from 'mongodb';

const app = express();

// Middleware setup
app.use(express.static('public'));
app.use(express.json());

// Database connection
connection.then(() => {
  console.log("Successful connection to database!");

  // Access the database after the connection is successful
  const database = client.db('Project');  
  
  // Connect to the Users collection
  const usersCollection = database.collection('Users');
  const hobbiesCollection = database.collection('Hobbies');

  // Signup Route (POST request)
  app.post('/api/signup', async (req, res) => {
    console.log('Received signup request:', req.body); // Debugging message

    try {
      const { username, email } = req.body;
      if (!username || !email) {
        console.log('Username or email missing in the request'); // Debugging message
        return res.status(400).json({ message: 'Username and email are required.' });
      }

      // Check if the user already exists
      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        console.log('User already exists with this email:', email); // Debugging message
        return res.status(400).json({ message: 'User already exists with this email.' });
      }

      // Insert the new user
      const newUser = { username, email };
      const result = await usersCollection.insertOne(newUser);
      

      res.status(201).json({ message: 'User signed up successfully', result });
    } catch (error) {
      console.error('Error during signup:', error);
      res.status(500).json({ message: 'Error during signup', error });
    }
  });

  // Login Route (POST request)
  app.post('/api/login', async (req, res) => {
    console.log('Received login request:', req.body); // Debugging message
  
    const { username, email } = req.body;
  
    if (!username || !email) {
      console.log('Username or email missing in the request'); // Debugging message
      return res.status(400).json({ message: "Username and email are required." });
    }
  
    try {
      // Find the user by username and email
      const user = await usersCollection.findOne({ username, email });
  
      if (user) {
        console.log('Login successful for user:', username); // Debugging message
        // Login successful
        res.status(200).json({ message: 'Login successful', user });
      } else {
        console.log('Invalid login credentials:', username, email); // Debugging message
        // Invalid credentials
        res.status(400).json({ message: 'Invalid username or email.' });
      }
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Error during login', error });
    }
  });

  // --- Hobbies Routes ---

  // Add Hobby Route
  app.post('/api/hobbies', async (req, res) => {
    const { name, description, userId, progress } = req.body;
  
    console.log('Received add hobby request:', req.body); // Debugging message to see request body
  
    if (!name || !description || !userId) {
      console.error('Missing required fields (name, description, or userId)'); // Debugging message
      console.error(`missing ${userId}`);
      return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
      const newHobby = { name, description, userId, progress: progress || '' };
      const result = await hobbiesCollection.insertOne(newHobby);
      
    } catch (error) {
      console.error('Error adding hobby:', error); // Debugging message
      res.status(500).json({ message: 'Error adding hobby', error });
    }
  });
  

  // Get hobbies for a user
  app.get('/api/hobbies/:userId', async (req, res) => {
    const { userId } = req.params;
    console.log('Received get hobbies request for userId:', userId); // Debugging message

    try {
      const hobbies = await hobbiesCollection.find({ userId }).toArray();
      console.log('Fetched hobbies:', hobbies); // Debugging message
      res.status(200).json({ hobbies });
    } catch (error) {
      console.error('Error fetching hobbies:', error);
      res.status(500).json({ message: 'Error fetching hobbies', error });
    }
  });

  // Edit Hobby Route
  app.put('/api/hobbies/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, progress } = req.body;
    console.log('Received update hobby request for id:', id, 'with data:', req.body); // Debugging message

    if (!name || !description) {
      console.log('Missing name or description in update request'); // Debugging message
      return res.status(400).json({ message: "Name and description are required" });
    }

    try {
      const result = await hobbiesCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { name, description, progress } }
      );

      if (result.modifiedCount === 0) {
        console.log('No changes made to hobby with id:', id); // Debugging message
        return res.status(404).json({ message: 'Hobby not found or no changes made' });
      }

      console.log('Hobby updated successfully:', id); // Debugging message
      res.status(200).json({ message: 'Hobby updated successfully' });
    } catch (error) {
      console.error('Error updating hobby:', error);
      res.status(500).json({ message: 'Error updating hobby', error });
    }
  });

  // Delete Hobby Route
  app.delete('/api/hobbies/:id', async (req, res) => {
    const { id } = req.params;
    console.log('Received delete hobby request for id:', id); // Debugging message

    try {
      const result = await hobbiesCollection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        console.log('No hobby found with id:', id); // Debugging message
        return res.status(404).json({ message: 'Hobby not found' });
      }

      console.log('Hobby deleted successfully:', id); // Debugging message
      res.status(200).json({ message: 'Hobby deleted successfully' });
    } catch (error) {
      console.error('Error deleting hobby:', error);
      res.status(500).json({ message: 'Error deleting hobby', error });
    }
  });

}).catch(e => {
  console.error('Database connection failed:', e);
});

// Start the server
const server = app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  client.close();
  console.log("Closed database connection");
  process.exit(1);
});
