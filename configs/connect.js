const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://talbinder1_db_user:Test1234%21@cluster0.jwqvxav.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    console.log("🟡 Connecting to MongoDB Atlas...");
    await client.connect();
    console.log("🟢 Connected! Sending ping...");
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error("❌ Connection failed:", err);
  } finally {
    await client.close();
    console.log("🔵 Connection closed.");
  }
}

run();
