import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';

import { LoaderComponent } from './components/loader/loader.component';
import { TapToTopComponent } from './components/tap-to-top/tap-to-top.component';
import { ContentComponent } from './components/layouts/content/content.component';
import { ContentStyleComponent } from './components/layouts/content-style/content-style.component';
import { FullContentComponent } from './components/layouts/full-content/full-content.component';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';

import { NgxEchartsModule } from 'ngx-echarts';
import { ConnectedUsers } from './components/connectedUsers/connectedUsers.component';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { CallDialog } from './components/CallDialog/calldialog.component';
import { Popup } from './components/popup/popup.component';


@NgModule({
  declarations: [
    SidebarComponent,
    FooterComponent,
    HeaderComponent,
    LoaderComponent,
    TapToTopComponent,
    ContentComponent,
    ContentStyleComponent,
    FullContentComponent,
  ConnectedUsers,
  CallDialog,
  Popup],
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    NgxEchartsModule,
    FormsModule,
    MatDialogModule, 
  ],
  providers: [],
  exports: [
    LoaderComponent,
    TapToTopComponent,
    ContentComponent,
    ContentStyleComponent,
    FullContentComponent,
  ],
})
export class SharedModule { }
