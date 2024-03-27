'use-strict'

const User = require("../models/User")

module.exports = {
    createUser: (req, res) => {
        User.create(req.body)
            .then(user => {
                sign(user.id)
                    .then((token) => ({ token, user: user.view(true) }))
                    .then(success(res, 201))
            })
            .catch((err) => {
                /* istanbul ignore else */
                if (err.name === 'MongoError' && err.code === 11000) {
                    res.status(409).json({
                        valid: false,
                        param: 'email',
                        message: 'email already registered'
                    })
                } else {
                    next(err)
                }
            })
    }
}