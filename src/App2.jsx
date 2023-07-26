import React, { useEffect, useState } from "react";
import "./App.css";
import { ethers } from "ethers";
import PropertyToken from "./utils/Rifas.json";
// import { create } from 'ipfs-http-client'


// interface ProjectFromPropertyMaster {
//   img: string;
// 	name: string;
// 	nftAddress: string;
// 	symbol: string;
// }


const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
	const [newProperty, setNewProperty] = useState('');
	// const [propertyProject, setPropertyProject] = useState<ProjectFromPropertyMaster|null>(null);

	const [nameProject, setNameProject] = useState('');
  const [contractProject, setContractProject] = useState('');
	const [imgProject, setImgProject] = useState('');
	const [symbolProject, setSymbolProject] = useState('');
	const [nftAddressProject, setNftAddressProject] = useState('');
  // const ipfs = IPFS({ host: 'localhost', port: '5001', protocol: 'http' });



  const createIpfsServer = async ()=>{
    // connect to the default API address http://localhost:5001
    const client = create();
    // call Core API methods
    const { cid }   = await client.add('Hello world!');
    //console.log(cid);
  }

    
  const connectWallet = async () => {
    try {
      const { ethereum } = await getEthereumInstance();
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const createContract = () => {
    
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Ethereum object doesn't exist!");
      return null;
    }
//master property: 0x9F8dCB45efF8ecCE9477891Cdeaf27c44efa4DBC
    // const contractAddress = "0x1D2D4E57864B36a42A44142A29a0c9579352eF7c"
    
    const contractAddress = "0x78B56c473A4a41d9b5B8B04FDE68dabB3E16498F"
    // const contractAddress = "0x1D2D4E57864B36a42A44142A29a0c9579352eF7c"


    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, PropertyToken.abi, signer);
    setContractProject(contract);
    return contract;
  };

const ipfsHash = 'Qmes5xkDgcwdhPsXPthJnuY58Ups1JBDGzabN7idyYAzJU';

  const createNewProperty = async () => {
    try {
      const contract = createContract();
      if (contract) {
        const propertyAddress = await contract.createNewProperty('Robot Chess', 'RCS', ipfsHash );
        setNewProperty(propertyAddress);
        console.log("Retrieved propertyAddress...", propertyAddress);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getPropertyProject = async() =>{
    try {
      const contract = createContract();
      if (contract) {
        const property = await contract.getProject(ipfsHash);
        // const {name, img, nftAddress, symbol} = await contract.getProject(ipfsHash);
        console.log("Retrieved propertyProject...", property);
          setNameProject(property.name);
          setImgProject(property.img);
          setSymbolProject(property.symbol);
          setNftAddressProject(property.nftAddress);
        // setPropertyProject(property);
      }
      
    } catch (error) {
      console.log(error);
    }
  }
  
  const buyAndMint = async () => {
    try {
      const contract = createContract();
      if (contract) {
        const name = await contract.usdtToken();
        setNameProject(name);
        console.log("Retrieved name...", name);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getSymbolProject = async () => {
    try {
      const contract = createContract();
      if (contract) {
        const symbol = await contract.symbol();
        console.log("Retrieved symbol...", symbol);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getBalanaceNfts = async () => {
    try {
      const contract = createContract();
      if (contract) {
        const balance = await contract.balanceOf("0x0eE3DDA02D614468D6bF0cB17480C974F93b1EA6");
        console.log("Retrieved balance of NFTs...", balance);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUri = async () => {
    try {
      const contract = createContract();
      if (contract) {
        const uri = await contract.tokenURI(0);
        console.log("Retrieved Url image...", uri);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getEthereumInstance = async () => {
    return { ethereum: window.ethereum };
  };

  useEffect(() => {
    createIpfsServer();
    // connectWallet();
    // nameProject();
    // symbolProject();
    // getBalanaceNfts();
    // getUri();
  }, []);

  return (
    <div className="App">
      <button onClick={connectWallet}>Connect Wallet</button>
      <p>Current account: {currentAccount}</p>

       <button onClick={createContract}>Create Contract</button>
      <p>Current contract: {contractProject}</p>
       
      <button onClick={buyAndMint}>buy And Mint</button>
      <p>Buy: {nameProject}</p>
      
      <button onClick={getPropertyProject}>getPropertyProject</button>
      <p>name: {nameProject}</p>
      <p>img: {imgProject}</p>
      <p>symbol: {symbolProject}</p>
      <p>nftAddress: {nftAddressProject}</p>
    </div>
  );
};

export default App;
