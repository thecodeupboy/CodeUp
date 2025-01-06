const authTable = require('../models/auth')

exports.getUsers = async (req, res) => {
    const data = await authTable.find()
    res.render('admin/users.ejs', { data })
};

exports.updateUserForm = async (req, res) => {
    const id = req.params.id
    const data = await authTable.findById(id)
    res.render('admin/updateUser.ejs', { data })
};

exports.updateUser = async (req, res) => {
    const id = req.params.id;
    const { name, email, contact, profession, organization, job_title, roles } = req.body;
    await authTable.findByIdAndUpdate(id, {
        name: name,
        email: email,
        contact: contact,
        profession: profession,
        organization: organization,
        job_title: job_title,
        roles: roles
    })
    res.redirect('/admin/users')
};

exports.updateStatus = async (req, res) => {
    const id = req.params.id;
    const data = await authTable.findById(id)
    userStatus = data.status
    if (userStatus == 'suspended') {
        userStatus = 'active'
    }
    else {
        userStatus = 'suspended'
    }
    await authTable.findByIdAndUpdate(id, { status: userStatus })
    res.redirect('/admin/users')
};

exports.deleteUser = async (req, res) => {
    const id = req.params.id;
    await authTable.findByIdAndDelete(id)
    res.redirect('/admin/users')
};


