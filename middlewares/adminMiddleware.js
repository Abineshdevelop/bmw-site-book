


const isLogginned  = (req,res,next )=>{
    if(req.session.admin){
        next()
    }else{
        res.redirect('/admin/login')
    }
}

const publicMiddleware = (req,res,next)=>{
    if(req.session.admin){
        res.redirect('/admin/dashboard')
    }else{
        next()
    }
}


module.exports = {isLogginned, publicMiddleware}