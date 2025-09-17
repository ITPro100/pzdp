/**
 * PM2 Ecosystem Configuration
 * Конфігурація для керування процесами Node.js сервера
 */

module.exports = {
  apps: [{
    // Основний сервер
    name: 'pz-dp-ua-server',
    script: 'server.js',
    instances: 'max', // Використовувати всі доступні CPU
    exec_mode: 'cluster',
    
    // Автоматичний перезапуск
    autorestart: true,
    watch: false, // В продакшні відключити
    max_memory_restart: '1G',
    
    // Змінні оточення
    env: {
      NODE_ENV: 'development',
      PORT: 3000,
      TELEGRAM_BOT_TOKEN: 'YOUR_BOT_TOKEN',
      TELEGRAM_CHAT_ID: 'YOUR_CHAT_ID'
    },
    
    // Продакшн налаштування
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
      TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
      TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID
    },
    
    // Логування
    log_file: 'logs/combined.log',
    out_file: 'logs/out.log',
    error_file: 'logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Обмеження ресурсів
    max_restarts: 10,
    min_uptime: '10s',
    restart_delay: 4000,
    
    // Моніторинг
    monitoring: false, // Встановити в true для keymetrics.io
    
    // Додаткові опції
    merge_logs: true,
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000
  }],
  
  deploy: {
    // Конфігурація для деплою на production сервер
    production: {
      user: 'ubuntu',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'git@github.com:your-org/pz.dp.ua.git',
      path: '/var/www/pz.dp.ua',
      
      // Pre-deploy команди
      'pre-deploy-local': '',
      
      // Post-receive команди на сервері
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      
      // Pre-setup команди
      'pre-setup': '',
      
      // Post-setup команди
      'post-setup': 'npm install'
    },
    
    // Staging сервер
    staging: {
      user: 'ubuntu',
      host: 'staging.pz.dp.ua',
      ref: 'origin/develop',
      repo: 'git@github.com:your-org/pz.dp.ua.git',
      path: '/var/www/staging',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env staging'
    }
  }
};