import mongoose from "mongoose";
let NODE_ENV = 'dev'
interface ConnectionsType {
  isConnected: boolean | any;
}
const connection: ConnectionsType = {
  isConnected: false,
};
async function connect() {
  NODE_ENV = 'OS'
  if (connection.isConnected) {
    console.log("already connected");
    return 1;
  }
  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;
    if (connection.isConnected === 1) {
      console.log("use prev connection");
      return 1;
    }
    await mongoose.disconnect();
  }
  const db = await mongoose.connect('mongodb://127.0.0.1/bluehorde');
  console.log("new connection");
  connection.isConnected = db.connections[0].readyState;
}
async function disconnect() {
  if (connection.isConnected) {
    if (NODE_ENV === "production") {
      await mongoose.disconnect();
      connection.isConnected = false;
    }
  }
}
const database = { connect, disconnect };
export default database;
