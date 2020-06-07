import * as io from 'socket.io-client';
import {ServerService} from '../server.service';
import Socket = SocketIOClient.Socket;
import {ILiveConnectService} from './live-connect.service.interface';
import {Injectable} from '@angular/core';

@Injectable()
export class LiveConnectionService implements ILiveConnectService {
  private socket: Socket;

  constructor(serverService: ServerService) {
    this.socket = io(serverService.GetBase());
    this.socket.on('connect', () => console.log('Socket connected'));
    this.socket.on('disconnect', () => console.log('Socket disconnected..'));
  }

}
