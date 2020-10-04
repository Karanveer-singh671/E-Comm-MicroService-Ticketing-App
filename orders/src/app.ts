import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import mongoose from "mongoose";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@ksticketing/common";
import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";
import { indexOrderRouter } from "./routes/index";
import { deleteOrderRouter } from "./routes/delete";
const app = express();
// traffic is being proxy'd to our app thru ingress-nginx
// makes express aware of this and trust this proxy since default is not to trust
app.set("trust proxy", true);
app.use(json());
app.use(
	cookieSession({
		signed: false, // no encryption
		// says when we set equal to test it will be false else we require it to be true
		// to allow supertest to work since it doesn't send request thru https connection
		secure: process.env.NODE_ENV !== "test", // Https connection
	})
);
app.use(currentUser);
app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);
app.all("*", async (req, res) => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app }; // named export so use curly brace