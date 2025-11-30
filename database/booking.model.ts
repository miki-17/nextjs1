import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { Event } from "./event.model";

export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true, index: true },
    email: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (v: string) =>
          /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/.test(v),
        message: "Invalid email format."
      }
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

BookingSchema.pre<IBooking>("save", async function (this: IBooking) {
  const eventExists = await Event.exists({ _id: this.eventId });
  if (!eventExists) {
    throw new Error("Referenced event does not exist.");
  }
});

// Export Booking model
export const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
