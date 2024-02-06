import { AfterViewInit, Component, HostListener, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Chat3Data } from 'src/app/shared/data/chat/chat3';
import { CallService } from '../../../components/apps/chat/services/call-service';
import { ToastrService } from 'ngx-toastr';
import Peer from 'peerjs';
import PerfectScrollbar from 'perfect-scrollbar';
import { Subscription } from 'rxjs';
import { CallDialog } from '../CallDialog/calldialog.component';
import { Chat3Component } from '../../../components/apps/chat/chat3/chat3.component';
import { WebSocketService } from '../../../components/apps/chat/services/web-socket-service.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class Popup  implements OnInit , AfterViewInit{

 

  @Input() chatMessages: any[];
  @Input() destination: any;
  @Input() index: number;

  message: string = '';
  discussions:any[]=[];
  user!: any;
  users: any[]=[];
  private peer: Peer;
  peerIdShare!: string;
  peerId!: string;
  private lazyStream: any;
  currentPeer: any;
  private peerList: Array<any> = [];
  private currentCall:any
  receivingCall: boolean = false;
  callingPeerId: string = '';
  answerOffer: boolean = false;
  incomingCallNotification: boolean = false;
  incomingCall: any;
  endCallIstriggered = false;
  private lunchEventSubscription: Subscription;
  ps:PerfectScrollbar
  ps1:PerfectScrollbar

  ngAfterViewInit(){
    
    const scroll2 = document.querySelector('#ChatBodyOfContainer');

     this.ps1 = new PerfectScrollbar(scroll2);
     this.scrollToBottom();
  }
  private scrollToBottom(): void {
    setTimeout(() => {
      this.ps1.update();
  
      // Get all elements with the class "ChatBodyOfContainer"
      const containers = document.querySelectorAll("#ChatBodyOfContainer");
  
      // Loop through each container element
      containers.forEach(container => {
        // Scroll down each container
        container.scrollTo(0, container.scrollHeight);
      });
    }, 15);
  }
  

 
  constructor(private webSocketService: WebSocketService,private dialog: MatDialog,private callService: CallService,private toastr: ToastrService) {
     
     this.peer=callService.getPeer();
     this.lunchEventSubscription = this.callService.lunchEvent.subscribe(() => {
      this.endCall();
    });
     
  }

  ngOnInit(): void {
    this.loadUser();
    this.subscribeToUserMessages()
    
  
this.setupPeer();
this.scrollToBottom()
  }

  loadUser() {
    let userString = localStorage.getItem('user2');
    if (userString !== null) {
      this.user = JSON.parse(userString);
    }
  }
 


  subscribeToUserMessages() {
    this.webSocketService.stompClient.subscribe('/topic/' + this.user.username, (message: any) => {
      if (message.body) {
        message=JSON.parse(message.body)
       if ((message.source===this.user.username && message.destination===this.destination.username)||(message.destination===this.user.username &&message.source===this.destination.username))
       
       this.chatMessages.push(message);
        this.scrollToBottom()
        //console.log("Message Received from Server :: ", this.chatMessages);
      }
      
    });
  }

 

  checkSender(user: any): boolean {
    let userString = localStorage.getItem('user2');
    let username;

    if (userString !== null) {
      let user = JSON.parse(userString);
      username = user.username;
    }

    return user === username;
  }

  sendMessage() {
    if (this.message.trim() !== '') {
      this.loadUser();

      // Send the message to the WebSocket server
      this.webSocketService.sendMessage({ message: this.message, source: this.user.username, destination: this.destination.username });

      // Clear the input field
      this.message = '';
    }
  }
  closePopup(){

    this.callService.sendData(this.index);
  }

 startCall(){
var peer= this.destination.peerId
console.log(peer);


  
this.callPeer(peer)
 }
 




public setupPeer(): void {
  this.peer.on('open', (id) => {
    this.peerId = id;
    this.user.peerId=id
    this.webSocketService.sendTopic(this.user);
  });

  this.peer.on('call', (call) => {
    this.handleIncomingCall(call);
  });
  this.peer.on("close", () => {
    this.endCall();
  });
    
}

private handleIncomingCall(call: any): void {
  let caller=this.users.filter(x=>x.peerId===call.peer)[0].username
this.openCallDialog(caller)
  if (!this.receivingCall) {
    this.incomingCall = call;
    this.incomingCallNotification = true;
  } else {
    console.log("Incoming call from: ", call.peer);
  }
}

