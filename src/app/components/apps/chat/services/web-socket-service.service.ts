import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { log } from 'console';
import { Observable } from 'rxjs';
declare var SockJS:any;
declare var Stomp:any;


@Injectable({
  providedIn: 'root'
})
export class WebSocketService {


    app_url ='http://localhost:9097/socket'

  constructor(private http:HttpClient) {
    this.initializeWebSocketConnection();
  }
    stompClient:any;
  public msg:any=[];
   initializeWebSocketConnection() {
    console.log(this.app_url);
    const ws = new SockJS(this.app_url);
    this.stompClient = Stomp.over(ws);
    const that = this;
    this.stompClient.connect({}, (frame: any) => {
      console.log("connecté socket");
      
    });

    // tslint:disable-next-line:only-arrow-functions
  
  }
  public getStompClient() {
    return this.stompClient;
  }
  sendTopic(message:any) {
    this.stompClient.send("/app/sendPeerId", {}, JSON.stringify(message));
    
  }
  sendMessage(message:any) {
    this.stompClient.send("/app/sendMessage", {}, JSON.stringify(message));
    
  }
  disconnect(user:any) {
    
    this.stompClient.send("/app/leave", {}, user);
    if (this.stompClient) {
        this.stompClient.disconnect();
    }
}
getConnectedUsers(company:string){
  this.http.get("http://localhost:9097/Connected/"+company).subscribe();
}
getDisc(user:string):Observable<any>{
  return this.http.post("http://localhost:9097/messages/getDisc", user);
}
getMessages(user: string, destination: string): Observable<any> {
  return this.http.post("http://localhost:9097/messages/getmessages", {"source": user, "destination": destination});
}

logout(user: string) {
  console.log(user  );
  
}
}
