module.exports = {
  apps: [{
    name: 'spoorthy-api',
    script: './index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 8100
    },
    env_development: {
      NODE_ENV: 'development',
      PORT: 8100
    }
  }]
};