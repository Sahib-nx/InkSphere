import mongoose from 'mongoose'


const userSchema = mongoose.Schema({

    username: { type: String },
    email: { type: String },
    password: { type: String },

    blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]

},

    {
        timestamps: true
    }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);