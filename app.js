// PASTE ADDRESSES FROM DEPLOY HERE
const TOKEN_ADDR = "YOUR_TOKEN_ADDRESS";
const FAUCET_ADDR = "YOUR_FAUCET_ADDRESS";

const FAUCET_ABI = [
    "function requestTokens() external",
    "function getCooldownSeconds(address) external view returns (uint256)"
];
const TOKEN_ABI = [
    "function balanceOf(address) external view returns (uint256)"
];

let provider, signer, faucetContract, tokenContract;

const connectBtn = document.getElementById("connectBtn");
const requestBtn = document.getElementById("requestBtn");
const statusMsg = document.getElementById("statusMessage");

async function init() {
    if(!window.ethereum) return alert("MetaMask required");
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();

    faucetContract = new ethers.Contract(FAUCET_ADDR, FAUCET_ABI, signer);
    tokenContract = new ethers.Contract(TOKEN_ADDR, TOKEN_ABI, provider);

    const addr = await signer.getAddress();
    connectBtn.innerText = "Connected";
    
    updateUI(addr);
}

async function updateUI(userAddress) {
    // Get Faucet Balance
    const fBal = await tokenContract.balanceOf(FAUCET_ADDR);
    document.getElementById("faucetBalance").innerText = ethers.utils.formatEther(fBal);

    // Get User Balance
    const uBal = await tokenContract.balanceOf(userAddress);
    document.getElementById("userBalance").innerText = ethers.utils.formatEther(uBal);

    // Check Cooldown
    const cooldown = await faucetContract.getCooldownSeconds(userAddress);
    const seconds = cooldown.toNumber();

    if (seconds > 0) {
        requestBtn.disabled = true;
        requestBtn.innerText = `Wait ${Math.ceil(seconds / 3600)}h ${Math.ceil((seconds % 3600) / 60)}m`;
        requestBtn.classList.add("cooldown");
    } else {
        requestBtn.disabled = false;
        requestBtn.innerText = "Request 100 Tokens";
        requestBtn.classList.remove("cooldown");
    }
}

requestBtn.onclick = async () => {
    try {
        statusMsg.innerText = "Requesting...";
        const tx = await faucetContract.requestTokens();
        await tx.wait();
        statusMsg.innerText = "Success! Tokens sent.";
        statusMsg.style.color = "#4ade80";
        updateUI(await signer.getAddress());
    } catch(e) {
        statusMsg.innerText = "Error: " + (e.reason || e.message);
        statusMsg.style.color = "#f87171";
    }
};

connectBtn.onclick = init;
