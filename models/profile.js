const mongoose = require("mongoose");
const { default: isEmail } = require("validator/lib/isEmail");
const Schema = mongoose.Schema;

const profileSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      default: "admin",
    },

    lastName: {
      type: String,
      required: true,
      default: "admin",
    },

    email: {
        type: String,
        validate: [isEmail, "Provide Valid Password"],
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: [7, "Minimun Password length is 7"]
    },
    role: {
        type: String,
        default: "user",
        enum: ["admin", "user"],
        required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
