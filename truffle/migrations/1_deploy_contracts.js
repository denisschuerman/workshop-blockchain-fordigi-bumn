const SimpleVoting = artifacts.require("SimpleVoting");
const DemoToken = artifacts.require("DemoToken");
const NFTMarketplace = artifacts.require("NFTMarketplace");

module.exports = async function (deployer) {
  await deployer.deploy(SimpleVoting);
  await deployer.deploy(DemoToken, "Demo Token", "DEMO");
  await deployer.deploy(NFTMarketplace);
};
