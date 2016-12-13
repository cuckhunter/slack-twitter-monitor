'use strict';

const inject = require('./lib/inject');

async function main() {

  inject.ready();
  
  await inject(async function([$env, $logger, $server, $taskService]) {
    
    const HOSTNAME = $env.HOSTNAME;
    const PORT = $env.PORT || 80;
    $logger.error('$env:', $env);
    $server.listen(PORT, () => {
      $logger.info(`Server running at http://${HOSTNAME}:${PORT}/`);
    });

    const [i, j] = ($env.MODE == 'prod') ?
      [30 * 1000, 120 * 60 * 1000] :
      [10 * 1000, 60 * 1000];

    await Promise.all([
      $taskService.runAllTweetsTask('realDonaldTrump', i),
      $taskService.runBestTweetsTask('Phi_Delta_Alpha', j)
    ]);

  })();

}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
