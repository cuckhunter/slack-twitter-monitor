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

    await Promise.all([
  $taskService.runAllTweetsTask('realDonaldTrump'),
  // $taskService.runAllTweetsTask('ShoheiOhtaniWAR'),
  // $taskService.runAllTweetsTask('nntaleb'),
  // $taskService.runAllTweetsTask('RogerJStoneJr'),
  // $taskService.runAllTweetsTask('3xchair'),
  // $taskService.runAllTweetsTask('JoelEmbiid'),
  // $taskService.runHighScoringTweetsTask('mattyglesias'),
  // $taskService.runHighScoringTweetsTask('jbouie'),
  // $taskService.runAllTweetsTask('davidfrum', true),
  // $taskService.runHighScoringTweetsTask('paulkrugman'),
  $taskService.runAllTweetsTask('mtracey', true),
  // $taskService.runAllTweetsTask('joss'),
  // $taskService.runHighScoringTweetsTask('ColinCowherd'),
  // $taskService.runHighScoringTweetsTask('ChelseaClinton'),
  $taskService.runAllTweetsTask('RealSkipBayless'),
  // $taskService.runHighScoringTweetsTask('Cernovich'),
  // $taskService.runHighScoringTweetsTask('AnnCoulter'),
  $taskService.runHighScoringTweetsTask('benshapiro'),
  // $taskService.runAllTweetsTask('ScottAdamsSays'),
  // $taskService.runAllTweetsTask('kanyewest'),
  // $taskService.runHighScoringTweetsTask('mitchellvii'),
  // $taskService.runHighScoringTweetsTask('seanhannity'),
  // $taskService.runHighScoringTweetsTask('JulianAssange'),
  // $taskService.runHighScoringTweetsTask('RealAlexJones'),
  // $taskService.runHighScoringTweetsTask('PrisonPlanet'),
  // $taskService.runHighScoringTweetsTask('JamesOKeefeIII'),
  // $taskService.runHighScoringTweetsTask('piersmorgan'),
  // $taskService.runHighScoringTweetsTask('CHSommers'),
  // $taskService.runHighScoringTweetsTask('SheriffClarke'),
  // $taskService.runHighScoringTweetsTask('chuckwoolery'),
  // $taskService.runAllTweetsTask('RealJamesWoods', true),
  // $taskService.runHighScoringTweetsTask('johndurant'),
  // $taskService.runHighScoringTweetsTask('StefanMolyneux'),
  // $taskService.runHighScoringTweetsTask('femfreq'),
  // $taskService.runHighScoringTweetsTask('radicalbytes'),
  // $taskService.runHighScoringTweetsTask('leighalexander'),
  // $taskService.runHighScoringTweetsTask('stillgray', true),
  // $taskService.runHighScoringTweetsTask('KenJennings'),
  // $taskService.runHighScoringTweetsTask('arthur_affect'),
  // $taskService.runHighScoringTweetsTask('TuckerCarlson'),
  // $taskService.runHighScoringTweetsTask('UnburntWitch'),
  // $taskService.runHighScoringTweetsTask('lsarsour'),
  // $taskService.runHighScoringTweetsTask('womensmarch'),
  // $taskService.runHighScoringTweetsTask('davidbrockdc'),
  // $taskService.runHighScoringTweetsTask('ananavarro'),
  // $taskService.runHighScoringTweetsTask('HillaryClinton'),
  // $taskService.runHighScoringTweetsTask('BernieSanders'),
  // $taskService.runHighScoringTweetsTask('Gavin_McInnes'),
  // $taskService.runHighScoringTweetsTask('susanthesquark'),
  // $taskService.runHighScoringTweetsTask('sarahcuda'),
  // $taskService.runHighScoringTweetsTask('RobSchneider'),
  // $taskService.runHighScoringTweetsTask('tedcruz'),
  // $taskService.runHighScoringTweetsTask('JohnKasich'),
  // $taskService.runHighScoringTweetsTask('JebBush'),
  // $taskService.runHighScoringTweetsTask('Spacekatgal'),
  // $taskService.runHighScoringTweetsTask('EricTrump'),
  // $taskService.runHighScoringTweetsTask('DonaldJTrumpJr'),
  // $taskService.runHighScoringTweetsTask('JessicaValenti'),
  // $taskService.runHighScoringTweetsTask('thecampaignbook'),
  // $taskService.runHighScoringTweetsTask('ekp'),
  // $taskService.runHighScoringTweetsTask('AmandaMarcotte'),
  // $taskService.runHighScoringTweetsTask('randileeharper'),
  // $taskService.runHighScoringTweetsTask('johnlegend'),
  // $taskService.runHighScoringTweetsTask('feministabulous'),
  $taskService.runAllTweetsTask('mlombardiNFL', true),
  $taskService.runAllTweetsTask('RichardBSpencer', true),
  // $taskService.runHighScoringTweetsTask('GrrrGraphics'),
  // $taskService.runHighScoringTweetsTask('SarahKSilverman'),
  // $taskService.runHighScoringTweetsTask('ObamaMalik'),
  // $taskService.runHighScoringTweetsTask('SenWarren'),
  // $taskService.runHighScoringTweetsTask('jartaylor'),
  // $taskService.runHighScoringTweetsTask('tanehisicoates'),
  // $taskService.runHighScoringTweetsTask('neeratanden'),
  // $taskService.runHighScoringTweetsTask('BillSimmons'),
  // $taskService.runHighScoringTweetsTask('KamalaHarris'),
  // $taskService.runHighScoringTweetsTask('donnabrazile'),
  // $taskService.runHighScoringTweetsTask('Snowden'),
  // $taskService.runHighScoringTweetsTask('realJeffreyLord'),
  // $taskService.runHighScoringTweetsTask('sallykohn'),
  // $taskService.runHighScoringTweetsTask('BenKuchera'),
  // $taskService.runHighScoringTweetsTask('BenSasse'),
  // $taskService.runHighScoringTweetsTask('SarahPalinUSA'),
  // $taskService.runHighScoringTweetsTask('arrington'),
  // $taskService.runHighScoringTweetsTask('neiltyson'),
  // $taskService.runHighScoringTweetsTask('sama'),
  // $taskService.runHighScoringTweetsTask('elonmusk'),
  // $taskService.runAllTweetsTask('GregABedard'),
  // $taskService.runAllTweetsTask('Keefe21'),
  // $taskService.runAllTweetsTask('adamjones985'),
  // $taskService.runAllTweetsTask('BenVolin'),
  // $taskService.runHighScoringTweetsTask('RubinReport'),
  // $taskService.runHighScoringTweetsTask('kurteichenwald'),
  // $taskService.runHighScoringTweetsTask('EricRWeinstein'),
  // $taskService.runHighScoringTweetsTask('balajis'),
  // $taskService.runHighScoringTweetsTask('marcushjohnson'),
  // $taskService.runHighScoringTweetsTask('davidhogg111'),
  // $taskService.runHighScoringTweetsTask('funder'),
  $taskService.runAllTweetsTask('robinhanson', true),
  $taskService.runAllTweetsTask('tylercowen'),
  $taskService.runAllTweetsTask('Ahmadinejad1956'),
  $taskService.runAllTweetsTask('JBurtonXP', true),
  $taskService.runAllTweetsTask('porter14159', true),
  // $taskService.runAllTweetsTask('ericgarland', true),
  // $taskService.runHighScoringTweetsTask('KyleKashuv'),
  // $taskService.runHighScoringTweetsTask('JackPosobiec'),
  // $taskService.runHighScoringTweetsTask('charliekirk11'),
  // $taskService.runHighScoringTweetsTask('scrowder'),
  // $taskService.runHighScoringTweetsTask('HAGOODMANAUTHOR'),
  $taskService.runAllTweetsTask('RealCandaceO'),
  // $taskService.runAllTweetsTask('GCTigerTracker'),
  $taskService.runHighScoringTweetsTask('NickJFuentes'),
  //$taskService.runHighScoringTweetsTask('ScottPresler'),
  //$taskService.runHighScoringTweetsTask('SageRosenfels18'),
  $taskService.runHighScoringTweetsTask('jonfavs'),
  $taskService.runHighScoringTweetsTask('jonlovett'),
  $taskService.runHighScoringTweetsTask('danpfeiffer'),
  $taskService.runHighScoringTweetsTask('ronanfarrow'),
  $taskService.runHighScoringTweetsTask('TVietor08'),
  $taskService.runHighScoringTweetsTask('brhodes'),
  // $taskService.runHighScoringTweetsTask('MacaesBruno'),
  // $taskService.runHighScoringTweetsTask('benjaminwittes'),
  // $taskService.runBestTweetsTask(),
    ]);

  } catch (e) {

    await $slackService.crashReport(e.stack);
    throw(e);

  }

}

module.exports = inject(app);
