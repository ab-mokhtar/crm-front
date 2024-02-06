import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import Peer from 'peerjs';
import PerfectScrollbar from 'perfect-scrollbar';
import { Subscription } from 'rxjs';
import { CallDialog } from 'src/app/shared/components/CallDialog/calldialog.component';
import { Chat3Component } from 'src/app/components/apps/chat/chat3/chat3.component';
import { CallService } from 'src/app/components/apps/chat/services/call-service';
import { WebSocketService } from 'src/app/components/apps/chat/services/web-socket-service.service';

@Component({
  selector: 'app-connectedusers',
  templateUrl: './connectedUsers.component.html',
  styleUrls: ['./connectedUsers.component.scss']
})
export class ConnectedUsers implements OnInit {
  message: string = '';
  chatMessages: any[] = [];
  discussions:any[]=[];
  user!: any;
  destination='admin@example.com';
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
  openDiscussions: { destination: string, chatMessages: any[] }[] = [];
  ngAfterViewInit(){
    
    const scroll1 = document.querySelector('#ChatList1');
    const scroll2 = document.querySelector('#ChatBody');

     this.ps = new PerfectScrollbar(scroll1);
     this.ps1 = new PerfectScrollbar(scroll2);

  }
  private scrollToBottom(): void {
    setTimeout(() => {
      this.ps1.update()
      var container = document.getElementById("ChatBody");
  //scroll down
    container.scrollTo(0, this.ps1.contentHeight);
    }, 1)
   
  }
 
  constructor(private webSocketService: WebSocketService,private dialog: MatDialog,private dialog2: MatDialog,private eventService: CallService,private toastr: ToastrService) {
     this.peer=new Peer();
     this.lunchEventSubscription = this.eventService.lunchEvent.subscribe(() => {
      this.endCallIstriggered = true;      
      this.endCall()
      
    });
  }

  ngOnInit(): void {
    this.loadUser();

    // Subscribe to incoming messages
    this.webSocketService.stompClient.connect({}, (frame: any) => {
       this.subscribeToConnectedUsers();
      //this.subscribeToUserMessages();

      this.webSocketService.getConnectedUsers(this.user.companyName)

    });
     this.eventService.getData().subscribe((index) => {
      console.log("fermeture de disc ", index);
      
this.openDiscussions=this.openDiscussions.filter((tab, tabIndex) => {
  // Replace the condition below with your specific filtering logic
  return tabIndex != index;
});     // Faites quelque chose avec les données reçues du composant enfant
    });
    this.webSocketService.getDisc(this.user.username).subscribe((res)=>{
      
this.discussions=res


  })
  
this.setupPeer();

  }

  loadUser() {
    let userString = localStorage.getItem('user2');
    if (userString !== null) {
      this.user = JSON.parse(userString);
    }
  }
  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    // Perform cleanup tasks here
    this.webSocketService.disconnect({id:this.user.id,companyName:this.user.companyName});
  }
  subscribeToConnectedUsers() {
    this.webSocketService.stompClient.subscribe('/topic/connected/'+this.user.companyName, (message: any) => {
      if (message.body) {
        this.users = JSON.parse(message.body);
      }
    });
  }

  subscribeToUserMessages() {
    this.webSocketService.stompClient.subscribe('/topic/' + this.user.username, (message: any) => {
      if (message.body) {
        message=JSON.parse(message.body)
        this.discussions = this.discussions.filter(x => 
          !(x.source === message.source && x.destination === message.destination) &&
          !(x.source === message.destination && x.destination === message.source)
        );        this.discussions.unshift(message)
        this.chatMessages.push(message);
        this.ps1.update()
        this.scrollToBottom()
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
      this.webSocketService.sendMessage({ message: this.message, source: this.user.username, destination: this.destination });

      // Clear the input field
      this.message = '';
    }
  }
  chargeDisc(msg:any){
    
  
    if(msg.source === undefined){
      this.destination=msg;

    }
    else{
  if(this.checkSender(msg.source)){
    this.destination=msg.destination;

  }else{
    this.destination=msg.source;

  }}
    this.webSocketService.getMessages(this.user.username,this.destination).subscribe((res)=>{
      
    this.chatMessages=res  
  this.scrollToBottom()
  this.destination=this.users.filter(x=>x.username===this.destination)[0]
  const existingDiscussion = this.openDiscussions.find(d => d.destination === this.destination);
if(this.openDiscussions.length>3){
  this.openDiscussions.shift()
}
  if (!existingDiscussion) {
    // Add the discussion to the array
    this.openDiscussions.push({ destination:this.destination, chatMessages:this.chatMessages });
  }
  })



  }
 startCall(){
var peer= this.users.filter(x=>x.username === this.destination)[0].peerId


  
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
  this.peer.on('close', () => {
    this.endCall();
  });
    
}

private handleIncomingCall(call: any): void {
  let caller=this.users.filter(x=>x.peerId===call.peer)[0]
this.openCallDialog("test")
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
    }});
    // this.streamLocalVideo(this.lazyStream);
    // this.streamRemoteVideo(remoteStream);
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
    }});
    // this.streamLocalVideo(this.lazyStream);
    // this.streamRemoteVideo(remoteStream);
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
  const dialogRef = this.dialog2.open(CallDialog, {
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
