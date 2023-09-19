import mongoose from "mongoose";

const connect = async () => {
  try {
    const connectionURL = process.env.MONGO_URL!;
    return mongoose.connect(connectionURL);
  } catch (e) {
    console.log(e);
    return e;
  }
};

export default connect;
