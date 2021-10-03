const Token = artifacts.require("PiyoCoin");
const GameCenter = artifacts.require("GameCenter");

module.exports = async function(deployer) {
	//deploy Token
	await deployer.deploy(Token)

	//assign token into variable to get it's address
	const token = await Token.deployed()
	
	//pass token address for GameCenter contract(for future minting)
	await deployer.deploy(GameCenter, token.address)

	//assign GameCenter contract into variable to get it's address
	const gameCenter = await GameCenter.deployed()

	//change token's owner/minter from deployer to GameCenter
	await token.passMinterRole(gameCenter.address)
};