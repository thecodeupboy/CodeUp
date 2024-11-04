const express =require('express');
const router=require('express').Router() 

const userc=require('../controllers/usercontroller');
const handlesession = require('../middleware/handlesession');
const handleroles = require('../middleware/handleroles');


router.get('/accountSettings',userc.userProfileForm)
router.post('/accountSettings',userc.userProfileUpdate)



module.exports=router