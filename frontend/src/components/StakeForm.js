import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { ethers } from "ethers";
import Stake from "../artifacts/contracts/Stake.json";
function StakeForm() {
  const [ethAddress, setEthAddress] = useState("");
  const [name, setName] = useState("");
  const [task, setTask] = useState("");
  const [stakeAmount, setStakeAmount] = useState("");
  const contractAddress = "0x492d4D32105e65a60422464d30E8440377eC5E5B";
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, Stake.abi, signer);
  let lastId = 0;
  const getAllStakes = async () => {
    try {
      const stakes = await contract.getAllStakes();
      console.log(stakes);
      console.log(stakes.length);
      lastId = stakes.length - 1;
      console.log(lastId);
      onFormSubmit(lastId);
    } catch (err) {
      console.log(err);
    }
  };
  const onFormSubmit = async (id) => {
    if (ethers.utils.isAddress(ethAddress) == false) {
      alert("Please provide a valid ETH address");
    }

    let overrides = { value: ethers.utils.parseEther(stakeAmount) };
    try {
      console.log("hello");
      const data = await contract.commitStake(
        name,
        task,
        ethAddress,
        overrides
      );
      console.log(id);
      console.log(data);
    } catch (err) {
      console.log("Error:", err);
    }
  };

  return (
    <>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Form.Group className="mb-3">
          <Form.Label>Stake Buddy ETH Address</Form.Label>
          <Form.Control
            type="text"
            value={ethAddress}
            placeholder="Enter the ETH address of your partner"
            onChange={(e) => setEthAddress(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Your Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Your Task</Form.Label>
          <Form.Control
            type="text"
            value={task}
            placeholder="Enter what task you'll stake ETH for"
            onChange={(e) => setTask(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Stake Amount</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter the ETH you'll stake"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
          />
        </Form.Group>
        <Button type="submit" variant="primary" onClick={getAllStakes}>
          Primary
        </Button>{" "}
      </Form>
    </>
  );
}

export default StakeForm;
