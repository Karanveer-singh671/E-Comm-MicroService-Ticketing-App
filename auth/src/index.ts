import mongoose from "mongoose";
import { app } from "./app";
const start = async () => {
	console.log("Starting up...");
	// do this check so know when we do deploy that something is wrong not after when applicaton has been running for some time
	if (!process.env.JWT_KEY) {
		throw new Error("JWT_KEY must be defined in yaml file");
	}
	if (!process.env.MONGO_URI) {
		throw new Error("Mongo_URI must be defined");
	}
	try {
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});
		console.log("Connected to MongoDb");
	} catch (err) {
		console.error(err);
	}

	app.listen(3000, () => {
		console.log("Listening on port 3000!!!!!!!!");
	});
};

start();