answerCall(): void {
  this.answerOffer = true;
  this.incomingCallNotification = false;

  // Check if there is an incoming call
  if (this.incomingCall) {
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    }).then((stream) => {
      this.lazyStream = stream;

      // Answer the incoming call and handle the stream
      this.incomingCall.answer(stream);
      
      // Setup listeners for the incoming call
      this.incomingCall.on('stream', (remoteStream: any) => {
        this.setupCallListeners(remoteStream);
        this.currentCall = this.incomingCall;
      });
    }).catch(err => {
      console.log(err + 'Unable to get media');
    });
  }
}
private setuocall(remoteStream: any): void {

    console.log("remote stream : ", remoteStream.id);
    console.log("local stream : ", this.lazyStream.id);
    var _popup = this.dialog.open(Chat3Component,{data:{
      remoteStream:remoteStream,
      lazyStream:this.lazyStream
    },
  
   });
   
    this.currentPeer = this.incomingCall.peerConnection;
    this.peerList.push(this.incomingCall.peer);
  
}

private setupCallListeners(remoteStream: any): void {
  if (!this.peerList.includes(this.incomingCall.peer)) {
    console.log("remote stream : ", remoteStream.id);
    console.log("local stream : ", this.lazyStream.id);
    var _popup = this.dialog.open(Chat3Component,{data:{
      remoteStream:remoteStream,
      lazyStream:this.lazyStream
    },
  

    });
    
    this.currentPeer = this.incomingCall.peerConnection;
    this.peerList.push(this.incomingCall.peer);
  }
}

refuseCall(): void {
  if (this.incomingCall) {
    this.incomingCall.close();
    this.receivingCall = false;
    this.incomingCallNotification = false;
    // You may want to notify the caller that the call has been refused
  }
}

endCall(): void {
  if (this.currentCall) {
    // Close the media streams
    if (this.lazyStream) {
      this.lazyStream.getTracks().forEach(track => track.stop());
      navigator.mediaDevices.getUserMedia().then((stream)=>{stream.getTracks().forEach(track => track.stop())});
    }

    // Close the call
    this.currentCall.close();

    // Reset call-related variables
    this.currentCall = null;
    this.lazyStream = null;
    this.answerOffer = false;
    this.incomingCallNotification = false;
    this.receivingCall = false;

    // Notify the other peer that the call has ended (optional)
    // You may want to implement a signaling mechanism to inform the other peer

    console.log('Call ended successfully');
  } else {
    console.log('No ongoing call to end');
  }

  // You may want to notify the caller that the call has been refused
}






connectWithPeer(): void {

  this.callPeer(this.peerIdShare);
}

// Initiate a call to the specified peer
callPeer(peerId: string): void {
  console.log(peerId);
  
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
  }).then((stream) => {
    this.lazyStream=stream
    // Answer the call and handle the stream
    const call = this.peer.call(peerId, stream);
    this.currentCall=call;
    call.on('stream', (remoteStream) => {
      // The call has been answered, setupCallListeners will execute
      this.setuocall(remoteStream);
    });
    call.on('close', () => {
      this.endCall();
    });
  }).catch(err => {
    console.log(err + 'Unable to connect');
  });
// ... (other methods)
}

openCallDialog(caller:any): void {
  const dialogRef = this.dialog.open(CallDialog, {
    data: {
      caller: caller,
      // You can add more data properties if needed
    }
  });

  // Subscribe to dialog close event
  dialogRef.afterClosed().subscribe((result: boolean | undefined) => {
    if (result === true) {
      // 'Answer' was clicked
      this.answerCall()      // Perform any actions you want when 'Answer' is clicked
    } else if (result === false) {
      this.refuseCall()
      // 'Refuse' was clicked
      // Perform any actions you want when 'Refuse' is clicked
    } else {
      // Dialog was closed without clicking either button
      console.log('Dialog closed without clicking Answer or Refuse');
    }
  });
}
pasteDate(date: any): string {
  let parsedDate = Date.parse(date);

  if (!isNaN(parsedDate)) {
    const currentDate = new Date(parsedDate);
    const now = new Date();

    // Check if the parsed date is today
    if (
      currentDate.getDate() === now.getDate() &&
      currentDate.getMonth() === now.getMonth() &&
      currentDate.getFullYear() === now.getFullYear()
    ) {
      // If it's today, return the time
      const hours = currentDate.getHours().toString().padStart(2, '0');
      const minutes = currentDate.getMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}`;
      return timeString;
    } else {
      // If it's not today, return the full date
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      const dateString = currentDate.toLocaleDateString(undefined, options);
      return dateString;
    }
  } else {
    return 'Invalid Date';
  }
}

}