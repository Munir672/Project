import { MongoClient, ServerApiVersion } from 'mongodb';


// Create a new MongoClient using the connection string from the environment variable
const client = new MongoClient(process.env.connection_string, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Establish the connection
const connection = client.connect();

// Export the connection and client for use in your app
export { client, connection };
