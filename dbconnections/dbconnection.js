const mongoose=require('mongoose')

mongoose.connect(`${process.env.DBURL}/${process.env.DBNAME}`)
.then(()=>{
    console.log(`connected to db ${process.env.DBNAME}`)
})
.catch((error)=>{
    console.log(error.message)
})