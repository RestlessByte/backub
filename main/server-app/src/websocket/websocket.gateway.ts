import { Injectable, OnModuleInit } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';
import { DecryptedKeys } from '@decrypted/client';
import { serverDecryptedDataFromClient, serverEncryptedDataFromClient } from '@crypto/server';

const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);

@WebSocketGateway({
  path: '/ws',
  transports: ['websocket'],
  secure: true
})
@Injectable()
export class WebsocketGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  private handlers = new Map<string, (data: any) => Promise<any>>();

  async onModuleInit() {
    await this.loadRouteHandlers();
    console.log(`🛡️ [WSS] Gateway initialized with ${this.handlers.size} handlers`);
  }

  private async loadRouteHandlers() {
    const loadHandlers = async (dir: string) => {
      const files = await readdir(dir);

      for (const file of files) {
        const filePath = path.join(dir, file);
        const fileStat = await stat(filePath);

        if (fileStat.isDirectory()) {
          await loadHandlers(filePath);
        } else if (file.endsWith('.js') || file.endsWith('.ts')) {
          const routeName = path.basename(file, path.extname(file));

          try {
            const handlerModule = await import(filePath);
            const handler = handlerModule.default;

            if (typeof handler === 'function') {
              this.handlers.set(routeName, handler);
              console.log(`✅ [WSS] Handler loaded: ${routeName}`);
            } else {
              console.warn(`⚠️ [WSS] No default export in ${file}`);
            }
          } catch (e) {
            console.error(`❌ [WSS] Error loading ${file}:`, e);
          }
        }
      }
    };

    try {
      const routesPath = path.join(__dirname, '..', 'routes');
      await loadHandlers(routesPath);
    } catch (error) {
      console.error('🔥 [WSS] Failed to load routes:', error);
    }
  }

  handleConnection(client: WebSocket) {
    client.send(JSON.stringify({
      status: 'connected',
      message: 'WebSocket connection established',
      timestamp: new Date().toISOString()
    }));
  }

  @SubscribeMessage('message')
  async handleMessage(client: WebSocket, payload: any) {
    let rawPayload: string;
    let requestId: string;
    let endpoint: string;

    try {
      rawPayload = Buffer.isBuffer(payload)
        ? payload.toString('utf8')
        : typeof payload === 'string' ? payload : JSON.stringify(payload);

      const parsed = JSON.parse(rawPayload);
      endpoint = parsed.endpoint;
      requestId = parsed.requestId;

      if (!endpoint || !requestId) {
        throw new Error('INVALID_REQUEST_FORMAT');
      }

      const handler = this.handlers.get(endpoint);
      if (!handler) {
        throw new Error('ENDPOINT_NOT_FOUND');
      }

      // Дешифровка данных
      let handlerData = parsed.data;
      if (handlerData && typeof handlerData === 'string') {
        handlerData = await serverDecryptedDataFromClient(handlerData, DecryptedKeys);
      }

      // Обработка запроса
      const result = await handler(handlerData || {});

      // Шифровка ответа
      let responseData = result;
      if (result && typeof result === 'object' && result.data) {
        responseData = {
          ...result,
          data: await serverEncryptedDataFromClient(result.data, DecryptedKeys)
        };
      }

      // Отправка ответа
      client.send(JSON.stringify({
        requestId,
        status: 'success',
        ...responseData,
        timestamp: new Date().toISOString()
      }));

    } catch (error) {
      console.error(`⚠️ [WSS] ${endpoint} error:`, error.message);
      client.send(JSON.stringify({
        requestId,
        status: 'error',
        error: error.code || error.message,
        timestamp: new Date().toISOString()
      }));
    }
  }
}