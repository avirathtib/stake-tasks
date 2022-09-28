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

  const onFormSubmit = async () => {
    if (ethers.utils.isAddress(ethAddress) == false) {
      alert("Please provide a valid ETH address");
    }
    // if (
    //   Number.isInteger(parseInt(stakeAmount)) == false ||
    //   parseInt(stakeAmount) <= 0
    // ) {
    //   alert("Please provide a valid non-negative integer amount");
    // }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, Stake.abi, signer);
    let overrides = { value: ethers.utils.parseEther(stakeAmount) };
    try {
      console.log("hello");
      const data = await contract.commitStake(
        name,
        task,
        ethAddress,
        overrides
      );
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
        <Button type="submit" variant="primary" onClick={onFormSubmit}>
          Primary
        </Button>{" "}
      </Form>
    </>
  );
}

export default StakeForm;
