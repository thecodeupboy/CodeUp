const express =require('express');
const router=require('express').Router() 

const userc=require('../controllers/usercontroller');


router.get('/accountSettings',userc.userProfileForm)
router.post('/accountSettings',userc.userProfileUpdate)



module.exports=router