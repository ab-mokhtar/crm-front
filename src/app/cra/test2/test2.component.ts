import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MissionControllerService} from 'src/app/mission/services';
import {DomSanitizer} from '@angular/platform-browser';
import {saveAs} from 'file-saver';
import {CraService} from "../cra.services";
import {DefaultTableData} from "../../shared/data/table/defaultTableData";
import {InactiveDaysService} from "../../administration/services/inactive-days.service";
import {AuthenticationService} from "../../auth/services/authentication.service";
@Component({
  selector: 'app-test2',
  templateUrl: './test2.component.html',
  styleUrls: ['./test2.component.scss']
})
export class Test2Component implements OnInit {

  /**
   *  private LocalDate endDate;
   private LocalDate startDate;
   private BigDecimal tjm;

   */

  columns = [];

  monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  days = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
  public defaultData = DefaultTableData;
  currentMonthName: string;
  public company = [];
  public missions = [];
  activityDto = [];
  totaux = [];
  craFormGroup: FormGroup;
  totalWorkedDay;
  public inactiveDays: any[] = [];
  error: string = '';

  constructor(
    private craService: CraService,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private missionService: MissionControllerService,
    private inactiveDaysService: InactiveDaysService,
    private authenticationService: AuthenticationService,


  ) {
    this.initiateMissions();
    this.getInactiveDays();
    const d = new Date();
    this.currentMonthName = this.monthNames[d.getMonth()] + ' - ' + d.getFullYear();

    this.sanitizer.bypassSecurityTrustHtml('<div style="border: 1px solid red;"><h2>Safe Html</h2><span class="user-content">Server prepared this html block.</span></div>');

    this.craService.configuredMonth().subscribe(datas => {
      console.log(datas , 'configuredMonth');
      this.totalWorkedDay = datas.filter(d => !d.freeDay && !d.weekend).length;
      this.columns = datas.map(data => ({
        'prop': 'day' + new Date(data.today).getDate(),
        'name': this.days[new Date(data.today).getDay()] + '<br/>' + new Date(data.today).getDate(),
        'isWorkedDay': data.workedDay,
        'isFreeDay': data.freeDay,
        'weekend': data.weekend
      }));

      this.craService.getCraMonth().subscribe(res => {
        this.activityDto = res;
        console.log(this.activityDto , 'this.activityDto ')
        this.activityDto.forEach(element => {
          const map = new Map();
          let index = 0;
          this.activityDto.forEach((obj) => {
            map.set(index, obj.active ? 1 : 0);
            index++;
          });
          let miss = this.missions.filter(m => m.id == element.idMissions);
          this.addGroup(miss, map);
        });
      });

      this.craFormGroup = this.formBuilder.group({
        activities: this.formBuilder.array([])
      });

      (<FormArray>this.craFormGroup.controls.activities).push(
        new FormGroup({
            'mission': new FormControl(this.missions),
            'day1': new FormControl(),
            'day2': new FormControl(),
            'day3': new FormControl(),
            'day4': new FormControl(),
            'day5': new FormControl(),
            'day6': new FormControl(),
            'day7': new FormControl(),
            'day8': new FormControl(),
            'day9': new FormControl(),
            'day10': new FormControl(),
            'day11': new FormControl(),
            'day12': new FormControl(),
            'day13': new FormControl(),
            'day14': new FormControl(),
            'day15': new FormControl(),
            'day16': new FormControl(),
            'day17': new FormControl(),
            'day18': new FormControl(),
            'day19': new FormControl(),
            'day20': new FormControl(),
            'day21': new FormControl(),
            'day22': new FormControl(),
            'day23': new FormControl(),
            'day24': new FormControl(),
            'day25': new FormControl(),
            'day26': new FormControl(),
            'day27': new FormControl(),
            'day28': new FormControl(),
            'day29': new FormControl(),
            'day30': new FormControl(),
            'day31': new FormControl()
          }
        ));
    });
  }

  filledDayPercent(): number {
    let total = this.totaux.reduce((acc, cur) => acc + cur, 0);

    return (total * 100) / this.totalWorkedDay;
  }

  filledDay(): number {
    return this.totaux.reduce((acc, cur) => acc + cur, 0);
  }

  addGroup(mission, valueMonth) {
    let group = {};
    if (!valueMonth) {
      let index = 0;
      this.columns.forEach(input_template => {
        group[input_template.prop] = new FormControl(valueMonth[index]);
        index++;
      });
    } else {
      this.columns.forEach(input_template => {
        group[input_template.prop] = new FormControl(1);
      });
    }
    const firstLineActivity = this.formBuilder.group({
      ...group,
      //'mission': this.formBuilder.control(mission[1], [Validators.required])
    });

    const form = this.craFormGroup.get('activities') as FormArray
    form.push(firstLineActivity);
  }

