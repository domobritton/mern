const isEmpty = value => {
    return value === null ||
    value === undefined ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim() === 0)
};

module.exports = isEmpty;