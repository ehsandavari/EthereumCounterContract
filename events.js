window.onload = async function () {
    let metamask = false;
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        metamask = true;
        try {
            await ethereum.enable();
            accounts = await web3.eth.getAccounts();
            option = {from: accounts[0]};
        } catch (error) {
            // User denied account access...
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        metamask = true;
        // Acccounts always exposed
        try {
            web3.eth.defaultAccount = web3.eth.accounts[0];
            option = {from: web3.eth.accounts[0]}
        } catch (error) {

        }
        web3.eth.sendTransaction({/* ... */});
    }
    // Non-dapp browsers...
    else {
        web3 = new Web3(new Web3.providers.HttpProvider(inforaUrl));
        var account = web3.eth.accounts.create();
        option = {from: account.address};
    }

    CounterAddress = '0xaA4634f66a97A0Df92Be537e04a0446cdf68e755';
    CounterAbi = [
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "BoxProduced",
            "type": "event"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "p",
                    "type": "uint256"
                }
            ],
            "name": "multiProduce",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "produce",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getProductCount",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ];
    Counter = new web3.eth.Contract(CounterAbi, CounterAddress);

    Counter.events.BoxProduced({}, function (error, result) {
        if (!error) {
            returnValues = result.returnValues;
            alert(returnValues[0]);
        } else
            alert(error);
    })
    document.getElementById('produce').onclick = function () {
        document.getElementById('loading').style.display = 'block';
        Counter.methods.produce().send(option, function (error, result) {
            document.getElementById('loading').style.display = 'none';
            if (!error)
                Counter.methods.getProductCount().call(option, function (error, result) {
                    if (error)
                        alert(error);
                });
            else
                alert(error);
        }).on('confirmation', function (number, receipt) {
            if (number == 0)
                Counter.methods.getProductCount().call(option, function (error, result) {
                    if (!error)
                        document.getElementById('productCount').innerText = result.concat(' product built.');
                    else
                        alert(error);
                });
        });
    }
    document.getElementById('getProductCount').onclick = function () {
        document.getElementById('loading').style.display = 'block';
        Counter.methods.getProductCount().call(option, function (error, result) {
            document.getElementById('loading').style.display = 'none';
            if (!error)
                document.getElementById('productCount').innerText = result.concat(' product built.');
            else
                alert(error);
        });
    }
    document.getElementById('multiProduce').onclick = function () {
        document.getElementById('loading').style.display = 'block';
        Counter.methods.multiProduce(document.getElementById('prCount').value).send(option, function (error, result) {
            document.getElementById('loading').style.display = 'none';
            if (!error)
                Counter.methods.getProductCount().call(option, function (error, result) {
                    if (error)
                        alert(error);
                });
            else
                alert(error);
        }).on('confirmation', function (number, receipt) {
            if (number == 0)
                Counter.methods.getProductCount().call(option, function (error, result) {
                    if (!error)
                        document.getElementById('productCount').innerText = result.concat(' product built.');
                    else
                        alert(error);
                });
        });
    }

}
