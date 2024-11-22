const mysql=require('mysql');
const dotenv=require('dotenv');
const fs=require("fs")

//Singleton class instance
let instance=null;
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DB_NAME,
    port:3306,
    ssl  : {
        ca : fs.readFileSync(__dirname + '/DigiCertGlobalRootCA.crt.pem')
      }
});

// Singleton class
class Db_Service{
    static getDbServiceInstance(){
        return instance ? instance :new Db_Service();
    }


//  Company Queries

        async getPendingRequests(wallet_addr){
            try{
                console.log(wallet_addr);
                const response=await new Promise((resolve,reject)=>{
                    const query="SELECT t.transaction_id,t.no_of_shares,t.company_id,i.investor_name,i.investor_id,t.status FROM `company` c,transaction t,investor i WHERE c.wallet_addr=? AND c.company_id=t.company_id AND (t.status=? OR t.status=?)AND t.investor_id=i.investor_id";
                    pool.getConnection((err, connection) => { 
                    connection.query(query,[wallet_addr,"Processing","Investor_Processing"],(error,results)=>{    
                        connection.release();
                        if(error){
                            reject(new Error(error.message));
                        }
                        resolve(results);
                    })
                });
                });
                return(response);
                
            }
            catch(error){
                return error;
            }
        }

        async getPendingRequests_Buyer_Processing(wallet_addr){
            try{
                console.log(wallet_addr);
                const response=await new Promise((resolve,reject)=>{
                    const query="SELECT t.transaction_id,t.no_of_shares,t.company_id,i.investor_name,i.investor_id,t.status FROM `company` c,transaction t,investor i,investor_listing il WHERE c.wallet_addr=? AND c.company_id=t.company_id AND t.status=? AND t.transaction_id=il.transaction_id AND il.buyer_wallet_addr=i.wallet_addr";
                    pool.getConnection((err, connection) => { 
                    connection.query(query,[wallet_addr,"Buyer_Processing"],(error,results)=>{    
                        connection.release();
                        if(error){
                            reject(new Error(error.message));
                        }
                        resolve(results);
                    })
                });
                });
                return(response);
                
            }
            catch(error){
                return error;
            }
        }


        async getAcceptance(update_time,transaction_id,comp_status,req_usdt){
            try{
                transaction_id = parseInt(transaction_id)
                const response=await new Promise((resolve,reject)=>{
                     const query="UPDATE transaction SET status=?,updated_at=?,request_usdt=? WHERE transaction_id=?";
                     pool.getConnection((err, connection) => { 
                     connection.query(query,[comp_status,update_time,req_usdt,transaction_id],(error,result)=>{    
                         connection.release();
                         if(error){
                             reject(new Error(error.message));
                             console.log(error.message);
                         }
                         resolve(result);
                     })
                 });
                 });
                 return {
                    id:response,
                    message: "Confirmation sent to Company"
                };
            }
            catch(error){
                return error;
            }
       }
         

    async getAllCompanyData(){
        try{
            const response=await new Promise((resolve,reject)=>{
                const query="select * from company";
                pool.getConnection((err, connection) => { 
                connection.query(query,(error,results)=>{    
                    connection.release();
                    if(error){
                        reject(new Error(error.message));
                    }
                    resolve(results);
                })
            });
            });
            return(response);
            
        }
        catch(error){
            return error;
        }
    }

    async getContractAddrs(wallet_addr){
        try{
            const response=await new Promise((resolve,reject)=>{
                const query="select contract_addr,swap_contract_addr,company_name from company where wallet_addr=?";
                pool.getConnection((err, connection) => { 
                connection.query(query,[wallet_addr],(error,results)=>{    
                    connection.release();
                    if(error){
                        reject(new Error(error.message));
                    }
                    resolve(results);
                })
            });
            });
            return(response);
            
        }
        catch(error){
            return error;
        }
    }

