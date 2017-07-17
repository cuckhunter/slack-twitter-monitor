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
        [30 * 1000, 120 * 60 * 1000, 30 * 1000] :
        [10 * 1000, 60 * 1000, 30 * 1000];

    await Promise.all([
      $taskService.runAllTweetsTask('realDonaldTrump', allTweetsInterval),
      $taskService.runAllTweetsTask('3xchair', allTweetsInterval),
      $taskService.runAllTweetsTask('JoelEmbiid', allTweetsInterval),
      $taskService.runHighScoringTweetsTask('mattyglesias', highScoringTweetsInterval),
      $taskService.runHighScoringTweetsTask('jbouie', highScoringTweetsInterval),
      $taskService.runHighScoringTweetsTask('davidfrum', highScoringTweetsInterval),
      $taskService.runHighScoringTweetsTask('paulkrugman', highScoringTweetsInterval),
      $taskService.runHighScoringTweetsTask('mtracey', highScoringTweetsInterval),
      $taskService.runHighScoringTweetsTask('ColinCowherd', highScoringTweetsInterval),
      $taskService.runHighScoringTweetsTask('ChelseaClinton', highScoringTweetsInterval),
      $taskService.runHighScoringTweetsTask('RealSkipBayless', highScoringTweetsInterval),
      $taskService.runHighScoringTweetsTask('Cernovich', highScoringTweetsInterval),
      $taskService.runHighScoringTweetsTask('AnnCoulter', highScoringTweetsInterval),
      $taskService.runHighScoringTweetsTask('benshapiro', highScoringTweetsInterval),
      $taskService.runHighScoringTweetsTask('ScottAdamsSays', highScoringTweetsInterval),
      $taskService.runHighScoringTweetsTask('mitchellvii', highScoringTweetsInterval),
      $taskService.runHighScoringTweetsTask('seanhannity', highScoringTweetsInterval),
      $taskService.runHighScoringTweetsTask('JulianAssange', highScoringTweetsInterval),
      $taskService.runHighScoringTweetsTask('RealAlexJones', highScoringTweetsInterval),
      $taskService.runHighScoringTweetsTask('PrisonPlanet', highScoringTweetsInterval),
      $taskService.runHighScoringTweetsTask('JamesOKeefeIII', highScoringTweetsInterval),
      $taskService.runHighScoringTweetsTask('piersmorgan', highScoringTweetsInterval),
      $taskService.runHighScoringTweetsTask('CHSommers', highScoringTweetsInterval),
      $taskService.runHighScoringTweetsTask('SheriffClarke', highScoringTweetsInterval),
      $taskService.runHighScoringTweetsTask('chuckwoolery', highScoringTweetsInterval),
      $taskService.runHighScoringTweetsTask('RealJamesWoods', highScoringTweetsInterval),
      $taskService.runHighScoringTweetsTask('johndurant', highScoringTweetsInterval),
      // $taskService.runAllTweetsTask('mlombardiNFL', allTweetsInterval),
      // $taskService.runAllTweetsTask('GregABedard', allTweetsInterval),
      // $taskService.runAllTweetsTask('Keefe21', allTweetsInterval),
      // $taskService.runAllTweetsTask('adamjones985', allTweetsInterval),
      // $taskService.runAllTweetsTask('BenVolin', allTweetsInterval),
      // $taskService.runBestTweetsTask('Phi_Delta_Alpha', bestTweetsInterval),
    ]);

  } catch (e) {

    await $slackService.crashReport(e);
    throw(e);

  }

}

module.exports = inject(app);
