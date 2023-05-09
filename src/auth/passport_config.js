const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport, getUserByEmail, getUserById) {

    const users = async (email, password, done) => {
        // get by EMAIL
        const user = await getUserByEmail(email);
        if(user == null)
            return done(null, false, { message: "No user was found on this email" });
        try {
            await bcrypt.compare(password, user.password, function(err, result) {
                if(result) 
                    return done(null, user);
                else 
                    return done(null, false, { message: "Wrong password." })
            })
                
        } catch (e) {
            console.log(e);
            return done(e);
        }
    }

    passport.use(new LocalStrategy({usernameField: "email"}, users));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((uuid, done) => {
        return done(null, getUserById(uuid))
    });
}

module.exports = initialize