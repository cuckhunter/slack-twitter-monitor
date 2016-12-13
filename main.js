'use strict';

const inject = require('./lib/inject');

async function main() {

  inject.ready();
  
  await inject(async function([$env, $logger, $server, $taskService]) {
    
    const PORT = $env.PORT || 80;
    $server.listen(PORT, () => {
      $logger.info(`Server running at http://localhost:${PORT}/`);
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
