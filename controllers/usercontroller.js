const { configDotenv } = require('dotenv');
const authTable = require('../models/auth')

exports.userProfileForm = (req, res) => {
    let mess = ''
    res.render('user/userDetails.ejs',{ mess })
};


exports.userProfileUpdate = async(req, res) => {
    let mess = ''
    const { name, email, contact, profession, organization, job_title } = req.body
    try {
        if (!name || !email || !contact || !profession || !organization) {
            throw new Error("please fill all form inputs")
        }
        const usercheck = await authTable.findOne({ name: name })
        if (usercheck) {
            throw new Error(`${name} Username already exisits!!`)
        }
        const newAccount = new authTable({ 
            name: name,
            email: email,
            contact:contact, 
            profession:profession, 
            organization:organization, 
            job_title:job_title})
        newAccount.save()
        mess = 'successsfully acc has been created'
    }
    catch (error) {
        mess = error.message
    }
    res.render('user/userDetails', { mess })
};
