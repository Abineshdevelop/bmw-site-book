

// middlewares/userMiddleware.js

const isUserLoggedIn = (req, res, next) => {
    if (req.session.user) {
        next(); //user log give access
    } else {
        res.redirect('/user/login');
    }
};

const publicUserMiddleware = (req, res, next) => {
    if (req.session.user) {
        res.redirect('/user/home');
    } else {
        next();
    }
};

module.exports = {isUserLoggedIn,publicUserMiddleware};
