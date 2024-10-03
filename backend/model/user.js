import { Schema, model } from "mongoose"

const UserSchema = new Schema({
    username: String,
    firstName: String,
    lastName: String,
    email: String,
})

const User = model("User", UserSchema)

export default User