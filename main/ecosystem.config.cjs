module.exports = {
  apps: [
    // Конфигурация первого приложения
    {
      name: "webdev", // Имя приложения
      script: "/home/localhost/main/web/main/run-dev.sh",
    },
    {
      name: "telegramai",
      script: "/home/localhost/main/telegram/hub/run.sh",
      cwd: "/home/localhost/main/telegram/hub" // Указываем рабочую директорию для корректного выполнения
    },
    {
      name: "telegramgame",
      script: "/home/localhost/main/telegram/game/run.sh",
      cwd: "/home/localhost/main/telegram/game" // Указываем рабочую директорию для корректного выполнения
    },
    {
      name: "websocket",
      script: "/home/localhost/main/server-app/run.sh",
      cwd: "/home/localhost/main/server-app" // Указываем рабочую директорию для корректного выполнения
    },
    {
      name: "telegramchannel",
      script: "/home/localhost/main/telegram/channel/run.sh",
      cwd: "/home/localhost/main/telegram/" // Указываем рабочую директорию для корректного выполнения

    },
    {
      name: 'telegrammysecurity',
      script: '/home/localhost/main/telegram/funnel/run.sh',
      cwd: '/home/localhost/main/telegram/funnel/'
    },
    // {
    //   name: 'minecraft',
    //   script: '/home/localhost/main/minecraft/run.sh',
    //   cwd: '/home/localhost/main/minecraft'
    // }, 
    {
      name: 'telegram-freelance',
      script: '/home/localhost/main/telegram/run.sh',
      cwd: '/home/localhost/main/telegram'
    },
  ]
}