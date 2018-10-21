const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegistrationInput(data) {
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';
    data.name = !isEmpty(data.name) ? data.name : '';

    if (!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }

    if (!Validator.isEmpty(data.email)) {
        errors.email = 'Email is required';
    }

    if (!Validator.isLength(data.name, {
            min: 2,
            max: 30
        })) {
        errors.name = 'Name must be between 2 and 30 chars';
    }

    if (!Validator.isEmpty(data.name)) {
        errors.name = 'Name is required';
    }

    if (!Validator.isLength(data.password, {
            min: 6,
            max: 30
        })) {
        errors.password = 'password must be greater than 6 chars';
    }

    if (!Validator.isEmpty(data.password)) {
        errors.password = 'password field is required';
    }

    if (!Validator.isEmpty(data.password2)) {
        errors.password2 = 'confirm password field is required';
    }

    if (!Validator.equals(data.password, data.password2)) {
        errors.password = 'Passwords must match';
    }

    return {
        errors,
        isValids: isEmpty(errors)
    };
};