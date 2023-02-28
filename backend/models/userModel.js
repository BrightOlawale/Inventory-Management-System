const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name cannot be blank"]
        },
        email: {
            type: String,
            required: [true, "Please provide a valid email address"],
            unique: true,
            trim: true,
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                "Please provide a valid email address"
            ]
        },
        password: {
            type: String,
            required: [true, "Please create a strong password"],
            minLength: [8, "Password must be up to 8 characters"]
        },
        picture: {
            type: String,
            default: "",
            // required: [true, "Provide a profile picture"]
        },
        phone: {
            type: String,
            default: ""
        },
        bio: {
            type: String,
            default: "Bio",
            maxLength: [100, "Bio should not be over 100 characters"]
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function (next) {
    if (!(this.isModified("password"))){
        return next();
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next()
})

const User = mongoose.model("user", userSchema);

module.exports = User;