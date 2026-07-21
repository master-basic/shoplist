const { spawn } = require('child_process');

// Kill any existing node processes on the relevant ports first
const kill = spawn('taskkill', ['/f', '/im', 'node.exe', '/fi', 'PID ne ' + process.pid], { stdio: 'ignore' });
setTimeout(() => {
  // Start server
  const server = spawn('node', ['index.js'], { cwd: 'C:/ailab/shoplist/server', stdio: 'pipe' });
  server.stdout.on('data', d => process.stdout.write('[server] ' + d));
  server.stderr.on('data', d => process.stderr.write('[server-err] ' + d));

  // Start client
  const client = spawn('npm', ['run', 'dev'], { cwd: 'C:/ailab/shoplist', stdio: 'pipe', shell: true });
  client.stdout.on('data', d => process.stdout.write('[client] ' + d));
  client.stderr.on('data', d => process.stderr.write('[client-err] ' + d));

  console.log('Starting GroceryMind...');
  console.log('  Server: http://localhost:3001');
  console.log('  Client: http://localhost:5173');
  console.log('Press Ctrl+C to stop both.');

  process.on('SIGINT', () => {
    server.kill();
    client.kill();
    process.exit();
  });
}, 1000);
