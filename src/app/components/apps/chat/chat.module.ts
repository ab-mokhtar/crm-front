import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chat1Component } from './chat1/chat1.component';
import { Chat2Component } from './chat2/chat2.component';
import { Chat3Component } from './chat3/chat3.component';
import { ChatRoutingModule } from './chat-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MatDialogModule } from '@angular/material/dialog';
import { CallDialog } from '../../../shared/components/CallDialog/calldialog.component';
import { Popup } from '../../../shared/components/popup/popup.component';
import { VideoCalltest } from './videoCall/videocall.component';



@NgModule({
  declarations: [Chat1Component, Chat2Component,VideoCalltest],
  imports: [
    CommonModule,
    ChatRoutingModule,
    NgbModule,
    FormsModule,
    ToastrModule.forRoot(),
    MatDialogModule, 
  ]
  ,providers : [
    ToastrService,

  ]
})
export class ChatModule { }
