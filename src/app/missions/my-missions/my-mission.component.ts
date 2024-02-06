import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MustMatch } from 'src/app/shared/validations/passwordValidator';
import { NgWizardConfig, NgWizardService, StepChangedArgs, StepValidationArgs, STEP_STATE, THEME } from 'ng-wizard';
import { of } from 'rxjs';
import { MissionControllerService } from 'src/app/mission/services';
import { companyDB } from 'src/app/shared/data/table/datatable';
import {TypeServiceService} from "../../administration/type-service.service";
import {InactiveDays} from "../../administration/inactiveDays";
import {HttpClient, HttpHeaders} from "@angular/common/http";
@Component({
  selector: 'my-mission',
  templateUrl: './my-mission.component.html',
  styleUrls: ['./my-mission.component.scss']
})
export class MyMissionComponent implements OnInit {

  /**
   * 	private LocalDate endDate;
	private LocalDate startDate;
	private BigDecimal tjm;

   */

  columns = [
    { prop: 'name',  name: 'Titre de mission'},
    { prop: 'company.companyName',  name: 'Société'},
    {  prop: 'tjm',name: 'T.J.M' },
    { prop: 'startDate',name: 'Date de démarrage' },
    { prop: 'endDate',name: 'Date de fin de mission' },
    { prop: 'isForMe',name: 'Attribuer a moi' }
  ];
  loadingIndicator: boolean = true;
  reorderable: boolean = true;
  public company = [];
  //public missions = [];
  missions: any;
    inactiveDays: any[] = [];
  constructor(
    private missionService: MissionControllerService,
    private typeServiceService: TypeServiceService,
    private http: HttpClient
  ) {
   // this. initiateMissions();
  }




  
  ngOnInit(): void {
    this.missionService.getMissions().subscribe((data: any) => {
      this.missions = data;
      console.log(this.missions)
    });




   
  }}
