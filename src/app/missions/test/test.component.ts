import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MustMatch } from 'src/app/shared/validations/passwordValidator';
import { NgWizardConfig, NgWizardService, StepChangedArgs, StepValidationArgs, STEP_STATE, THEME } from 'ng-wizard';
import { of } from 'rxjs';
import { MissionControllerService } from 'src/app/mission/services';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent  {
////////////////////fake data :
  missions: any;
  inactiveDays: any;
  fakeMissions = [
    {
      idUser: 3,
      isForMe: true,
      name: "Mission Factice 1"
    },
    {
      idUser: 4,
      isForMe: true,
      name: "Mission Factice 2"
    }
  ];

   fakeInactiveDays = [
    {
      id: 1,
      name: "Jour férié factice"
    },
    {
      id: 2,
      name: "Maladie factice"
    },
    {
      id: 3,
      name: "Congés factices"
    }
  ];

  ngOnInit() {
    this.listMissionforMe();
    this.listinactifdays();
  }
// Pour listMissionforMe

  listMissionforMe() {
    this.missions = this.fakeMissions; // Utilisez les données factices
  }

// Pour listinactifdays
  listinactifdays() {
    this.inactiveDays = this.fakeInactiveDays; // Utilisez les données factices
  }

}
