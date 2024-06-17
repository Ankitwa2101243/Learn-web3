const {Web3} = require("web3"); // sabse pahle import
const Abi = require("./ABI.json")

const sepoliaRpcUrl = process.env.SEPOLIA_RPC_URL;
const provider = sepoliaRpcUrl;// kis blockchain se baat karna hai wo info
// ab blockchain se baat karna hai to ya to khud na node run karo[eg : geth] ya kisi API ke help se[alchemy,infura]

// blockchain me .env ki jagah hamlog chain link provided env-enc ka use karenge ye secret ko encrypted form me store karta hai

const web3 = new Web3(provider); // yaha hamne ek object create kiya web3 ka provider ke liye[sepolia hai abhi ke liye ]
// is web3 obj me sab hai jisse ham smart contract se baat kar sake

// YE SAB BLOCKCHAIN INTERACTION HAI AAGE SMART CONTRACT INTERACTION BHI HAI

// balance fetch karna ho kisi acc se
const getBalance = async() => {
    const userBalanceWei = await web3.eth.getBalance("0xEAC0CEe2ecA3dF2280E06C20d89fa838175cbb29"); // by default wei me balance return hota hai
    console.log(String(userBalanceWei));
    const BalanceInEth = web3.utils.fromWei(userBalanceWei,"ether"); // ether me aao wei se
    const BalanceInWie = web3.utils.toWei(BalanceInEth,"ether"); // ether se wei me jao
    console.log(BalanceInWie);
}
getBalance();

// web3 obj me sabse jyda web3.eth and web3.utils use karenge
// wei to ether convert karne ke liye -> web3.utils

// AB AGAR SMART CONTRACT SE INTRACT KARNA HO
// smart contract se baat karne ke liye do imp ratan
    // 1. contract address -> means mera smart contract hai kaha
    // 2. contract abi -> jab pata chal gya hai kaha to abi se pata karenge usme hai kya

//     const readSmartContract = async() => {
//     // sbse pahle smart contract deploy kare[can use remix id]
//     const contractAddress = "0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B"
//     // fir ek abi.json file banyenge [ abi json format me hota hai]
//     // ab contract ka ek instance create karenge using web3.eth
//     const contractInstance = new web3.eth.Contract(Abi,contractAddress);
//     console.log(contractInstance);

//     // ab contract ke kisi fn ya variable ke acces ke liye instace ka use krenge
//     const symbol = await contractInstance.methods.symbol().call(); 
//     // .call() sirf agar read karna ho contract se tabhi agar write karna ho to paisa lagta hai so private key chahiye hoga
//     console.log(symbol);
// }
// readSmartContract();

const writeSmartContract = async() => {
    const contractAddress = "0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B"
    const contractInstance = new web3.eth.Contract(Abi,contractAddress);

    // hame transfer fn call karna hai jo do argument leta hai kisko or kitna bhejna hai
    const privateKey = ""; // metamask se le aaiye or encrypt karke env-enc me store kare
    const privateKeyHex = "0x" + privateKey; // hex me convert kiya

    // ab private key mil gya to web3.eth use karke us account ka details mil jyega
    //const accounts = web3.eth.accounts.privateKeyToAccount(privateKeyHex);
    // ek or syntax acc fetch karne ka
    const accounts = web3.eth.accounts.wallet.add(privateKeyHex).get(0);

    const sender = accounts.address; // jo account fetch kiye hai wo ek obj return kiya hai jisme hame address chahiye
    const to = "" // jisko bhejna hai uska address
    const amount = "" // kitna bhejna hai

   // await contractInstance.transfer(to,amount).send({from : sender}) // ye run nhi karega ye error dega qki hmne transfer fn call kiya hai 
    //lekin jiska acc hai usne sign hi nhi kiya hai sirf private key se kaam nhi chagela

    const transaction = {
        from : sender,
        to : contractAddress,
        data : contractInstance.methods.transfer(to,amount).encodeABI(),
        gas : '300000'
    }
    await web3.eth.sendTransaction(transaction);


}
writeSmartContract();