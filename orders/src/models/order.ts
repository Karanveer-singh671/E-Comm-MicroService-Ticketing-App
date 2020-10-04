import mongoose, { mongo } from "mongoose";
import { OrderStatus } from "@ksticketing/common";

interface OrderAttrs {
	userId: string;
	status: OrderStatus;
	expiresAt: Date;
	ticket: TicketDoc; // ref/ population feature
}

interface OrderDoc extends mongoose.Document {
	userId: string;
	status: OrderStatus;
	expiresAt: Date;
	ticket: TicketDoc;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
	build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			required: true,
			enum: Object.values(OrderStatus), // mongoose will set to one of the values in the enum
			default: OrderStatus.Created
		},
		expiresAt: {
			type: mongoose.Schema.Types.Date, // not required since once purchase ticket will not want it to expire
		},
		ticket: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Ticket",
		},
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
			},
		},
	}
);

orderSchema.statics.build = (attrs: OrderAttrs) => {
	return new Order(attrs);
};
// generic type and then name of collection
const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
