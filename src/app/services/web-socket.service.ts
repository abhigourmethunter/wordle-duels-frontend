import { Injectable, signal } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { retryWhen, tap, catchError, delay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket!: WebSocketSubject<any>;
  private _messages = signal<any[]>([]);
  public messages = this._messages;

  constructor() {
    const token = localStorage.getItem('authToken') || '';
    this.socket = webSocket(environment.apiUrl + `/myHandler?token=${token}`);
  }

  public sendMessage(message: any): void {
    if (this.socket) {
      this.socket.next(message);
    }
  }

  getMessages(): Observable<any> {
    return this.socket.asObservable();
  }

  public close(): void {
    if (this.socket) {
      this.socket.complete();
    }
  }
}