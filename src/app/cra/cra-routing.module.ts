import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CraComponent } from './cra.component';
import {Test2Component} from "./test2/test2.component";
import {AuthGuard} from "../auth.guard";



const routes: Routes = [
  {
    path:'',/*canActivate:[AuthGuard],*/
    children: [
      {
        path: 'create-activity',
        component: CraComponent
      } ,
      {
        path: 'test2',
        component: Test2Component
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CraRoutingModule { }
