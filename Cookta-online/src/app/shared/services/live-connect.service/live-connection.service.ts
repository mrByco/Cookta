import * as io from 'socket.io-client';
import {ServerService} from '../server.service';
import {ILiveConnectService} from './live-connect.service.interface';
import {Injectable} from '@angular/core';
import Socket = SocketIOClient.Socket;

@Injectable()
export class LiveConnectionService implements ILiveConnectService {
  private socket: Socket;

  constructor(serverService: ServerService) {
    //Disable sockets -> ssr cannot be loaded until sockets are active
    return;
    this.socket = io(serverService.GetBase());
    this.socket.on('connect', () => console.log('Socket connected'));
    this.socket.on('disconnect', () => console.log('Socket disconnected..'));
  }

}
