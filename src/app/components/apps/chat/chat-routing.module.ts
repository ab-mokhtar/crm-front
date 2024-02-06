import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { Chat1Component } from './chat1/chat1.component';
import { Chat2Component } from './chat2/chat2.component';
import { Chat3Component } from './chat3/chat3.component';
import { VideoCalltest } from "./videoCall/videocall.component";

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'chat-1',
                component: Chat1Component
            },
            {
                path: 'chat-2',
                component: Chat2Component
            },
            {
                path: 'chat-3',
                component: Chat3Component
            },
            {
                path: 'video',
                component: VideoCalltest
            },
        ],
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ChatRoutingModule { }