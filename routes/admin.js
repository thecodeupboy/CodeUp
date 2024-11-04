const router=require('express').Router() 
const adminc =require('../controllers/admincontroller')

router.get('/users',adminc.getUsers);

router.get('/updateUserInfo/:id',adminc.updateUserForm)

router.post('/updateUserInfo/:id',adminc.updateUser)

router.get('/updateUserStatus/:id', adminc.updateStatus)

router.get('/deleteUser/:id',adminc.deleteUser)

module.exports=router