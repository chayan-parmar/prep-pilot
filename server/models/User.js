const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        role: {
            type: String,
            enum: ["student", "admin"],
            default: "student",
        },
        profileImage: {
            type: String,
            default: "",
        },
        resume: {
            type: String,
            default: "",
        },
        targetRole: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model("user", userSchema);

