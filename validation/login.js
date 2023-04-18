
module.exports = function validateLoginInput(data) {
    let errors = {};
    console.log({ data });
    if (!(data.username)) {
        errors.username = 'Username field is required';
    }

    else if (!(data.password)) {
        errors.password = 'Password field is required';
    }
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true,
    };
};
