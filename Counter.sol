pragma solidity ^0.5.1;
contract Counter {
    uint productCount = 0;
    uint boxCount = 0;
    address owner;
    event BoxProduced(uint);
    constructor() public {
        owner = msg.sender;
    }
    function produce() external {
        require(owner == msg.sender);
        productCount++;
        if ((productCount % 12) == 0) {
            boxCount ++;
            emit BoxProduced(boxCount);
        }
    }
    function multiProduce(uint p) external {
        require(p > 0);
        require(owner == msg.sender);
        productCount += p;
        if ((productCount / 12) > boxCount) {
            uint oldBoxCount = boxCount ;
            boxCount = productCount / 12;
            for (uint i = oldBoxCount + 1; i <= boxCount; i++)
                emit BoxProduced(i);
        }
    }
    function getProductCount() external view returns(uint) {
        return(productCount);
    }
}