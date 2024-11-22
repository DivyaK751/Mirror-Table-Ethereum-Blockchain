// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {  
    address public contract_owner;
    uint[] internal timestamps; 
    address[] addr;
    mapping(uint=> mapping(address => uint256)) mirrorTable;
    mapping(address=> mapping(uint=>uint256)) investor_mirrorTable;

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 totalSupply_,
        address recipient_
    ) ERC20(name_, symbol_) {
        _mint(recipient_, totalSupply_);
        contract_owner=recipient_;
    }

function decimals() public pure override returns (uint8) {
		return 0;
	}
function _mint(address account, uint256 amount) internal virtual override {
        require(account != address(0), "ERC20: mint to the zero address");
        _beforeTokenTransfer(address(0), account, amount);
        _totalSupply += amount;
        if (_balances[account] == 0) {
            addr.push(account);
            // indices[account] = participants.length - 1;
        }
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);
        _afterTokenTransfer(address(0), account, amount);
        updateMirrorTable();
        updateInvestorMirrorTable();
    }
function mintmore(uint256 amount) public {
        require(msg.sender==contract_owner,"Only company can call this");
        _mint(msg.sender,amount);
    }

function transfer(address to, uint256 amount) public virtual override returns (bool) {
        if (_balances[to] == 0) {
            addr.push(to);
        }
        address owner = _msgSender();
        _transfer(owner, to, amount);
        updateMirrorTable();
        updateInvestorMirrorTable();
        return true;
    }

function transferFrom(address from,address to,uint256 amount) public virtual override returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        if (_balances[to] == 0) {
            addr.push(to);
        }
        _transfer(from, to, amount);
        updateMirrorTable();
        updateInvestorMirrorTable();
        return true;
    }

function getdetails(uint timestamp) public view returns (address[] memory,uint[] memory){
        uint[] memory bal=new uint[](addr.length);

        for(uint i=0;i<addr.length;i++){
            bal[i]=mirrorTable[timestamp][addr[i]];
        }

        return(addr,bal);
    }

function getInvestordetails(address investor_addr) public view returns (uint[] memory,uint[] memory){
        uint flag=0;uint size=0;
        for(uint i=0;i<timestamps.length;i++){
            if(investor_mirrorTable[investor_addr][timestamps[i]]==0 && flag==0) continue;
            else
            {
                flag=1;
                size=size+1;
            }
        }
        uint[] memory bal=new uint[](size);
        uint[] memory investor_timestamps =new uint[](size);
        flag=0;
        uint j=0;
        for(uint i=0;i<timestamps.length;i++){
            if(investor_mirrorTable[investor_addr][timestamps[i]]==0 && flag==0) continue;
            else
            {
                bal[j]=(investor_mirrorTable[investor_addr][timestamps[i]]);
                investor_timestamps[j]=timestamps[i];
                j=j+1;

                flag=1;
            }
        }


        return(investor_timestamps,bal);
    }

function updateMirrorTable() internal
    {
        uint timestamp = block.timestamp ;
        uint size = addr.length;
        timestamps.push(timestamp);
        for(uint i=0;i<size;i++)
        {
            mirrorTable[timestamp][addr[i]] = _balances[addr[i]];
        }
    }

function updateInvestorMirrorTable() internal
    {
        uint timestamp = block.timestamp ;
        uint size = addr.length;
        for(uint i=0;i<size;i++)
        {
            investor_mirrorTable[addr[i]][timestamp] = _balances[addr[i]];
        }
    }

function getTimeStamps() public view returns(uint256[] memory)
{
    return timestamps;
}
}