const {verify} =require('jsonwebtoken')
const UserDetails=require("../module/userschema")

const validateToken=async(req,res,next)=>{
    console.log("call1")
    const accessToken=req.header("accessToken")
    console.log(accessToken)
    console.log("call2")
    if(!accessToken) return res.json({message:"User not Loged In"})
   
    try{
            
        verify(accessToken,"process.env.SECRET_KEY",async(err,decode)=>{
            if(err){
                return   res.status(400).json({message:err.message })
              }
              const data=await UserDetails.findOne({_id:decode.data})
              if(data){
              req.user=data._id
              next()
              }else{
                res.json({message:"failed"})
              }

        });
        
        console.log(req.uesr)
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

module.exports={validateToken};