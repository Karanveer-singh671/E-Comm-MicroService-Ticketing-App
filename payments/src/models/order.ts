import mongoose from "mongoose";
import { OrderStatus } from "@ksticketing/common";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// list of properties when building order
interface OrderAttrs {
	id: string;
	version: number;
	userId: string;
	price: number;
	status: OrderStatus;
}
// list of properties order has
interface OrderDoc extends mongoose.Document {
	version: number;
	userId: string;
	price: number;
	status: OrderStatus;
}

// custom methods
interface OrderModel extends mongoose.Model<OrderDoc> {
	build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			required: true,
			// must be one of the OrderStatus values
			enum: Object.values(OrderStatus),
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

orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.build = (attrs: OrderAttrs) => {
	return new Order({
		_id: attrs.id,
		version: attrs.version,
		price: attrs.price,
		userId: attrs.userId,
		status: attrs.status,
	});
};
// collection called 'Order' within the mongoose db in payment service
const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
