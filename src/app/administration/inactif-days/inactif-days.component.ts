import { Component, OnInit } from '@angular/core';
import {DefaultTableData} from "../../shared/data/table/defaultTableData";
import {ToastrService} from "ngx-toastr";
import {CraService} from "../../cra/cra.services";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {TypeServiceService} from "../type-service.service";
import {InactiveDays} from "../inactiveDays";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthenticationService} from "../../auth/services/authentication.service";
import {InactiveDaysService} from "../services/inactive-days.service";

@Component({
  selector: 'app-inactif-days',
  templateUrl: './inactif-days.component.html',
  styleUrls: ['./inactif-days.component.scss']
})
export class InactifDaysComponent implements OnInit {
 public inactiveDays: any[] = [];
  form: FormGroup;
  token: string;
  error: string = '';

  constructor(        private fb: FormBuilder,
                      private toaster: ToastrService,
                  private inactiveDaysService: InactiveDaysService,
                  private authenticationService: AuthenticationService,
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getInactiveDays()
  }

  onAddInactif() {
if (this.form.valid) {
      const name = this.form.get('name').value;
      const headers = this.authenticationService.getAuthorizationHeaders();
      this.inactiveDaysService.addInactiveDay(name, headers).subscribe(
        (data) => {
          this.inactiveDays.push(data);
          this.form.reset();
        },
        (error) => {
          this.toaster.error('Erreur lors de l\'ajout du jour inactif : ' + error.message, 'Erreur');
          throw error;
          console.error(error);
        }
      );
    }
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

}
