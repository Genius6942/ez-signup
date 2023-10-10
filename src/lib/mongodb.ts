import { env } from '$env/dynamic/private';
import { MongoClient, ServerApiVersion } from 'mongodb';
import type { OptionalId, Document, WithId } from 'mongodb';
// Replace the placeholder with your Atlas connection string
const uri = env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true
	}
});
let connecting: boolean | Promise<MongoClient> = true;

(async () => {
	// Connect to the MongoDB cluster
	connecting = client.connect();
	await connecting;
	connecting = false;
})();

export const query = async <T = any>(collection: string, query: any) => {
	if (connecting) await connecting;
	return (await client.db('main').collection(collection).find(query).toArray()) as WithId<T>[];
};

export const update = async <T = any>(collection: string, query: any, update: any) => {
	if (connecting) await connecting;
	return (await client.db('main').collection(collection).updateOne(query, update)) as T;
};

export const insert = async <T = {}>(collection: string, doc: T) => {
	if (connecting) await connecting;
	return await client
		.db('main')
		.collection(collection)
		.insertOne(doc as OptionalId<Document>);
};

export const updateOrInsert = async <T = any>(collection: string, search: any, set: any) => {
	if (connecting) await connecting;
	const queryRes = await query(collection, search);
	if (queryRes.length > 0) {
		return await update(collection, search, { $set: { ...set } });
	} else {
		return await insert(collection, set);
	}
};
