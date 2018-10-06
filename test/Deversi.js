const DeversiContract = artifacts.require("./Deversi.sol");

const TEAM_ENUM = {
  CAT: '0',
  DOG: '1',
  NONE: '2',
};

contract("Deversi", accounts => {
  it("should store the string 'Hey there!'", async () => {
    const Deversi = await DeversiContract.deployed();

    // Set myString to "Hey there!"
    await Deversi.set("Hey there!", { from: accounts[0] });

    // Get myString from public variable getter
    const storedString = await Deversi.myString.call();

    assert.equal(storedString, "Hey there!", "The string was not stored");
  });
  it('Make sure game initialization is correct', async () => {
    const Deversi = await DeversiContract.deployed();
    const owner = await Deversi.owner.call();
    const gameRound = await Deversi.gameRound.call();
    const init_size = await Deversi.INIT_SIZE.call();
    const init_raising_period = await Deversi.INIT_RAISING_PERIOD.call();
    const init_turn_period = await Deversi.INIT_TURN_PERIOD.call();
    const init_share_price = await Deversi.INIT_SHARE_PRICE.call();
    const init_share_growth_rate = await Deversi.INIT_SHARE_GROWTH_RATE.call();
    const size = await Deversi.size.call();
    const fundRaisingPeriod = await Deversi.fundRaisingPeriod.call();
    const turnPeriod = await Deversi.turnPeriod.call();
    const baseSharePrice = await Deversi.baseSharePrice.call();
    const shareGrowthRate = await Deversi.shareGrowthRate.call();
    const currentTeam = await Deversi.currentTeam.call();
    const currentSize = await Deversi.currentSize.call();

    assert.equal(owner, accounts[0], 'owner is not set to contract initiator');
    assert.equal(gameRound, 1, 'game round is not set to 1');
    assert.equal(currentTeam, TEAM_ENUM.NONE, 'currentTeam is not set to NONE');
    assert.equal(size.toFixed(), init_size.toFixed(), 'size is not set to init value');
    assert.equal(currentSize.toFixed(), size.toFixed(), 'currentSize is not set to correct value');
    assert.equal(fundRaisingPeriod.toFixed(), init_raising_period.toFixed(), 'fundRaisingPeriod is not set to init value');
    assert.equal(turnPeriod.toFixed(), init_turn_period.toFixed(), 'turnPeriod is not set to init value');
    assert.equal(baseSharePrice.toFixed(), init_share_price.toFixed(), 'baseSharePrice is not set to init value');
    assert.equal(shareGrowthRate.toFixed(), init_share_growth_rate.toFixed(), 'shareGrowthRate is not set to init value');
  });
  it('non-Owner should not be able to configure', async() => {
    const Deversi = await DeversiContract.deployed();
    try {
      await Deversi.configure(
        '8', '61', '61', '2000000000000000', '6',
        { from: accounts[1] }
      );
    } catch(e) {
      assert.isDefined(e, 'Error is not present');
      return;
    }
    throw new Error('should not get here');
  });
  it('Owner should be able to configure', async() => {
    const Deversi = await DeversiContract.deployed();
    await Deversi.configure(
      '8', '61', '62', '2000000000000000', '6',
      { from: accounts[0] }
    );
    const size = await Deversi.size.call();
    const fundRaisingPeriod = await Deversi.fundRaisingPeriod.call();
    const turnPeriod = await Deversi.turnPeriod.call();
    const baseSharePrice = await Deversi.baseSharePrice.call();
    const shareGrowthRate = await Deversi.shareGrowthRate.call();
    assert.equal(size.toFixed(), '8', 'size is not configured');
    assert.equal(fundRaisingPeriod.toFixed(), '61', 'fundRaisingPeriod is not configured');
    assert.equal(turnPeriod.toFixed(), '62', 'turnPeriod is not configured');
    assert.equal(baseSharePrice.toFixed(), '2000000000000000', 'baseSharePrice is not configured');
    assert.equal(shareGrowthRate.toFixed(), '6', 'shareGrowthRate is not configured');
  });
});