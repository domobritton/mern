const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const jsonwebtoken = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const validateRegistrationInput = require('../../validations/register');
const validateLoginInput = require('../../validations/login');

router.get('/current', passport.authenticate('jsonwebtoken', {session: false}, (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    })
}))

router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegistrationInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({
        email: req.body.email
    }).then(user => {
        if (user) {
            errors.email = 'User already exists';
            return res.status(400).json(errors);
        } else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            })
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => {
                            const payload = {
                                id: user.id,
                                name: user.name
                            };
                            jsonwebtoken.sign(payload, keys.secretOrKey, {
                                expiresIn: 3600
                            }, (err, token) => {
                                res.json({
                                    success: true,
                                    token: `Bearer ${token}`
                                });
                            });
                        })
                        .catch(err => console.log(err));
                });
            });
        }
    });
})


router.post('/login', (req, res) => {
        const {
            errors,
            isValid
        } = validateLoginInput(req.body);

        if (!isValid) {
            return res.status(400).json(errors);
        }

    const email = req.body.email;
    const password = req.body.password;
    User.findOne({
            email
        })
        .then(user => {
            if (!user) {
                errors.email = 'This user doesnt exist'
                return res.status(400).json(errors)
            }

            bcrypt.compare(password, user.password).then(isMatch => {
                if (isMatch) {
                    const payload = {
                        id: user.id,
                        name: user.name
                    }
                    jsonwebtoken.sign(payload, keys.secretOrKey, {
                        expiresIn: 3600
                    }, (err, token) => {
                        res.json({
                            success: true,
                            token: `Bearer ${token}`
                        })
                    })
                } else {
                    errors.password = 'incorrect password';
                    return res.status(400).json(errors);
                }
            });
        });
});

router.get('/test', (req, res) => res.json({
    msg: 'this is the users route'
}));

module.exports = router;