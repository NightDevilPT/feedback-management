import mongoose, { Document, Schema, Types } from "mongoose";

export enum FeedbackCategory {
  SUGGESTION = "suggestion",
  BUG = "bug",
  FEATURE = "feature",
}

export enum FeedbackStatus {
  OPEN = "open",
  IN_PROGRESS = "in-progress",
  RESOLVED = "resolved",
}


interface IFeedback extends Document {
  raisedBy: Types.ObjectId;
  rating: number;
  comment: string;
  type: FeedbackCategory;
  category: FeedbackCategory;
  status: FeedbackStatus;
  createdAt: Date;
  updatedAt: Date;
}

const feedbackSchema = new Schema<IFeedback>(
  {
    raisedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },
    type: {
      type: String,
      enum: Object.values(FeedbackCategory), // using the same enum as category
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: Object.values(FeedbackCategory),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(FeedbackStatus),
      default: FeedbackStatus.OPEN,
      required: true,
    },
  },
  {
    timestamps: true, // <-- Automatically adds createdAt and updatedAt
  }
);

// Indexes
// In Feedback model
feedbackSchema.index({ raisedBy: 1 });
feedbackSchema.index({ createdAt: 1 });
feedbackSchema.index({ updatedAt: 1 });
feedbackSchema.index({ rating: 1 });
feedbackSchema.index({ status: 1, category: 1 });

export const Feedback = mongoose.model<IFeedback>("Feedback", feedbackSchema);
