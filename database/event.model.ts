import mongoose, { Schema, Document, Model } from "mongoose";
import slugify from "slugify";

// Event interface with strong typing
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, required: true, trim: true },
    overview: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    mode: { type: String, required: true, trim: true },
    audience: { type: String, required: true, trim: true },
    agenda: { type: [String], required: true },
    organizer: { type: String, required: true, trim: true },
    tags: { type: [String], required: true },
  },
  {
    timestamps: true,
    strict: true,
  }
);

EventSchema.pre<IEvent>("save", async function (this: IEvent) {
  // Generate slug only if title is modified
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  // Normalize date to ISO format
  if (this.isModified("date")) {
    const parsedDate = new Date(this.date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error("Invalid date format. Use YYYY-MM-DD.");
    }
    this.date = parsedDate.toISOString().split("T")[0];
  }

  // Normalize time to HH:MM (24h) format
  if (this.isModified("time")) {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(this.time)) {
      throw new Error("Invalid time format. Use HH:MM in 24-hour format.");
    }
  }

  // Validate required fields are non-empty
  const requiredFields: (keyof IEvent)[] = [
    "title","description","overview","image","venue","location","date","time","mode","audience","agenda","organizer","tags"
  ];
  for (const field of requiredFields) {
    if (
      this[field] === undefined ||
      this[field] === null ||
      (Array.isArray(this[field]) ? (this[field] as string[]).length === 0 : String(this[field]).trim() === "")
    ) {
      throw new Error(`Field '${field}' is required and cannot be empty.`);
    }
  }
});

const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);

export default Event;