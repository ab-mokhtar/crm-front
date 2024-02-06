import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateMissionComponent } from './creation/create-mission.component';
import { MyMissionComponent } from './my-missions/my-mission.component';
import { TestComponent } from './test/test.component';
import {AuthGuard} from "../auth.guard";


const routes: Routes = [
  {
    path:'',  /*canActivate: [AuthGuard],*/
    children: [
      {
        path: 'create',
        component: CreateMissionComponent
      },
      {
        path: 'test',
        component: TestComponent
      },
      {
        path: 'mes-missions',
        component: MyMissionComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MissionRoutingModule { }
