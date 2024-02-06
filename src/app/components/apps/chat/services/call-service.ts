import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { log } from 'console';
import Peer from 'peerjs';
import { Observable, Subject } from 'rxjs';
declare var SockJS:any;
declare var Stomp:any;


@Injectable({
  providedIn: 'root'
})
export class CallService {
  public lunchEvent: EventEmitter<void> = new EventEmitter<void>();
  peer: any;
  private dataSubject = new Subject<any>();

  sendData(data: any) {
    this.dataSubject.next(data);
  }

  getData() {
    return this.dataSubject.asObservable();
  }
  triggerLunchEvent() {
    this.lunchEvent.emit();
  }
  constructor(){
    this.peer=new Peer();
  }
  getPeer(){
    return this.peer;
  }
}
