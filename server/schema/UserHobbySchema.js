const setupCollections = async (database) => {
    try {
        // Create the Users collection with schema validation
        await database.createCollection('Users', {
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: ['username', 'email'],
                    properties: {
                        username: { bsonType: 'string', minLength: 3, maxLength: 30 },
                        email: { bsonType: 'string', pattern: '^.+@.+\..+$' }
                    }
                }
            }
        });

        // Create the Hobbies collection with schema validation
        await database.createCollection('Hobbies', {
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: ['name', 'description', 'userId'],
                    properties: {
                        name: { bsonType: 'string', minLength: 3, maxLength: 100 },
                        description: { bsonType: 'string', minLength: 5 },
                        progress: { bsonType: 'string', maxLength: 500 },
                        userId: { bsonType: 'objectId' }
                    }
                }
            }
        });

        console.log("Collections setup successfully.");
    } catch (error) {
        console.error("Error setting up collections:", error);
        throw new Error('Failed to set up collections');
    }
};

export default setupCollections;
