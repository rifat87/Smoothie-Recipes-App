const mongoose = require('mongoose')
const { isEmail } = require('validator') // check how validator package works
const bcrypt = require('bcrypt')

userSchema = new mongoose.Schema({
    email: {
        type: String, // the type of the email is always string
        required: [true, 'Please enter an email'], // iif the user sends wrong email format then we are going to send thi error message
        unique: true,
        lowercase: true,
        // here val is the email and we are gong to use validator a third party package
        validate: [/*(val) => { } // insteade of using this we used the isEmail which does the same thing*/ isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        reuired: [true, 'Please enter an password'],
        minlength: [6, 'Minimum password length is 6 characters']
    },
})

//fire a function after doc saved to db ., THIS is call hooking in mongodb
userSchema.post('save', function( doc, next) {
    console.log('new user was created & saved', doc)
    next()
});

//fire a function before doc saved to db
userSchema.pre('save', async function( next) {
    const salt = await bcrypt.genSalt()
    // console.log(salt)
    // console.log(this.password)
    this.password = await bcrypt.hash(this.password, salt)
    next()
});
//static method to login user
//The login function you've defined is a static method because it doesn't operate on a specific user document. It takes email and password as arguments and attempts to find a user with that email in the collection.
userSchema.statics.login = async function(email, password){
    const user = await this.findOne({ email })

    if(user) {
        const auth = await bcrypt.compare(password, user.password)
        if(auth){
            return user;
        }throw Error('incorrect password')
    }throw Error('incorrect email')
}

const User = mongoose.model('user', userSchema) // this use must have to be singular because mongoose automatically plurarize it

module.exports = User;
