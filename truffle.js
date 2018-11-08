/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() {
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>')
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

const HDWalletProvider = require('truffle-hdwallet-provider');

const infuraRinkeby = 'https://rinkeby.infura.io/';
const mnemonic = 'lesson vanish employ control whisper fix capital peace across pupil void like';

const dexonTestnet = 'http://testnet.dexon.org:8545';
const dexonMnemonic = 'paper doctor orchard task marriage legal tiger dynamic put noodle grief desk';

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, infuraRinkeby, 0),
      network_id: 1,
    },
    dexonTestnet: {
      provider: () => new HDWalletProvider(dexonMnemonic, dexonTestnet),
      network_id: "*",
      gas: 4500000,
      gasPrice: 10000000000,
    },
  }
};
