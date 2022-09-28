import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { ethers } from "ethers";
import Stake from "../artifacts/contracts/Stake.json";
function StakeForm() {
  const [ethAddress, setEthAddress] = useState("");
  const [name, setName] = useState("");
  const [task, setTask] = useState("");
  const [stakeAmount, setStakeAmount] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [walletConnected, setWalletConnected] = useState(false);
  let navigate = useNavigate();

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
      setWalletConnected(true);
      setDisabled(false);
    } else {
      console.log("No authorized account found");
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      /*
       * Fancy method to request access to account.
       */
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      /*
       * Boom! This should print out public address once we authorize Metamask.
       */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      setDisabled(false);
      // setWalletConnected(true);
    } catch (error) {
      console.log(error);
    }
  };

  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWallet}
      className="cta-button connect-wallet-button"
    >
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

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
      const data = contract
        .commitStake(name, task, ethAddress, overrides)
        .then((res) => {
          console.log(res);
        });
      console.log(id);
      console.log(data);
      navigate(`stake-confirm/${id}`);
    } catch (err) {
      console.log("Error:", err);
    }
  };

  return (
    <>
      {currentAccount === "" ? (
        renderNotConnectedContainer()
      ) : (
        <p>Wallet connected with address {currentAccount}</p>
      )}
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
