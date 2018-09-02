'use strict';

const inject = require('./inject');

async function app([$env, $logger, $server, $slackService, $taskService]) {

  // Start server
  const PORT = $env.PORT || 80;

  try {

    $server.listen(PORT, () => {
      $logger.info(`Server listening on port ${PORT}`);
    });

    // Start tasks
    const [allTweetsInterval, bestTweetsInterval, highScoringTweetsInterval] =
      ($env.MODE == 'prod') ?
        [60 * 1000, 120 * 60 * 1000, 90 * 1000] :
        [10 * 1000, 60 * 1000, 60 * 1000];

    await Promise.all([
  $taskService.runAllTweetsTask('realDonaldTrump', allTweetsInterval),
  // $taskService.runAllTweetsTask('ShoheiOhtaniWAR', allTweetsInterval),
  // $taskService.runAllTweetsTask('nntaleb', allTweetsInterval),
  // $taskService.runAllTweetsTask('RogerJStoneJr', allTweetsInterval),
  //$taskService.runAllTweetsTask('3xchair', allTweetsInterval),
  // $taskService.runAllTweetsTask('JoelEmbiid', allTweetsInterval),
  // $taskService.runHighScoringTweetsTask('mattyglesias', highScoringTweetsInterval),
  // $taskService.runHighScoringTweetsTask('jbouie', highScoringTweetsInterval),
  $taskService.runHighScoringTweetsTask('davidfrum', allTweetsInterval),
  // $taskService.runHighScoringTweetsTask('paulkrugman', highScoringTweetsInterval),
  $taskService.runAllTweetsTask('mtracey', allTweetsInterval),
  // $taskService.runAllTweetsTask('joss', allTweetsInterval),
      // $taskService.runHighScoringTweetsTask('ColinCowherd', highScoringTweetsInterval),
  // $taskService.runHighScoringTweetsTask('ChelseaClinton', highScoringTweetsInterval),
  $taskService.runAllTweetsTask('RealSkipBayless', allTweetsInterval),
  // $taskService.runHighScoringTweetsTask('Cernovich', highScoringTweetsInterval),
  // $taskService.runHighScoringTweetsTask('AnnCoulter', highScoringTweetsInterval),
  $taskService.runHighScoringTweetsTask('benshapiro', allTweetsInterval),
  // $taskService.runAllTweetsTask('ScottAdamsSays', allTweetsInterval),
  // $taskService.runAllTweetsTask('kanyewest', allTweetsInterval),
  // $taskService.runHighScoringTweetsTask('mitchellvii', highScoringTweetsInterval),
  // $taskService.runHighScoringTweetsTask('seanhannity', highScoringTweetsInterval),
  // $taskService.runHighScoringTweetsTask('JulianAssange', highScoringTweetsInterval),
  // $taskService.runHighScoringTweetsTask('RealAlexJones', highScoringTweetsInterval),
  // $taskService.runHighScoringTweetsTask('PrisonPlanet', highScoringTweetsInterval),
      // $taskService.runHighScoringTweetsTask('JamesOKeefeIII', highScoringTweetsInterval),
  // $taskService.runHighScoringTweetsTask('piersmorgan', highScoringTweetsInterval),
  // $taskService.runHighScoringTweetsTask('CHSommers', highScoringTweetsInterval),
      // $taskService.runHighScoringTweetsTask('SheriffClarke', highScoringTweetsInterval),
  // $taskService.runHighScoringTweetsTask('chuckwoolery', highScoringTweetsInterval),
  // $taskService.runAllTweetsTask('RealJamesWoods', highScoringTweetsInterval),
  // $taskService.runHighScoringTweetsTask('johndurant', highScoringTweetsInterval),
  // $taskService.runHighScoringTweetsTask('StefanMolyneux', highScoringTweetsInterval),
  // $taskService.runHighScoringTweetsTask('femfreq', highScoringTweetsInterval),
  // $taskService.runHighScoringTweetsTask('radicalbytes', highScoringTweetsInterval),
  // $taskService.runHighScoringTweetsTask('leighalexander', highScoringTweetsInterval),
      $taskService.runHighScoringTweetsTask('stillgray', allTweetsInterval),
  // $taskService.runHighScoringTweetsTask('KenJennings', highScoringTweetsInterval),
  // $taskService.runHighScoringTweetsTask('arthur_affect', highScoringTweetsInterval),
  // $taskService.runHighScoringTweetsTask('TuckerCarlson', highScoringTweetsInterval),
      // $taskService.runHighScoringTweetsTask('UnburntWitch', highScoringTweetsInterval),
  // $taskService.runHighScoringTweetsTask('lsarsour', highScoringTweetsInterval),
  // $taskService.runHighScoringTweetsTask('womensmarch', highScoringTweetsInterval),
  // $taskService.runHighScoringTweetsTask('davidbrockdc', highScoringTweetsInterval),
      // $taskService.runHighScoringTweetsTask('ananavarro', highScoringTweetsInterval),
  // $taskService.runHighScoringTweetsTask('HillaryClinton', highScoringTweetsInterval),
  // $taskService.runHighScoringTweetsTask('BernieSanders', highScoringTweetsInterval),
  // $taskService.runHighScoringTweetsTask('Gavin_McInnes', highScoringTweetsInterval),
  // $taskService.runHighScoringTweetsTask('susanthesquark', highScoringTweetsInterval),
  // $taskService.runHighScoringTweetsTask('sarahcuda', highScoringTweetsInterval),
  // $taskService.runHighScoringTweetsTask('RobSchneider', highScoringTweetsInterval),
  // $taskService.runHighScoringTweetsTask('tedcruz', highScoringTweetsInterval),
      // $taskService.runHighScoringTweetsTask('JohnKasich', highScoringTweetsInterval),
      // $taskService.runHighScoringTweetsTask('JebBush', highScoringTweetsInterval),
      // $taskService.runHighScoringTweetsTask('Spacekatgal', highScoringTweetsInterval),
      // $taskService.runHighScoringTweetsTask('EricTrump', highScoringTweetsInterval),
      // $taskService.runHighScoringTweetsTask('DonaldJTrumpJr', highScoringTweetsInterval),
      // $taskService.runHighScoringTweetsTask('JessicaValenti', highScoringTweetsInterval),
      // $taskService.runHighScoringTweetsTask('thecampaignbook', highScoringTweetsInterval),
      // $taskService.runHighScoringTweetsTask('ekp', highScoringTweetsInterval),
      // $taskService.runHighScoringTweetsTask('AmandaMarcotte', highScoringTweetsInterval),
      // $taskService.runHighScoringTweetsTask('randileeharper', highScoringTweetsInterval),
      // $taskService.runHighScoringTweetsTask('johnlegend', highScoringTweetsInterval),
  // $taskService.runHighScoringTweetsTask('feministabulous', highScoringTweetsInterval),
      $taskService.runAllTweetsTask('mlombardiNFL', allTweetsInterval),
  $taskService.runHighScoringTweetsTask('RichardBSpencer', allTweetsInterval),
      // $taskService.runHighScoringTweetsTask('GrrrGraphics', highScoringTweetsInterval),
      // $taskService.runHighScoringTweetsTask('SarahKSilverman', highScoringTweetsInterval),
  // $taskService.runHighScoringTweetsTask('ObamaMalik', highScoringTweetsInterval),
  // $taskService.runHighScoringTweetsTask('SenWarren', highScoringTweetsInterval),
  // $taskService.runHighScoringTweetsTask('jartaylor', highScoringTweetsInterval),
      // $taskService.runHighScoringTweetsTask('tanehisicoates', highScoringTweetsInterval),
      // $taskService.runHighScoringTweetsTask('neeratanden', highScoringTweetsInterval),
      // $taskService.runHighScoringTweetsTask('BillSimmons', highScoringTweetsInterval),
      // $taskService.runHighScoringTweetsTask('KamalaHarris', highScoringTweetsInterval),
      // $taskService.runHighScoringTweetsTask('donnabrazile', highScoringTweetsInterval),
      // $taskService.runHighScoringTweetsTask('Snowden', highScoringTweetsInterval),
      // $taskService.runHighScoringTweetsTask('realJeffreyLord', highScoringTweetsInterval),
      // $taskService.runHighScoringTweetsTask('sallykohn', highScoringTweetsInterval),
      // $taskService.runHighScoringTweetsTask('BenKuchera', highScoringTweetsInterval),
      // $taskService.runHighScoringTweetsTask('BenSasse', highScoringTweetsInterval),
      // $taskService.runHighScoringTweetsTask('SarahPalinUSA', highScoringTweetsInterval),
      // $taskService.runHighScoringTweetsTask('arrington', highScoringTweetsInterval),
      // $taskService.runHighScoringTweetsTask('neiltyson', highScoringTweetsInterval),
      // $taskService.runHighScoringTweetsTask('sama', highScoringTweetsInterval),
      // $taskService.runHighScoringTweetsTask('elonmusk', highScoringTweetsInterval),
      // $taskService.runAllTweetsTask('GregABedard', allTweetsInterval),
      // $taskService.runAllTweetsTask('Keefe21', allTweetsInterval),
      // $taskService.runAllTweetsTask('adamjones985', allTweetsInterval),
      // $taskService.runAllTweetsTask('BenVolin', allTweetsInterval),
      // $taskService.runBestTweetsTask('Phi_Delta_Alpha', bestTweetsInterval),
  // $taskService.runBestTweetsTask('RubinReport', highScoringTweetsInterval),
  // $taskService.runBestTweetsTask('kurteichenwald', highScoringTweetsInterval),
  // $taskService.runBestTweetsTask('EricRWeinstein', highScoringTweetsInterval),
  // $taskService.runBestTweetsTask('balajis', highScoringTweetsInterval),
  // $taskService.runBestTweetsTask('marcushjohnson', highScoringTweetsInterval),
  // $taskService.runBestTweetsTask('davidhogg111', highScoringTweetsInterval),
  // $taskService.runBestTweetsTask('funder', allTweetsInterval),
  // $taskService.runBestTweetsTask('robinhanson', highScoringTweetsInterval),
  // $taskService.runBestTweetsTask('ericgarland', highScoringTweetsInterval),
  // $taskService.runBestTweetsTask('KyleKashuv', highScoringTweetsInterval),
  // $taskService.runBestTweetsTask('JackPosobiec', highScoringTweetsInterval),
  // $taskService.runBestTweetsTask('charliekirk11', highScoringTweetsInterval),
  // $taskService.runBestTweetsTask('scrowder', highScoringTweetsInterval),
  // $taskService.runBestTweetsTask('HAGOODMANAUTHOR', highScoringTweetsInterval),
  $taskService.runAllTweetsTask('RealCandaceO', allTweetsInterval),
  // $taskService.runAllTweetsTask('GCTigerTracker', allTweetsInterval),
  $taskService.runAllTweetsTask('NickJFuentes', allTweetsInterval),
  // ScottPresler
    ]);

  } catch (e) {

    await $slackService.crashReport(e.stack);
    throw(e);

  }

}

module.exports = inject(app);
