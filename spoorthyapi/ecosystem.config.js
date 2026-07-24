module.exports = {
  apps: [{
    name: 'spoorthyapi',
    script: 'index.js',
    cwd: '/root/HRMS/spoorthyapi',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '300M',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
