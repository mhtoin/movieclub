import { MongoClient } from 'mongodb'
import 'dotenv/config'

declare global {
    namespace globalThis {
        var _mongoClientPromise: Promise<MongoClient>
    }
}

if (!process.env.MONGODB_URI) {
    throw new Error('Invalid environment variable: MONGODB_URI')
}

const uri = process.env.MONGODB_URI
const options = {}

let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options)
        global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
} else {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
}

export default clientPromise