    async getIndvCompanyData(wallet_addr){
        try{
            const response=await new Promise((resolve,reject)=>{
                const query="select * from company where wallet_addr=?";
                pool.getConnection((err, connection) => { 
                connection.query(query,[wallet_addr],(error,results)=>{    
                    connection.release();
                    if(error){
                        reject(new Error(error.message));
                    }
                    resolve(results);
                })
            });
            });
            return(response);
            
        }
        catch(error){
            return error;
        }
    }

    async mint(comp_wallet_addr,comp_name,comp_symb,comp_shares,comp_contract_addr,swap_contract){
        try{
           const response=await new Promise((resolve,reject)=>{
                
                const query="INSERT into company (wallet_addr,company_name,company_sym,no_of_shares,contract_addr,swap_contract_addr) values (?,?,?,?,?,?)";
                pool.getConnection((err, connection) => { 
                connection.query(query,[comp_wallet_addr,comp_name,comp_symb,comp_shares,comp_contract_addr,swap_contract],(error,result)=>{    
                    connection.release();
                    if(error){
                        reject(new Error(error.message));
                        console.log(error.message);
                    }
                    resolve(result);
                })
            });
            });

            return {
                id:response,
                message: comp_name+" shares minted successfully"
            };
        }
        catch(error){
            return error;
        }
    }
 
