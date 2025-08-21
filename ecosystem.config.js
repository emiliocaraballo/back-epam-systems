module.exports = {
  apps: [
    {
      name: "book-reviews-api-dev",
      script: "src/server.js",
      instances: 1,
      autorestart: true,
      watch: true,
      ignore_watch: ["node_modules", "logs", "src/logs", "*.log"],
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
        PORT: 3111
      },
      error_file: "logs/pm2-error.log",
      out_file: "logs/pm2-out.log",
      log_file: "logs/pm2-combined.log",
      time: true
    },
    {
      name: "book-reviews-api-prod",
      script: "src/server.js",
      instances: "max", // Usar todos los cores disponibles
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3111
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3111
      },
      error_file: "logs/pm2-error.log",
      out_file: "logs/pm2-out.log",
      log_file: "logs/pm2-combined.log",
      time: true,
      log_date_format: "YYYY-MM-DD HH:mm Z"
    }
  ]
};
