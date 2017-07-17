'use strict';

async function main() {

  try {

    const inject = require('./lib/inject');
    const app = require('./lib/app');
    inject.ready();
    await app();

  } catch (e) {
    
    console.error('Process crashed', e);
    process.exit(1);

  }

}

main();
