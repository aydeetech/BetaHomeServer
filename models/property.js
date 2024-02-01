const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ManagerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  whatsappNumber: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default:
      "https://static-00.iconduck.com/assets.00/avatar-default-symbolic-icon-479x512-n8sg74wg.png",
  },
});

const propertySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    media: {
      images: {
        type: [String],
      },
      video: {
        type: String,
      },
    },
    location: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    propertyType: {
      type: String,
      default: "house",
      enum: ["house", "land"],
    },

    tags: {
      type: String,
      enum: ["luxury", "affordable", "comfortable", "spacious"],
    },

    propertyStatus: {
      type: String,
      required: true,
      default: "available",
      enum: ["available", "sold"],
    },

    bathroom: {
      type: Number,
      default: 0,
      min: 0,
    },
    bedroom: {
      type: Number,
      default: 0,
      min: 0,
    },
    garage: {
      type: Boolean,
      default: false,
    },
    lot: {
      type: Number,
    },
    squareFeet: {
      type: Number,
      min: 0,
    },

    salesSupport: ManagerSchema,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);