  ngOnInit(): void {
   // this.total = this.valeurs.reduce((acc, curr) => acc + curr, 0);

  }

  saveCra() {
    const form = this.craFormGroup.get('activities') as FormArray;
    const convMap = {};
    form.value.forEach((val: any, key: string) => {
      if (key != 'mission') {
        const val2 = Object.keys(val).filter(m => m != 'mission').map(key => val[key]);
        var monthDays = val2.map((v, k) => ({
          days: k,
          value: v
        }));

        convMap['day' + key] = monthDays;
      }
    });
    var index = 0;
    var cras = form.value.map(entries => (
      {
        'mission': entries.mission,
        'cra': convMap['day' + (index++)]
      })
    );

    /**this.craSe rvice.createCra({cra:cras}).subscribe(response=> {
      let file = new Blob([response], { type: 'application/pdf' });
      var fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    })**/
    this.craService.download({cra: cras}).subscribe(blob => saveAs(blob, "filename.pdf"));
  }


  trackByFn(index: any, item: any) {
    return index;
  }


  initiateMissions() {
    this.missionService.getMissions().subscribe(res => {
      this.missions = res.filter(mission => mission.isForMe === true);
    //  this.missions = res.name;
      console.log(this.missions, 'missions list')
      this.craService.getInactiveDays().subscribe(res => {
     const   getInactiveDays = res
        console.log(getInactiveDays , "getInactiveDays")
        res.forEach(r => {
          this.addConge(r.name, r.id);
        })
      });
    });
  }
  getInactiveDays() {
    const headers = this.authenticationService.getAuthorizationHeaders();
    //  this.inactiveDaysService.getAllInactiveDays().subscribe(
    this.inactiveDaysService.getInactiveDays().subscribe(
      (data) => {
        this.inactiveDays = data;
        console.log(data , 'dataaaaaa')
      },
      (error) => {
        this.error = 'Une erreur s\'est produite lors de la récupération des jours inactifs. Veuillez réessayer plus tard.';
        throw error;
        console.error(error); // Afficher l'erreur dans la console pour le débogage
      }
    );
  }
  addConge(conge: string, id: string) {
    let conges = {
      name: conge,
      id: id
    };
    this.missions.push(conges);
  }

  calculateTotl(i) {
    const form = this.craFormGroup.get('activities') as FormArray;
    let sum = 0;
    for (let ind = 0; ind < form.controls.length; ind++) {
      sum += +form.controls[ind].value['day' + (i + 1)];

    }
    this.totaux[i] = sum;
   // this.validateTotal(i);

  }

  validateTotal(i) {
    const form = this.craFormGroup.get('activities') as FormArray;
    if (this.totaux[i] > 1) {
      for (let ind = 0; ind < form.controls.length; ind++) {

        var subForm = form.controls[ind] as FormArray;
        subForm.controls['day' + (i + 1)].setErrors({'required': true});
      }
    } else {
      for (let ind = 0; ind < form.controls.length; ind++) {
        var subForm = form.controls[ind] as FormArray;
        subForm.controls['day' + (i + 1)].setErrors(null);
        //form.controls[ind].setErrors(null);
      }
    }
  }

  isValidFormControl(i, j) {
    let forms = this.craFormGroup.get('activities') as FormArray;
    let subForms = forms.controls[i] as FormArray;
    if (subForms && subForms.controls && subForms.controls[j]) {

      return subForms.controls[j].valid;
    }
  }

  isValidTotal(i) {
    return this.totaux[i] < 2;
  }

/*  total: number = 0; // Variable pour stocker le total
  valeurs: number[] = []; // Tableau pour stocker les valeurs entrées

  afficherValeur(valeur: string) {
    const valeurNumerique = parseFloat(valeur); // Convertit la valeur entrée en nombre
    if (!isNaN(valeurNumerique)) {
      this.valeurs.push(valeurNumerique);
      this.total = this.valeurs.reduce((acc, curr) => acc + curr, 0); // Calcule le total
      console.log('Le total des valeurs entrées est : ' + this.total);
    }
  }*/



  afficherTotal() {
    let total = this.totaux.reduce((acc, cur) => acc + cur, 0);
    console.log(total , 'totallllllllllll')
  }




}
