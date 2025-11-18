const mongoose = require("mongoose");
 
const contactSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
  },
  favoriteColor: { type: String, required: true, trim: true },
  birthday: { type: String, required: true },
});
 
module.exports = mongoose.model("Contact", contactSchema, "contacts");