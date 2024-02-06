import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Chat3Data } from 'src/app/shared/data/chat/chat3';
import { CallService } from '../services/call-service';

@Component({
  selector: 'app-chat3',
  templateUrl: './chat3.component.html',
  styleUrls: ['./chat3.component.scss']
})
export class Chat3Component implements OnInit {

  public chatData = Chat3Data;
  remoteStream:any;
  lazyStream:any;
  incomingCallNotification: boolean = false;

  constructor( @Inject(MAT_DIALOG_DATA)  public data:any,private ref: MatDialogRef<Chat3Component>, private modalService: NgbModal,private eventService: CallService) 
  {
    this.remoteStream=data.remoteStream,
       this.lazyStream=data.lazyStream,
       this.incomingCallNotification=data.incoming

  }
  
  ngOnInit(): void {
    this.streamLocalVideo(this.lazyStream)
    this.streamRemoteVideo(this.remoteStream)
  }
  ChatOpen(messagemodal){
    this.modalService.open(messagemodal);
  }
  private streamLocalVideo(stream: any): void {
    const video = this.createVideoElement(stream);
    this.appendVideoElement(video, 'emitter-video');
  }

  private streamRemoteVideo(stream: any): void {
    const video = this.createVideoElement(stream);
    this.appendVideoElement(video, 'remote-video');
  }
  private createVideoElement(stream: any): HTMLVideoElement {
    const video = document.createElement('video');
    video.classList.add('video');
    video.srcObject = stream;
    video.play();
    return video;
  }

  private appendVideoElement(video: HTMLVideoElement, containerId: string): void {
    const videoContainer = document.getElementById(containerId);
    if (videoContainer !== null) {
      videoContainer.append(video);
    } else {
      console.error(`Video container '${containerId}' not found.`);
    }
  }
  endCall():void{
    this.eventService.triggerLunchEvent();
  this.ref.close()
  }
}
