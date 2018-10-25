'use strict';

const fs = require('fs');
const inject = require('./inject');
const path = require('path');

async function app([$env, $logger, $server, $slackService, $taskService]) {

  // Start server
  const PORT = $env.PORT || 80;

  try {

    //const screenNames = fs.readFileSync(path.join($env.HOME, 'screenNames'), 'utf8');
    //$logger.info(`screenNames: ${screenNames}`);

    $server.listen(PORT, () => {
      $logger.info(`Server listening on port ${PORT}`);
    });

    // Start tasks

    await Promise.all([
  $taskService.runAllTweetsTask('realDonaldTrump', false),
  $taskService.runAllTweetsTask('RealSkipBayless', false),
  $taskService.runAllTweetsTask('mtracey'),
  $taskService.runAllTweetsTask('NFL_Scorigami'),
  $taskService.runAllTweetsTask('acsimonds'),
  $taskService.runAllTweetsTask('MLBBarrelAlert'),
  // $taskService.runAllTweetsTask('HelmetStalker'),
  $taskService.runAllTweetsTask('jaysonst'),
  // $taskService.runAllTweetsTask('TheRealDisco'),
  // $taskService.runAllTweetsTask('PolitiFact', false),
  // $taskService.runAllTweetsTask('ddale8', false),
  $taskService.runAllTweetsTask('pgammo'),
  // $taskService.runAllTweetsTask('Kato_Kaelin'),
  $taskService.runHighScoringTweetsTask('RealJamesWoods'),
  // $taskService.runAllTweetsTask('ShoheiOhtaniWAR'),
  // $taskService.runAllTweetsTask('RogerJStoneJr'), // account suspended
  // $taskService.runAllTweetsTask('3xchair'),
  // $taskService.runAllTweetsTask('JoelEmbiid'),
  $taskService.runHighScoringTweetsTask('nntaleb'),
  $taskService.runHighScoringTweetsTask('mattyglesias'),
  // $taskService.runHighScoringTweetsTask('jbouie'),
  $taskService.runHighScoringTweetsTask('davidfrum'),
  $taskService.runHighScoringTweetsTask('paulkrugman'),
  // $taskService.runHighScoringTweetsTask('joss'),
  // $taskService.runHighScoringTweetsTask('ColinCowherd'),
  $taskService.runHighScoringTweetsTask('ChelseaClinton'),
  // $taskService.runHighScoringTweetsTask('Cernovich'),
  $taskService.runHighScoringTweetsTask('AnnCoulter'),
  $taskService.runHighScoringTweetsTask('benshapiro'),
  $taskService.runHighScoringTweetsTask('ScottAdamsSays'),
  // $taskService.runAllTweetsTask('kanyewest'),
  // $taskService.runHighScoringTweetsTask('mitchellvii'),
  $taskService.runHighScoringTweetsTask('seanmdav'),
  // $taskService.runHighScoringTweetsTask('seanhannity'),
  // $taskService.runHighScoringTweetsTask('JulianAssange'),
  // $taskService.runHighScoringTweetsTask('RealAlexJones'), // account suspended
  $taskService.runHighScoringTweetsTask('PrisonPlanet'),
  $taskService.runHighScoringTweetsTask('JamesOKeefeIII'),
  $taskService.runHighScoringTweetsTask('piersmorgan'),
  // $taskService.runHighScoringTweetsTask('CHSommers'),
  // $taskService.runHighScoringTweetsTask('SheriffClarke'),
  $taskService.runHighScoringTweetsTask('chuckwoolery'),
  $taskService.runHighScoringTweetsTask('johndurant'),
  $taskService.runHighScoringTweetsTask('StefanMolyneux'),
  // $taskService.runHighScoringTweetsTask('femfreq'),
  $taskService.runHighScoringTweetsTask('anitasarkeesian'),
  $taskService.runHighScoringTweetsTask('radicalbytes'),
  // $taskService.runHighScoringTweetsTask('leighalexander'),
  // $taskService.runHighScoringTweetsTask('stillgray'),
  $taskService.runHighScoringTweetsTask('KenJennings'),
  // $taskService.runHighScoringTweetsTask('aigkenham'),
  // $taskService.runHighScoringTweetsTask('atensnut'),
  $taskService.runHighScoringTweetsTask('arthur_affect'),
  $taskService.runHighScoringTweetsTask('TuckerCarlson'),
  // $taskService.runHighScoringTweetsTask('UnburntWitch'),
  // $taskService.runHighScoringTweetsTask('lsarsour'),
  $taskService.runHighScoringTweetsTask('womensmarch'),
  $taskService.runHighScoringTweetsTask('davidbrockdc'),
  // $taskService.runHighScoringTweetsTask('ananavarro'),
  $taskService.runHighScoringTweetsTask('HillaryClinton'),
  $taskService.runHighScoringTweetsTask('BernieSanders'),
  // $taskService.runHighScoringTweetsTask('Gavin_McInnes'), account suspended
  // $taskService.runHighScoringTweetsTask('susanthesquark'),
  // $taskService.runHighScoringTweetsTask('sarahcuda'),
  // $taskService.runHighScoringTweetsTask('RobSchneider'),
  $taskService.runHighScoringTweetsTask('tedcruz'),
  // $taskService.runHighScoringTweetsTask('JohnKasich'),
  // $taskService.runHighScoringTweetsTask('JebBush'),
  $taskService.runHighScoringTweetsTask('Spacekatgal'),
  // $taskService.runHighScoringTweetsTask('EricTrump'),
  $taskService.runHighScoringTweetsTask('DonaldJTrumpJr'),
  $taskService.runHighScoringTweetsTask('JessicaValenti'),
  // $taskService.runHighScoringTweetsTask('thecampaignbook'),
  $taskService.runHighScoringTweetsTask('ekp'),
  $taskService.runHighScoringTweetsTask('AmandaMarcotte'),
  // $taskService.runHighScoringTweetsTask('randileeharper'),
  $taskService.runHighScoringTweetsTask('johnlegend'),
  // $taskService.runHighScoringTweetsTask('feministabulous'),
  $taskService.runHighScoringTweetsTask('mlombardiNFL'),
  $taskService.runHighScoringTweetsTask('RichardBSpencer'),
  // $taskService.runHighScoringTweetsTask('GrrrGraphics'),
  // $taskService.runHighScoringTweetsTask('SarahKSilverman'),
  $taskService.runHighScoringTweetsTask('NateSilver538'),
  $taskService.runHighScoringTweetsTask('ObamaMalik'),
  $taskService.runHighScoringTweetsTask('SenWarren'),
  // $taskService.runHighScoringTweetsTask('jartaylor'), // account suspended
  // $taskService.runHighScoringTweetsTask('tanehisicoates'), // account deleted
  // $taskService.runHighScoringTweetsTask('neeratanden'),
  // $taskService.runHighScoringTweetsTask('BillSimmons'),
  // $taskService.runHighScoringTweetsTask('KamalaHarris'),
  // $taskService.runHighScoringTweetsTask('donnabrazile'),
  // $taskService.runHighScoringTweetsTask('Snowden'),
  // $taskService.runHighScoringTweetsTask('realJeffreyLord'),
  // $taskService.runHighScoringTweetsTask('sallykohn'),
  // $taskService.runHighScoringTweetsTask('BenKuchera'),
  $taskService.runHighScoringTweetsTask('BenSasse'),
  $taskService.runHighScoringTweetsTask('SarahPalinUSA'),
  // $taskService.runHighScoringTweetsTask('arrington'),
  // $taskService.runHighScoringTweetsTask('neiltyson'),
  // $taskService.runHighScoringTweetsTask('sama'),
  $taskService.runHighScoringTweetsTask('elonmusk'),
  $taskService.runHighScoringTweetsTask('KimStrassel'),
  // $taskService.runAllTweetsTask('GregABedard'),
  // $taskService.runAllTweetsTask('Keefe21'),
  // $taskService.runAllTweetsTask('adamjones985'),
  // $taskService.runAllTweetsTask('BenVolin'),
  $taskService.runHighScoringTweetsTask('ClayTravis'),
  // $taskService.runHighScoringTweetsTask('RubinReport'),
  $taskService.runHighScoringTweetsTask('kurteichenwald'),
  $taskService.runHighScoringTweetsTask('EricRWeinstein'),
  $taskService.runHighScoringTweetsTask('BretWeinstein'),
  // $taskService.runHighScoringTweetsTask('balajis'),
  $taskService.runHighScoringTweetsTask('marcushjohnson'),
  $taskService.runHighScoringTweetsTask('davidhogg111'),
  // $taskService.runHighScoringTweetsTask('funder'),
  // $taskService.runHighScoringTweetsTask('robinhanson'),
  // $taskService.runHighScoringTweetsTask('tylercowen'),
  // $taskService.runHighScoringTweetsTask('Ahmadinejad1956'),
  $taskService.runHighScoringTweetsTask('JBurtonXP'),
  $taskService.runHighScoringTweetsTask('porter14159'),
  $taskService.runHighScoringTweetsTask('ericgarland'),
  $taskService.runHighScoringTweetsTask('KyleKashuv'),
  // $taskService.runHighScoringTweetsTask('JackPosobiec'),
  // $taskService.runHighScoringTweetsTask('charliekirk11'),
  // $taskService.runHighScoringTweetsTask('scrowder'),
  $taskService.runHighScoringTweetsTask('HAGOODMANAUTHOR'),
  $taskService.runHighScoringTweetsTask('RealCandaceO'),
  // $taskService.runAllTweetsTask('GCTigerTracker'),
  $taskService.runHighScoringTweetsTask('NickJFuentes'),
  // $taskService.runHighScoringTweetsTask('ScottPresler'),
  // $taskService.runHighScoringTweetsTask('SageRosenfels18'),
  $taskService.runHighScoringTweetsTask('jonfavs'),
  $taskService.runHighScoringTweetsTask('jonlovett'),
  $taskService.runHighScoringTweetsTask('danpfeiffer'),
  $taskService.runHighScoringTweetsTask('TVietor08'),
  $taskService.runHighScoringTweetsTask('brhodes'),
  $taskService.runHighScoringTweetsTask('ronanfarrow'),
  $taskService.runHighScoringTweetsTask('MacaesBruno'),
  // $taskService.runHighScoringTweetsTask('CalebJHull'),
  $taskService.runHighScoringTweetsTask('DineshDSouza'),
  $taskService.runHighScoringTweetsTask('BuckSexton'),
  // $taskService.runHighScoringTweetsTask('wilw'), // account deleted
  $taskService.runHighScoringTweetsTask('matthewjdowd'),
  // $taskService.runHighScoringTweetsTask('JRubinBlogger'),
  $taskService.runHighScoringTweetsTask('MaxBoot'),
  $taskService.runHighScoringTweetsTask('HeerJeet'),
  // $taskService.runHighScoringTweetsTask('gillibrandny'),
  $taskService.runHighScoringTweetsTask('benjaminwittes'),
  $taskService.runHighScoringTweetsTask('chrislhayes'),
  $taskService.runHighScoringTweetsTask('ggreenwald'),
  // $taskService.runHighScoringTweetsTask('AdamBaldwin'),
  $taskService.runHighScoringTweetsTask('jordanbpeterson'),
  // $taskService.runHighScoringTweetsTask('Yascha_Mounk'),
  // $taskService.runHighScoringTweetsTask('kanyewest'), //deactivated
  // $taskService.runHighScoringTweetsTask('BillKristol'),
  $taskService.runHighScoringTweetsTask('RealSaavedra'),
  $taskService.runHighScoringTweetsTask('RRTIndustries'),
  $taskService.runHighScoringTweetsTask('IngrahamAngle'),
  $taskService.runHighScoringTweetsTask('michellemalkin'),
  $taskService.runHighScoringTweetsTask('BrittMcHenry'),
  // $taskService.runHighScoringTweetsTask('jaredlholt'),
  $taskService.runHighScoringTweetsTask('joshbloch'),
  // $taskService.runBestTweetsTask(),
    ]);

  } catch (e) {

    await $slackService.crashReport(e.stack);
    throw(e);

  }

}

module.exports = inject(app);