    async updateCompanyShares(comp_no_of_shares,req_no_of_shares){
        try{
            const remaining_shares = comp_no_of_shares - req_no_of_shares;
            const response=await new Promise((resolve,reject)=>{
                 const query="UPDATE company SET no_of_shares=?";
                 pool.getConnection((err, connection) => { 
                 connection.query(query,[remaining_shares],(error,result)=>{    
                     connection.release();
                     if(error){
                         reject(new Error(error.message));
                         console.log(error.message);
                     }
                     resolve(result);
                 })
             });
             });
             return {
                id:response,
                message: "Confirmation sent to Company"
            };
        }
        catch(error){
            return error;
        }
    }


// Investor queries

async getAllInvestorsData(){
    try{
        const response=await new Promise((resolve,reject)=>{
            const query="select investor_name ,wallet_addr from investor";
            pool.getConnection((err, connection) => { 
            connection.query(query,(error,results)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        // console.log(response);
        return(response);
        
    }
    catch(error){
        return error;
    }
}

// get individual investor by wallet address
async getInvestorData(wallet_addr){
    try{
        const response=await new Promise((resolve,reject)=>{
            const query="select investor_id from investor where wallet_addr=?";
            pool.getConnection((err, connection) => { 
            connection.query(query,[wallet_addr],(error,results)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        return(response);
        
    }
    catch(error){
        return error;
    }
}

async getInvestorDataByID(investor_id){
    try{
        const response=await new Promise((resolve,reject)=>{
            const query="select * from investor where investor_id=?";
            pool.getConnection((err, connection) => { 
            connection.query(query,[investor_id],(error,results)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        return(response);
        
    }
    catch(error){
        return error;
    }
}

//  Transaction Queries

async IntiateTxn(txn){
    try{
       const response=await new Promise((resolve,reject)=>{
            const query="INSERT into transaction (company_id , no_of_shares , investor_id , trustee_id , status , created_at , updated_at) values (?,?,?,?,?,?,?) ";
            pool.getConnection((err, connection) => { 
            connection.query(query,[txn.company_id,txn.no_of_shares,txn.investor_id,txn.trustee_id,txn.status,txn.created_at,txn.updated_at],(error,result)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                    console.log(error.message);
                }
                resolve(result);
            })
        });
        });

        return {
            id:response,
            message: "Request recieved at Trustee"
        };
    }
    catch(error){
        return error;
    }
}

async getTransactionDetails(transaction_id){
    try{
        const response=await new Promise((resolve,reject)=>{
            const query="select * from transaction where transaction_id=?";
            pool.getConnection((err, connection) => { 
            connection.query(query,[transaction_id],(error,results)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        return(response);
    }
    catch(error){
        return error;
    }
}

async updateTxnTable(status,transaction_id,timestamp){
    try{
        console.log(status,transaction_id,timestamp);
        const response=await new Promise((resolve,reject)=>{
            const query="UPDATE transaction SET status=?,updated_at=? WHERE transaction_id=?";
            pool.getConnection((err, connection) => { 
            connection.query(query,[status,timestamp,transaction_id],(error,results)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        return(response);
    }
    catch(error){
        return error;
    }
}

// Investor flow 

async IntiateSellTxn_Investor(txn){
    try{
       const response=await new Promise((resolve,reject)=>{
            const query="INSERT into transaction (company_id , no_of_shares , investor_id , trustee_id , status , created_at , updated_at,request_usdt) values (?,?,?,?,?,?,?,?) ";
            pool.getConnection((err, connection) => { 
            connection.query(query,[txn.company_id,txn.no_of_shares,txn.investor_id,txn.trustee_id,txn.status,txn.created_at,txn.updated_at,txn.request_usdt],(error,result)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                    console.log(error.message);
                }
                resolve(result);
            })
        });
        });

        return {
            id:response,
            message: "Request recieved at Trustee"
        };
    }
    catch(error){
        return error;
    }
}






async requestAllowance(updatedDate,transaction_id){
    try{
       const response=await new Promise((resolve,reject)=>{
            const query="UPDATE transaction SET status='USDTAllowance',updated_at=? WHERE transaction_id=?";
            pool.getConnection((err, connection) => { 
            connection.query(query,[updatedDate,transaction_id],(error,result)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                    console.log(error.message);
                }
                resolve(result);
            })
        });
        });

        return {
            id:response,
            message: "Request recieved at Investor to give allowance for USDT"
        };
    }
    catch(error){
        return error;
    }
}

async retrieveForSwap(transaction_id){
    try{
        const response=await new Promise((resolve,reject)=>{
            const query="select t.no_of_shares,t.request_usdt,i.wallet_addr,c.swap_contract_addr from transaction t,company c,investor i WHERE t.company_id=c.company_id and t.investor_id=i.investor_id and transaction_id=?";
            pool.getConnection((err, connection) => { 
            connection.query(query,[transaction_id],(error,results)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        return(response);
    }catch(err){
        return err;
    }
}

async retrieveForSwapInvestor(transaction_id){
    try{
        const response=await new Promise((resolve,reject)=>{
            const query="select t.no_of_shares,t.request_usdt,c.swap_contract_addr,il.buyer_wallet_addr,il.seller_wallet_addr from transaction t,company c,investor_listing il WHERE t.company_id=c.company_id and t.transaction_id=il.transaction_id and t.transaction_id=?";
            pool.getConnection((err, connection) => { 
            connection.query(query,[transaction_id],(error,results)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        // console.log(response);
        return(response);
    }catch(err){
        return err;
    }
}


async swapSuccessUpdate(createdDate,transaction_id,swap_txn_hash){
    try{
        const response=await new Promise((resolve,reject)=>{
            const query="UPDATE transaction SET status='Swap Successful',updated_at=?,swap_txn_hash=? WHERE transaction_id=?";
            pool.getConnection((err, connection) => { 
            connection.query(query,[createdDate,swap_txn_hash,transaction_id],(error,results)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        return(response);
    }catch(err){
        return err;
    }
}

async getApprovedRequests(wallet_addr){
    try{
        const response=await new Promise((resolve,reject)=>{
            const query="select t.transaction_id,c.company_name,t.request_usdt,t.no_of_shares from transaction t,company c,investor i where t.company_id=c.company_id and t.investor_id=i.investor_id and t.status='USDTAllowance'  and i.wallet_addr=?";
            pool.getConnection((err, connection) => { 
            connection.query(query,[wallet_addr],(error,results)=>{  
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        return(response);
        
    }
    catch(error){
        return error;
    }
}

async getInvApprovedRequests(wallet_addr){
    try{
        const response=await new Promise((resolve,reject)=>{
            const query="select t.transaction_id,c.company_name,t.request_usdt,t.no_of_shares,il.seller_wallet_addr,il.buyer_wallet_addr from transaction t,company c,investor_listing il where t.company_id=c.company_id and t.transaction_id=il.transaction_id and t.status='Buyer_Approved'  and il.buyer_wallet_addr=?";
            pool.getConnection((err, connection) => { 
            connection.query(query,[wallet_addr,wallet_addr],(error,results)=>{  
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        return(response);
        
    }
    catch(error){
        return error;
    }
}

async getInvApprovedRequests_Seller(wallet_addr){
    try{
        const response=await new Promise((resolve,reject)=>{
            const query="select t.transaction_id,c.company_name,c.contract_addr,c.swap_contract_addr,t.request_usdt,t.no_of_shares,il.seller_wallet_addr,il.buyer_wallet_addr from transaction t,company c,investor_listing il where t.company_id=c.company_id and t.transaction_id=il.transaction_id and t.status='Buyer_USDT_Allowance' and il.seller_wallet_addr=?";
            pool.getConnection((err, connection) => { 
            connection.query(query,[wallet_addr,wallet_addr],(error,results)=>{  
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        return(response);
        
    }
    catch(error){
        return error;
    }
}

async sendAllowance(txn_id,updatedDate,status){
    try{
        const response=await new Promise((resolve,reject)=>{
            const query="UPDATE transaction SET status=?,updated_at=? WHERE transaction_id=?";
            pool.getConnection((err, connection) => { 
            connection.query(query,[status,updatedDate,txn_id],(error,results)=>{  
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        return(response);
        
    }
    catch(error){
        return error;
    }
}


async getIndvRequest(company_id){
    try{
        company_id=parseInt(company_id);
        const response=await new Promise((resolve,reject)=>{
            const query="select investor_name,no_of_shares,status,updated_at,transaction_id from transaction as txn,investor as inv where txn.investor_id=inv.investor_id and company_id=?";
            pool.getConnection((err, connection) => { 
            connection.query(query,[company_id],(error,results)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        return(response);
        
    }
    catch(error){
        return error;
    }
}


async getIndvTxn(transaction_id){
    try{
        const response=await new Promise((resolve,reject)=>{
            const query="select * from transaction WHERE transaction_id=?";
            pool.getConnection((err, connection) => { 
            connection.query(query,[transaction_id],(error,results)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        return(response);
    }catch(err){
        return err;
    }
        
}

async sendConfirmation(status,update_time,transaction_id){
    try{// Processing
        transaction_id = parseInt(transaction_id)
        const response=await new Promise((resolve,reject)=>{
             const query="UPDATE transaction SET status=?,updated_at=? WHERE transaction_id=?";
             pool.getConnection((err, connection) => { 
             connection.query(query,[status,update_time,transaction_id],(error,result)=>{    
                 connection.release();
                 if(error){
                     reject(new Error(error.message));
                     console.log(error.message);
                 }
                 resolve(result);
             })
         });
         });
 
         return {
             id:response,
             message: "Confirmation sent to Company"
         };
     }
     catch(error){
         return error;
     }
}


// Transaction Log Queries

async getLogIdCount(){
    try{
        const response=await new Promise((resolve,reject)=>{
            const query="select count(*) as count from transaction_log";
            pool.getConnection((err, connection) => { 
            connection.query(query,(error,results)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        return(response);
        
    }
    catch(error){
        return error;
    }
}

async LogTxn(hash,id){
    try{
        const response=await new Promise((resolve,reject)=>{
            const query="insert into transaction_log (txn_hash,transaction_id) values (?,?) ";
            pool.getConnection((err, connection) => { 
            connection.query(query,[hash,id],(error,results)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        return {
            id:response,
            message: "Request recieved at Trustee"
        };
        
    }
    catch(error){
        return error;
    }
}
    
// investor_listing table Queries

async insertInvestor_Listing(txn_id,seller_wallet){
    try{
        const response=await new Promise((resolve,reject)=>{
            const query="insert into investor_listing (transaction_id,seller_wallet_addr) values (?,?) ";
            pool.getConnection((err, connection) => { 
            connection.query(query,[txn_id,seller_wallet],(error,results)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        return (response);
    }
    catch(error){
        return error;
    }
}

async getListing(company_id,wallet_addr){
    try{
        const response=await new Promise((resolve,reject)=>{
            const query="SELECT t.transaction_id,t.no_of_shares,t.request_usdt from transaction t,investor_listing il where il.transaction_id=t.transaction_id and il.seller_wallet_addr <> ? and t.company_id=? and t.status=?;";
            pool.getConnection((err, connection) => { 
            connection.query(query,[wallet_addr,company_id,"Investor_Approved"],(error,results)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        return (response);
    }
    catch(error){
        return error;
    }
}

async insertWalletAddress(txn_id,wallet_addr){
    try{
        const response=await new Promise((resolve,reject)=>{
            const query="update investor_listing set buyer_wallet_addr=? where transaction_id=?";
            pool.getConnection((err, connection) => { 
            connection.query(query,[wallet_addr,txn_id],(error,results)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                }
                resolve(results);
            })
        });
        });
        return (response);
    }
    catch(error){
        return error;
    }
}

// Login Table 
async login(name,email,wallet_addr,role){
    try{
       const response=await new Promise((resolve,reject)=>{
            
            const query="INSERT into login (name,email,wallet_addr,role) values (?,?,?,?)";
            pool.getConnection((err, connection) => { 
            connection.query(query,[name,email,wallet_addr,role],(error,result)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                    console.log(error.message);
                }
                resolve(result);
            })
        });
        });

        return {
            id:response,
            message: " user data recorded"
        };
    }
    catch(error){
        return error;
    }
}

// Investor Table Queries
async postInvestor(name,wallet_addr){
    try{
       const response=await new Promise((resolve,reject)=>{
            
            const query="INSERT into investor (investor_name,wallet_addr) values (?,?)";
            pool.getConnection((err, connection) => { 
            connection.query(query,[name,wallet_addr],(error,result)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                    console.log(error.message);
                }
                resolve(result);
            })
        });
        });

        return {
            id:response,
            message: " investor data recorded"
        };
    }
    catch(error){
        return error;
    }
}

async getInvestorByWallet(wallet_addr){
    try{
       const response=await new Promise((resolve,reject)=>{
            
            const query="SELECT investor_id FROM investor WHERE wallet_addr=?";
            pool.getConnection((err, connection) => { 
            connection.query(query,[wallet_addr],(error,result)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                    console.log(error.message);
                }
                resolve(result);
            })
        });
        });

        return {
            id:response,
            message: " investor data retrieved"
        };
    }
    catch(error){
        return error;
    }
}

// Trustee table Queries
async postTrustee(name,wallet_addr){
    try{
        console.log(name,wallet_addr)
       const response=await new Promise((resolve,reject)=>{
            
            const query="INSERT into trustee (trustee_name,trustee_wallet_addr) values (?,?)";
            pool.getConnection((err, connection) => { 
            connection.query(query,[name,wallet_addr],(error,result)=>{    
                connection.release();
                if(error){
                    reject(new Error(error.message));
                    console.log(error.message);
                }
                resolve(result);
            })
        });
        });

        return {
            id:response,
            message: " investor data recorded"
        };
    }
    catch(error){
        return error;
    }
}
    
} //End Singleton class

module.exports={Db_Service};