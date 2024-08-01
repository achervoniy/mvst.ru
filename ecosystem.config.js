module.exports = {
  apps: [
    {
      max_memory_restart: '300M',
      name: 'must',
      script: 'node_modules/next/dist/bin/next',
      autorestart: true,
      max_restarts: 3,
      stop_exit_codes: [0],
      listen_timeout: 3000,
      kill_timeout: 5000,
      restart_delay: 1000,
      exec_mode: 'cluster',
      instances: 'max',
    },
  ],
};
