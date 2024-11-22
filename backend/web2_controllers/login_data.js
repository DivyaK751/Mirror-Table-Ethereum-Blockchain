// Post Login Details

const {Db_Service} = require('../config/db_service')
const db = Db_Service.getDbServiceInstance();

const postLoginData = async (req,res) =>{
    var {name,email,wallet_addr,role} = req.body;
       try{
       
        const result = await db.login(name,email,wallet_addr,role);
        var res_another;
        // console.log(result);
        if(role == "Investor" || role == "Lead Investor")
            res_another = await db.postInvestor(name,wallet_addr)
        else if(role == "Trustee")
            res_another = await db.postTrustee(name,wallet_addr)

        // console.log("another res:",res_another)
        
        res.json({
            result:result.id,
            result_another:res_another,
            msg:result.message,
        })
    }catch(error){
        res.json({
            msg:"error",
            err:error
        })
    }

}

module.exports = {
    postLoginData
}