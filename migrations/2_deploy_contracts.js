const Deversi = artifacts.require("Deversi");

module.exports = function(deployer) {
  deployer.deploy(Deversi);
};