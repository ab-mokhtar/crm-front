import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Error400Component } from './error400/error400.component';
import { Error401Component } from './error401/error401.component';
import { Error403Component } from './error403/error403.component';
import { Error404Component } from './error404/error404.component';
import { Error500Component } from './error500/error500.component';
import { Error503Component } from './error503/error503.component';

const routes: Routes = [
  {
    path: '',
    children: [
      
      { path: 'Error-400', component: Error400Component },
      { path: 'Error-401', component: Error401Component },
      { path: 'Error-403', component: Error403Component },
      { path: 'Error-404', component: Error404Component },
      { path: 'Error-500', component: Error500Component },
      { path: 'Error-503', component: Error503Component }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ErrorRoutingModule { }