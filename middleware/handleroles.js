const handleroles = (...allowedRoles) => {
    return (req, res, next) => {
        const userRoles = req.session.roles; 
        console.log(userRoles)

        const hasAccess = userRoles.some(role => allowedRoles.includes(role));
        console.log(userRoles,allowedRoles,userRoles.some(role => allowedRoles.includes(role)))

        if (!hasAccess) {
            res.send('access denied!!!')
        };
        next();
    };
};

module.exports = handleroles;
