import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MustMatch } from 'src/app/shared/validations/passwordValidator';
import { NgWizardConfig, NgWizardService, StepChangedArgs, StepValidationArgs, STEP_STATE, THEME } from 'ng-wizard';
import { of } from 'rxjs';
import { MissionControllerService } from 'src/app/mission/services';
import {error} from "pdf-lib";
import {Router} from "@angular/router";
@Component({
  selector: 'create-mission',
  templateUrl: './create-mission.component.html',
  styleUrls: ['./create-mission.component.scss']
})
export class CreateMissionComponent implements OnInit {

  active;
  //ng-wizard
  stepStates = {
    normal: STEP_STATE.normal,
    disabled: STEP_STATE.disabled,
    error: STEP_STATE.error,
    hidden: STEP_STATE.hidden
  };

  config1: NgWizardConfig = {
    selected: 0,
    theme: THEME.arrows,
    toolbarSettings: {
      toolbarExtraButtons: [
        { text: 'Done', class: 'btn btn-info', event: () => {
          this.toaster.success('Successfully Done');
         } }
      ],
    }
  };
  config2: NgWizardConfig = {
    selected: 0,
    theme: THEME.arrows,
    toolbarSettings: {
      toolbarExtraButtons: [
        { text: 'Finish', class: 'btn btn-info', event: () => { this.submit();  } }
      ],
    }
  };

  //Archwizard Content
  societeInformation: FormGroup;
  missionInformation: FormGroup;
  facturationInformation: FormGroup;
  fourthFormGroup: FormGroup;
  maxDate: Date;

  constructor(
    private _formBuilder: FormBuilder,
    private toaster: ToastrService,
    private ngWizardService: NgWizardService,
    private missionService: MissionControllerService,
    private router: Router
  ) {
    this.maxDate = new Date();
  }

  countries = [
    { id: 1, name: 'Brazil' },
    { id: 1, name: 'Czech Republic' },
    { id: 1, name: 'Germany' },
    { id: 1, name: 'Poland' },
  ];

  clientStates = [
    { id: 1, name: 'Prospect' },
    { id: 1, name: 'Client direct' },
    { id: 1, name: 'Client référencé' }
  ];

  secteurs = [
    { id: 1, name: 'Bancaire' },
    { id: 1, name: 'Telecom' },
    { id: 1, name: 'Publicité' },
    { id: 1, name: 'Média' },
  ];

  status = [
    { id: 1, name: 'SAS' },
    { id: 1, name: 'SASU' },
    { id: 1, name: 'Auto entrepreneur' }
  ];

  facturations = [
    { id: 1, name: '30 jours net' },
    { id: 2, name: '30 jours fin de mois' },
    { id: 3, name: 'Fin de mois + 40 jours' },
    { id: 4, name: '45 jours net' } ,
    { id: 5, name: '45 jours fin de mois'} ,
    { id: 6, name: '60 jours net' } ,
  ];
  ngOnInit(): void {
    this.testbil = this._formBuilder.group({
      name: ['', ''],
      startDate: ['',''],
      endDate: ['', ''],
      sellDays: ['',''],
      tjm: ['',''],
      freeDays: ['',''],
      isForMe: ['',''],
      shareMission: ['',''],
      email: ['',''],
      ville: ['',''],
      statut:  ['',''],
      tva:  ['',''],
      siret:  ['',''],
      rcs:  ['',''],
      companyName: ['',''],
    });
  }
  public finish() {
    console.log(this.societeInformation.value);
    console.log(this.missionInformation.value);
    console.log(this.facturationInformation.value);
    this.toaster.success('Successfully Registered');
    this.missionService.createMission({
      body:{
        company: this.societeInformation.value,
        facturation: this.facturationInformation.value,
        mission: this.missionInformation.value
      }
    }).subscribe(data => console.log(data));
  }

  //NG-WIZARD Content
  showPreviousStep(event?: Event) {
    this.ngWizardService.previous();
  }

  showNextStep(event?: Event) {
    this.ngWizardService.next();
  }

  resetWizard(event?: Event) {
    this.ngWizardService.reset();
  }

  setTheme(theme: THEME) {
    this.ngWizardService.theme(theme);
  }

  stepChanged(args: StepChangedArgs) {
    console.log(args.step);
  }

  isValidTypeBoolean: boolean = true;

  isValidFunctionReturnsBoolean(args: StepValidationArgs) {
    return true;
  }

  isValidFunctionReturnsObservable(args: StepValidationArgs) {
    return of(true);
  }

  testbil: FormGroup;
  submit() {
    this.missionService.addMission(this.testbil.value).subscribe(
      (data: any) => {
        this.toaster.success('Enregistrement réussi');
        this.router.navigate(["mission/mes-missions"]);
        console.log(data);
      },
      (error: any) => {
        this.toaster.error('Une erreur s\'est produite lors de l\'enregistrement.');
        console.error(error);
      }
    );
  }

}
