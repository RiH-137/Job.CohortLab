import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, "Name must cotain at least 3 characters."],
    maxLength: [50, "Name cannot exceed more than 50 characters."],
  },
  email: {
    type: String,
    required: true,
    validate: [
        {
            validator: function (value) {
              return validator.isEmail(value);
            },
            message: "Please provide a valid email.",
          },
          {
            validator: function (value) {
                if (this.role === "Employer") {
                    return value.includes("cohortlab");
                }
            },
            message: "You are not allowed to register.",
          },
    ],
  },


  phone: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  niches: {
    firstNiche: String,
    secondNiche: String,
    thirdNiche: String,
  },
  password: {
    type: String,
    required: true,
    minLength: [8, "Password must cantain at least 8 chatacters."],
    maxLength: [32, "Password cannot exceed 32 characters."],
    select: false
  },
  resume: {
    public_id: String,
    url: String,
  },
  coverLetter: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    enum: ["Job Seeker", "Employer"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


// make the password hide of the user in the database
// making the password hash
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});


// compare the password with the entered password and the password(hashed) in the database
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


// generate JWT tokens
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};



export const User = mongoose.model("User", userSchema); 