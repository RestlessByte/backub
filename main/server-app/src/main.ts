// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import * as fs from 'fs';
import { networkInterfaces } from 'os';

async function bootstrap() {
  const port = 5050; // Изменяем порт на 5051
  const httpsOptions = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
  };

  // Создаем приложение
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    },
    httpsOptions,
    logger: ['error', 'warn', 'log', 'debug']
  });

  // Настройка WebSocket
  app.useWebSocketAdapter(new WsAdapter(app));

  // Слушаем на всех интерфейсах (IPv4 и IPv6)
  await app.listen(port, '::');

  // Получаем IP-адреса
  const ipv4 = getIpAddress('IPv4');
  const ipv6 = getIpAddress('IPv6');

  console.log(`
  🚀 Server launched at:
  - HTTPS: https://localhost:${port}
  - HTTPS (IPv4): https://${ipv4}:${port}
  - HTTPS (IPv6): https://${ipv6}:${port}
  - WSS:   wss://localhost:${port}/ws
  - WSS (IPv4): wss://${ipv4}:${port}/ws
  - WSS (IPv6): wss://${ipv6}:${port}/ws
  `);
}

// Функция для получения IP-адреса
function getIpAddress(family: 'IPv4' | 'IPv6'): string {
  const interfaces = networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] as any) {
      // Пропускаем внутренние и неверные адреса
      if (iface.internal || iface.family !== family) continue;

      // Для IPv6 проверяем формат
      if (family === 'IPv6' && iface.address.startsWith('fe80::')) continue;

      return iface.address;
    }
  }

  return family === 'IPv4' ? '127.0.0.1' : '::1';
}

bootstrap();