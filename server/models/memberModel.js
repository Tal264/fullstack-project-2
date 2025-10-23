const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true }
  },
  { versionKey: false }
);

memberSchema.set("toJSON", {
  virtuals: true,
  transform: (_, ret) => {
    ret.id = ret._id.toHexString();
    delete ret._id;
  }
});

const Member = mongoose.model("Member", memberSchema);
module.exports = Member;
