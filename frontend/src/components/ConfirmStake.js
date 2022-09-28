import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import Stake from "../artifacts/contracts/Stake.json";
function ConfirmStake() {
  const contractAddress = "0x492d4D32105e65a60422464d30E8440377eC5E5B";
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, Stake.abi, signer);
  let params = useParams();
  useEffect(() => {
    getStakeById();
  }, []);

  const getStakeById = async () => {
    try {
      const data = await contract.getStakeFromId(params.stakeId);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Hello</h1>
      <p>{params.stakeId}</p>
    </div>
  );
}

export default ConfirmStake;
