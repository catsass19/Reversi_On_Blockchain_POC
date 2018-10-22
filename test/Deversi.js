const DeversiContract = artifacts.require("./Deversi.sol");

const TEAM_ENUM = {
  CAT: '2',
  DOG: '1',
  NONE: '0',
};

contract("Deversi", accounts => {
  it('Make sure game initialization is correct', async () => {
    const Deversi = await DeversiContract.deployed();
    const owner = await Deversi.owner.call();
    const gameRound = await Deversi.gameRound.call();
    const init_size = '8';
    const init_raising_period = '10';
    const init_turn_period = '90';
    const init_share_price = '1000000000000000';
    const init_share_growth_rate = '5';
    const init_shares_per_proposal = '10';
    const size = await Deversi.size.call();
    const fundRaisingPeriod = await Deversi.fundRaisingPeriod.call();
    const turnPeriod = await Deversi.turnPeriod.call();
    const baseSharePrice = await Deversi.baseSharePrice.call();
    const shareGrowthRate = await Deversi.shareGrowthRate.call();
    const sharesPerProposal = await Deversi.sharesPerProposal.call();
    const currentTeam = await Deversi.currentTeam.call();
    const currentSize = await Deversi.currentSize.call();
    const currentSharePrice = await Deversi.currentSharePrice.call();
    const currentSharePerProposal = await Deversi.currentSharePerProposal.call();

    assert.equal(owner, accounts[0], 'owner is not set to contract initiator');
    assert.equal(gameRound, 1, 'game round is not set to 1');
    assert.equal(currentTeam, TEAM_ENUM.NONE, 'currentTeam is not set to NONE');
    assert.equal(size.toFixed(), init_size, 'size is not set to init value');
    assert.equal(currentSize.toFixed(), size.toFixed(), 'currentSize is not set to correct value');
    assert.equal(fundRaisingPeriod.toFixed(), init_raising_period, 'fundRaisingPeriod is not set to init value');
    assert.equal(turnPeriod.toFixed(), init_turn_period, 'turnPeriod is not set to init value');
    assert.equal(baseSharePrice.toFixed(), init_share_price, 'baseSharePrice is not set to init value');
    assert.equal(shareGrowthRate.toFixed(), init_share_growth_rate, 'shareGrowthRate is not set to init value');
    assert.equal(sharesPerProposal.toFixed(), init_shares_per_proposal, 'sharesPerProposal is not set to init value');
    assert.equal(currentSharePrice.toFixed(), baseSharePrice.toFixed(), 'currentSharePrice is not set to init value');
    assert.equal(currentSharePerProposal.toFixed(), sharesPerProposal.toFixed(), 'currentSharePerProposal is not set to init value');
  });
  it('non-Owner should not be able to configure', async() => {
    const Deversi = await DeversiContract.deployed();
    try {
      await Deversi.configure(
        '8', '61', '61', '2000000000000000', '6', '10',
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
      '8', '61', '62', '2000000000000000', '6', '11',
      { from: accounts[0] }
    );
    const size = await Deversi.size.call();
    const fundRaisingPeriod = await Deversi.fundRaisingPeriod.call();
    const turnPeriod = await Deversi.turnPeriod.call();
    const baseSharePrice = await Deversi.baseSharePrice.call();
    const shareGrowthRate = await Deversi.shareGrowthRate.call();
    const sharesPerProposal = await Deversi.sharesPerProposal.call();
    assert.equal(size.toFixed(), '8', 'size is not configured');
    assert.equal(fundRaisingPeriod.toFixed(), '61', 'fundRaisingPeriod is not configured');
    assert.equal(turnPeriod.toFixed(), '62', 'turnPeriod is not configured');
    assert.equal(baseSharePrice.toFixed(), '2000000000000000', 'baseSharePrice is not configured');
    assert.equal(shareGrowthRate.toFixed(), '6', 'shareGrowthRate is not configured');
    assert.equal(sharesPerProposal.toFixed(), '11', 'sharesPerProposal is not configured');
  });
  it('zero funding should fail', async () => {
    const Deversi = await DeversiContract.deployed();
    try {
      await Deversi.funding(
        TEAM_ENUM.CAT,
        { from: accounts[0], value: '0' }
      );
    } catch(e) {
      return;
    }
    throw new Error('should not get here');
  });
  it('should be able to fund on the first time', async () => {
    const Deversi = await DeversiContract.deployed();
    const currentSharePrice = await Deversi.currentSharePrice.call();
    const [ catFund, dogFund ] = await Deversi.getTeamFundingStatus.call();
    assert.equal(catFund.toFixed(), '0', 'Invalid team fund');
    assert.equal(dogFund.toFixed(), '0', 'Invalid team fund');
    await Deversi.funding(
      TEAM_ENUM.CAT,
      { from: accounts[0], value: currentSharePrice.times(2).toFixed() }
    );
    const [
      isExist,
      team,
      CAT,
      DOG,
    ] = await Deversi.getUserStatus.call(accounts[0]);
    const [ catFundAfter, dogFundAfter ] = await Deversi.getTeamFundingStatus.call();
    assert.equal(catFundAfter.toFixed(), '2', 'Invalid team fund');
    assert.equal(dogFundAfter.toFixed(), '0', 'Invalid team fund');
    assert.equal(CAT.toFixed(), '2', 'Invalid share amount in team CAT');
    assert.equal(DOG.toFixed(), '0', 'Invalid share amount in team DOG');
    assert.equal(team.toFixed(), `${TEAM_ENUM.CAT}`, 'team should be CAT');
    assert.equal(isExist, true, 'isExist should be true');
  });

  it('fund again with the same account should fail', async () => {
    const Deversi = await DeversiContract.deployed();
    const currentSharePrice = await Deversi.currentSharePrice.call();
    try {
      await Deversi.funding(
        TEAM_ENUM.CAT,
        { from: accounts[0], value: currentSharePrice.times(2).toFixed() }
      );
    } catch(e) {
      return;
    }
    throw new Error('should not get here');
  });
});