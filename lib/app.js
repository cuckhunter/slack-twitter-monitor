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

    await $slackService.message({
      username: 'twittertest',
      type: "message",
      ts: "1548568871.000500",
      attachments: [
        {
        "fallback": "<https://twitter.com/mlombardiNFL|@mlombardiNFL>: Thanks for the support Jim <https://twitter.com/CoachJimBoone/status/1041368942365863936>",
        "ts": 1537116981,
        "author_name": "Michael Lombardi",
        "author_link": "https://twitter.com/mlombardiNFL/status/1041370216398090241",
        "author_icon": "https://pbs.twimg.com/profile_images/1083165038251143170/g1zDKi3v_normal.jpg",
        "author_subname": "@mlombardiNFL",
        "text": "Thanks for the support Jim <https://twitter.com/CoachJimBoone/status/1041368942365863936>",
        "service_name": "twitter",
        "service_url": "https://twitter.com/",
        "from_url": "https://twitter.com/mlombardiNFL/status/1041370216398090241",
        "id": 1,
        "original_url": "https://twitter.com/mlombardiNFL/status/1041370216398090241",
        "footer": "Twitter",
        "footer_icon": "https://a.slack-edge.com/6e067/img/services/twitter_pixel_snapped_32.png"
        },
      ],
    });

    // Start tasks

    /*await Promise.all([
  // $taskService.runPredictItTask(5087), // Govt shutdown
  $taskService.runAllTweetsTask('realDonaldTrump', false),
  $taskService.runAllTweetsTask('RealSkipBayless', false),
  $taskService.runHighScoringTweetsTask('mtracey', 'high'),
  // $taskService.runAllTweetsTask('NFL_Scorigami'),
  $taskService.runAllTweetsTask('VonAbele'),
  // $taskService.runAllTweetsTask('acsimonds', false), // protected
  $taskService.runHighScoringTweetsTask('NickJFuentes', 'low'),
  $taskService.runHighScoringTweetsTask('BuckSexton'),
  // $taskService.runHighScoringTweetsTask('porter14159'),
  // $taskService.runHighScoringTweetsTask('RRTIndustries'), // suspended
  $taskService.runHighScoringTweetsTask('KenJennings'),
  $taskService.runHighScoringTweetsTask('ScottAdamsSays', 'high'),
  $taskService.runHighScoringTweetsTask('benshapiro', 'high'),
  $taskService.runHighScoringTweetsTask('AnnCoulter', 'high'),
  $taskService.runHighScoringTweetsTask('davidfrum', 'high'),
  $taskService.runHighScoringTweetsTask('arthur_affect'),
  $taskService.runHighScoringTweetsTask('elonmusk', 'high'),
  $taskService.runHighScoringTweetsTask('NateSilver538', 'high'),
  $taskService.runHighScoringTweetsTask('RichardBSpencer', 'high'),
  $taskService.runHighScoringTweetsTask('ObamaMalik'),
  $taskService.runHighScoringTweetsTask('kurteichenwald'),
  $taskService.runHighScoringTweetsTask('KyleKashuv'),
  // $taskService.runHighScoringTweetsTask('HAGOODMANAUTHOR'), // deactivated
  $taskService.runHighScoringTweetsTask('MacaesBruno', 'high'),
  $taskService.runHighScoringTweetsTask('ronanfarrow'),
  $taskService.runHighScoringTweetsTask('DineshDSouza', 'high'),
  $taskService.runHighScoringTweetsTask('jordanbpeterson', 'high'),
  $taskService.runHighScoringTweetsTask('michellemalkin', 'high'),
  $taskService.runHighScoringTweetsTask('BrittMcHenry', 'high'),
  $taskService.runHighScoringTweetsTask('joshbloch', 'high'),
  $taskService.runHighScoringTweetsTask('ggreenwald'),
  $taskService.runHighScoringTweetsTask('EricRWeinstein', 'high'),
  $taskService.runHighScoringTweetsTask('BretWeinstein', 'high'),
  // $taskService.runHighScoringTweetsTask('TheRealDisco'),
  $taskService.runHighScoringTweetsTask('seanmdav'),
  $taskService.runHighScoringTweetsTask('RealSaavedra', 'low'),
  // $taskService.runHighScoringTweetsTask('femfreq'),
  $taskService.runHighScoringTweetsTask('anitasarkeesian'),
  $taskService.runHighScoringTweetsTask('radicalbytes'),
  // $taskService.runHighScoringTweetsTask('lsarsour'),
  // $taskService.runHighScoringTweetsTask('womensmarch'),
  $taskService.runHighScoringTweetsTask('DonaldJTrumpJr', 'high'),
  $taskService.runHighScoringTweetsTask('ekp', 'high'),
  $taskService.runHighScoringTweetsTask('funder', 'low'),
  $taskService.runHighScoringTweetsTask('edasante77'),
  // $taskService.runHighScoringTweetsTask('EdLatimore'),
  // $taskService.runHighScoringTweetsTask('AJA_Cortes'),
  $taskService.runHighScoringTweetsTask('ComfortablySmug', 'low'),
  $taskService.runHighScoringTweetsTask('peterbrimelow'),
  $taskService.runHighScoringTweetsTask('ezraklein', 'high'),
  $taskService.runHighScoringTweetsTask('DavidAFrench'),
  // $taskService.runHighScoringTweetsTask('MattBruenig'),
  $taskService.runHighScoringTweetsTask('ebruenig', 'low'),
  $taskService.runHighScoringTweetsTask('jaredlholt', 'low'),
  $taskService.runHighScoringTweetsTask('ashleyfeinberg', 'low'),
  $taskService.runHighScoringTweetsTask('GrafVonGrau'),
  $taskService.runHighScoringTweetsTask('classicaltheis'),
  // $taskService.runHighScoringTweetsTask('gogreen18'),
  // $taskService.runHighScoringTweetsTask('piagnone'),
  $taskService.runHighScoringTweetsTask('vermeullarmine'),
  $taskService.runHighScoringTweetsTask('davidhogg111', 'low'),
  // // $taskService.runAllTweetsTask('MLBBarrelAlert'),
  // // $taskService.runAllTweetsTask('HelmetStalker'),
  // // $taskService.runAllTweetsTask('ShoheiOhtaniWAR'),
  // $taskService.runAllTweetsTask('GCTigerTracker'),
  // // $taskService.runAllTweetsTask('PolitiFact', false),
  // // $taskService.runAllTweetsTask('ddale8', false),
  // // $taskService.runAllTweetsTask('Kato_Kaelin'),
  // $taskService.runHighScoringTweetsTask('RealJamesWoods'),
  // // $taskService.runAllTweetsTask('RogerJStoneJr'), // suspended
  // // $taskService.runAllTweetsTask('3xchair'),
  // // $taskService.runAllTweetsTask('JoelEmbiid'),
  $taskService.runHighScoringTweetsTask('nntaleb'),
  $taskService.runHighScoringTweetsTask('mattyglesias'),
  $taskService.runHighScoringTweetsTask('jbouie', 'low'),
  $taskService.runHighScoringTweetsTask('paulkrugman', 'high'),
  // // $taskService.runHighScoringTweetsTask('joss'),
  $taskService.runHighScoringTweetsTask('ChelseaClinton', 'high'),
  // // $taskService.runHighScoringTweetsTask('Cernovich'),
  // // $taskService.runHighScoringTweetsTask('mitchellvii'),
  // // $taskService.runHighScoringTweetsTask('seanhannity'),
  // // $taskService.runHighScoringTweetsTask('JulianAssange'),
  // // $taskService.runHighScoringTweetsTask('RealAlexJones'), // suspended
  // $taskService.runHighScoringTweetsTask('PrisonPlanet'),
  // $taskService.runHighScoringTweetsTask('JamesOKeefeIII'),
  // $taskService.runHighScoringTweetsTask('piersmorgan'),
  // // $taskService.runHighScoringTweetsTask('CHSommers'),
  // // $taskService.runHighScoringTweetsTask('SheriffClarke'),
  // $taskService.runHighScoringTweetsTask('chuckwoolery'),
  // $taskService.runHighScoringTweetsTask('johndurant'),
  $taskService.runHighScoringTweetsTask('StefanMolyneux', 'low'),
  // // $taskService.runHighScoringTweetsTask('leighalexander'),
  // // $taskService.runHighScoringTweetsTask('UnburntWitch'),
  $taskService.runHighScoringTweetsTask('AmandaMarcotte'),
  $taskService.runHighScoringTweetsTask('JessicaValenti'),
  $taskService.runHighScoringTweetsTask('Spacekatgal'),
  // // $taskService.runHighScoringTweetsTask('randileeharper'),
  // // $taskService.runHighScoringTweetsTask('susanthesquark'),
  // // $taskService.runHighScoringTweetsTask('sarahcuda'),
  $taskService.runHighScoringTweetsTask('feministabulous'),
  // // $taskService.runHighScoringTweetsTask('stillgray'),
  // // $taskService.runHighScoringTweetsTask('aigkenham'),
  // // $taskService.runHighScoringTweetsTask('atensnut'),
  // $taskService.runHighScoringTweetsTask('TuckerCarlson'),
  // $taskService.runHighScoringTweetsTask('davidbrockdc'),
  // // $taskService.runHighScoringTweetsTask('ananavarro'),
  // $taskService.runHighScoringTweetsTask('HillaryClinton'),
  // $taskService.runHighScoringTweetsTask('BernieSanders'),
  // // $taskService.runHighScoringTweetsTask('Gavin_McInnes'), // suspended
  // // $taskService.runHighScoringTweetsTask('RobSchneider'),
  $taskService.runHighScoringTweetsTask('tedcruz', 'high'),
  // // $taskService.runHighScoringTweetsTask('JohnKasich'),
  // // $taskService.runHighScoringTweetsTask('JebBush'),
  // // $taskService.runHighScoringTweetsTask('EricTrump'),
  // // $taskService.runHighScoringTweetsTask('thecampaignbook'),
  // $taskService.runHighScoringTweetsTask('johnlegend'),
  // // $taskService.runHighScoringTweetsTask('GrrrGraphics'),
  // // $taskService.runHighScoringTweetsTask('SarahKSilverman'),
  // $taskService.runHighScoringTweetsTask('SenWarren'),
  // // $taskService.runHighScoringTweetsTask('jartaylor'), // suspended
  // // $taskService.runHighScoringTweetsTask('tanehisicoates'), // deactivated
  $taskService.runHighScoringTweetsTask('neeratanden', 'low'),
  // // $taskService.runHighScoringTweetsTask('KamalaHarris'),
  // // $taskService.runHighScoringTweetsTask('donnabrazile'),
  // // $taskService.runHighScoringTweetsTask('Snowden'),
  // // $taskService.runHighScoringTweetsTask('realJeffreyLord'),
  // // $taskService.runHighScoringTweetsTask('sallykohn'),
  // // $taskService.runHighScoringTweetsTask('BenKuchera'),
  $taskService.runHighScoringTweetsTask('BenSasse', 'high'),
  // $taskService.runHighScoringTweetsTask('SarahPalinUSA'),
  // // $taskService.runHighScoringTweetsTask('arrington'),
  // // $taskService.runHighScoringTweetsTask('neiltyson'),
  // // $taskService.runHighScoringTweetsTask('sama'),
  // $taskService.runHighScoringTweetsTask('KimStrassel'),
  // $taskService.runAllTweetsTask('mlombardiNFL'),
  $taskService.runHighScoringTweetsTask('stoolpresidente'),
  // // $taskService.runHighScoringTweetsTask('BillSimmons'),
  // // $taskService.runHighScoringTweetsTask('ColinCowherd'),
  // // $taskService.runAllTweetsTask('GregABedard'),
  // // $taskService.runAllTweetsTask('Keefe21'),
  // // $taskService.runAllTweetsTask('adamjones985'),
  // // $taskService.runAllTweetsTask('BenVolin'),
  // $taskService.runHighScoringTweetsTask('ClayTravis'),
  $taskService.runHighScoringTweetsTask('pgammo', 'high'),
  // $taskService.runHighScoringTweetsTask('jaysonst'),
  // // $taskService.runHighScoringTweetsTask('RubinReport'),
  // // $taskService.runHighScoringTweetsTask('balajis'),
  // // $taskService.runHighScoringTweetsTask('marcushjohnson'),
  $taskService.runHighScoringTweetsTask('robinhanson', 'high'),
  $taskService.runHighScoringTweetsTask('tylercowen', 'high'),
  // // $taskService.runHighScoringTweetsTask('Ahmadinejad1956'),
  // $taskService.runHighScoringTweetsTask('JBurtonXP'),
  // $taskService.runHighScoringTweetsTask('ericgarland'),
  // // $taskService.runHighScoringTweetsTask('JackPosobiec'),
  // // $taskService.runHighScoringTweetsTask('charliekirk11'),
  // // $taskService.runHighScoringTweetsTask('scrowder'),
  // // $taskService.runHighScoringTweetsTask('RealCandaceO'),
  // // $taskService.runHighScoringTweetsTask('ScottPresler'),
  // // $taskService.runHighScoringTweetsTask('SageRosenfels18'),
  $taskService.runHighScoringTweetsTask('jonfavs', 'low'),
  $taskService.runHighScoringTweetsTask('jonlovett', 'low'),
  $taskService.runHighScoringTweetsTask('danpfeiffer', 'low'),
  $taskService.runHighScoringTweetsTask('TVietor08', 'low'),
  // // $taskService.runHighScoringTweetsTask('brhodes'),
  // // $taskService.runHighScoringTweetsTask('CalebJHull'),
  // // $taskService.runHighScoringTweetsTask('wilw'), // deactivated
  // $taskService.runHighScoringTweetsTask('matthewjdowd'),
  $taskService.runHighScoringTweetsTask('JRubinBlogger', 'low'),
  $taskService.runHighScoringTweetsTask('MaxBoot', 'low'),
  $taskService.runHighScoringTweetsTask('HeerJeet', 'low'),
  // // $taskService.runHighScoringTweetsTask('gillibrandny'),
  // $taskService.runHighScoringTweetsTask('benjaminwittes'),
  // $taskService.runHighScoringTweetsTask('chrislhayes'),
  // // $taskService.runHighScoringTweetsTask('AdamBaldwin'),
  // // $taskService.runHighScoringTweetsTask('Yascha_Mounk'),
  // // $taskService.runHighScoringTweetsTask('kanyewest'), // deactivated
  // // $taskService.runHighScoringTweetsTask('BillKristol'),
  // $taskService.runHighScoringTweetsTask('IngrahamAngle'),
  // // $taskService.runBestTweetsTask(),
    ]);*/

  } catch (e) {

    await $slackService.crashReport(e.stack);
    throw(e);

  }

}

module.exports = inject(app);
