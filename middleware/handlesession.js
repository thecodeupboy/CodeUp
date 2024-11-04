function handlesession(req,res,next){
    if(req.session.isAuth){
       next()
    }
    else{
       res.send('Access denied!!!')
    }
 };

module.exports=handlesession