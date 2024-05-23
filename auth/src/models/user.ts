import mongoose from "mongoose";
import { Password } from "../services/password";

// An interface that describes the properties
// that are required to create a new User
interface UserAttrs {
	email: string;
	password: string;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
	build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
	email: string;
	password: string;
}

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
	},
	// take user document and turn into the following JSON  this way will not need to reformat JSON data in each route errorHandler
	// since if do .stringify and the object has a toJSON property will just run that, in mongo this is how it is implemented below
	// formatting responses so have a consistent design and react app will only need to know 1 implementation method for accessing it
	{
		toJSON: {
			// make direct changes to object -> remove password + format _id to id remove __v
			transform(doc, ret) {
				// since directly changing ret property need to assign new property id
				// remove old _id property
				ret.id = ret._id;
				delete ret._id;
				// won't receive password in response now!
				delete ret.password;
				delete ret.__v;
			},
		},
	}
);

userSchema.pre("save", async function (done) {
	if (this.isModified("password")) {
		const hashed = await Password.toHash(this.get("password"));
		this.set("password", hashed);
	}
	done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
	return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
