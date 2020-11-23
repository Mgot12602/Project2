const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
  },
  password: String,

  name: String,
  surname: String,
  taxId: String,
  companyName: String,
  receipts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Receipt",
    },
  ],
  rides: [
    {
      type: Schema.Types.ObjectId,
      ref: "Receipt",
    },
  ],
});

const User = model("User", userSchema);

module.exports = User;
