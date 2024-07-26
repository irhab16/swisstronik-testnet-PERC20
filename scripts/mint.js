//const hre = require("hardhat");
const {
    ethers,
    network,
  } = require("hardhat");
  
  //const HttpNetworkConfig = require("hardhat/types");
  
  const {
    encryptDataField,
    decryptNodeResponse,
  } = require("@swisstronik/utils");
  
  
  const sendShieldedTransaction = async (signer, destination, data, value) => {
  
    const rpcLink = network.config.url;
  
    const [encryptedData] = await encryptDataField(rpcLink, data);
  
    return await signer.sendTransaction({
      from: signer.address,
      to: destination,
      data: encryptedData,
      value,
    });
  };
  
  async function main() {
  
    const contractAddress = "0x7298FA1D4952EDcAaa4eFeeF8FFFd3fac2aD1772";
  
    const [signer] = await ethers.getSigners();
  
    const contractFactory = await ethers.getContractFactory("PERC20Sample");
    const contract = contractFactory.attach(contractAddress);
  
    const functionName = "mint1000tokens";
    const mintToken = await sendShieldedTransaction(
      signer,
      contractAddress,
      contract.interface.encodeFunctionData(functionName),
      0
    );
  
    await mintToken.wait();
  
    console.log("Mint Transaction Hash: ", mintToken.hash);
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });