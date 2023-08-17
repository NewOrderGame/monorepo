// eslint-disable-next-line @typescript-eslint/no-var-requires
const { exec } = require('child_process');

// This script will only consider the first argument as the tsc command and ignore the others
// This is because lint-staged will automatically append the paths of the staged files.
const command = process.argv[2];

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    process.exit(1);
  }
  console.log(stdout);
  console.error(stderr);
});
