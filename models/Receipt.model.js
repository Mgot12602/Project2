const { Schema, model } = require("mongoose");

const receiptSchema = new Schema({
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: [
      "work euipment",
      "workspace",
      "car",
      "hardware",
      "software",
      "catering",
      "other",
    ],
  },
  date: {
    type: Date,
    default: new Date(),
  },
  amount: Number,
  comment: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Receipt = model("Receipt", receiptSchema);

module.exports = Receipt;
