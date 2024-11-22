// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

interface IERC20 {

    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}


contract TokenSwap {
    
    //create state variables
    
    IERC20 public company_token;
    IERC20 public stable_coin;
    address public company_wallet;
    address public buyer_wallet;
    address public trustee;
    //when deploying pass in owner 1 and owner 2
    
    constructor(address _token1,address _owner1,address _token2,address _trustee){
         company_token = IERC20(_token1);
         company_wallet = _owner1;
         stable_coin = IERC20(_token2);
         trustee=_trustee;
        }
    
        //this function will allow 2 people to trade 2 tokens as the same time (atomic) and swap them between accounts
        //Bob holds token 1 and needs to send to alice
        //Alice holds token 2 and needs to send to Bob
        //this allows them to swap an amount of both tokens at the same time
        
        //*** Important ***
        //this contract needs an allowance to send tokens at token 1 and token 2 that is owned by owner 1 and owner 2
        
        function swap( uint shares, uint stablecoins,address buyer) public {
            buyer_wallet=buyer;
            require(msg.sender == company_wallet || msg.sender == trustee, "Not authorized");
            require(company_token.allowance(company_wallet, address(this)) >= shares, "Share allowance too low");
            require(stable_coin.allowance(buyer_wallet, address(this)) >= stablecoins, "Stable Coin allowance too low");
            //transfer TokenSwap
            //stable_coin, buyer_wallet, amount 2 -> company_wallet.  needs to be in same order as function
            _safeTransferFrom(stable_coin, buyer_wallet, company_wallet, stablecoins);
            // company_token, company_wallet, amount 1 -> buyer_wallet.  needs to be in same order as function
            _safeTransferFrom(company_token, company_wallet, buyer_wallet, shares);
            
        }

        // swap investor to investor
        // amount 1 - no of shares
        // amount 2 - no of USDT
        function swap_investor_to_investor( uint shares, uint stablecoins,address buyer,address seller) public {
            buyer_wallet=buyer;
            require(msg.sender == company_wallet || msg.sender == trustee, "Not authorized");
            require(company_token.allowance(seller, address(this)) >= shares, "Share allowance too low");
            require(stable_coin.allowance(buyer_wallet, address(this)) >= stablecoins, "Stable Coin allowance too low");
            //transfer TokenSwap
            //stable_coin, buyer_wallet, amount 2 -> company_wallet.  needs to be in same order as function
            _safeTransferFrom(stable_coin, buyer_wallet, seller, stablecoins);
            // company_token, company_wallet, amount 1 -> buyer_wallet.  needs to be in same order as function
            _safeTransferFrom(company_token, seller, buyer_wallet, shares);
            
        }

        //This is a private function that the function above is going to call
        //the result of this transaction(bool) is assigned in a variable called sent
        //then we require the transfer to be successful
        function _safeTransferFrom(IERC20 token, address sender, address recipient, uint amount) private {
            bool sent = token.transferFrom(sender, recipient, amount);
            require(sent, "Token transfer failed");
        }
}