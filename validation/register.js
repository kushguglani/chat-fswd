
module.exports = function validateRegisterInput(data) {
    let errors = {};
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    console.log({ data });
    if (!(data.name)) {
        errors.name = 'Name field is required';
    }

    else if (!(data.username)) {
        errors.username = 'Username field is required';
    }
    // else if(!mailformat.test(data.email)){
    //     errors.message  = 'Inavalid email';

    // }
    else if (!(data.password)) {
        errors.password = 'Password field is required';
    }
    else if (!(data.password2)) {
        errors.password2 = 'Confirm password field is required';
    }
    else if ((data.password.length < 6 && data.password.length > 30)) {
        errors.password = 'Password must be at least 6 characters';
    }
    else if ((data.password !== data.password2)) {
        errors.password2 = 'Passwords must match';
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true,
    };
};
