import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Chat3Data } from 'src/app/shared/data/chat/chat3';
import { CallService } from '../../../components/apps/chat/services/call-service';

@Component({
  selector: 'app-calldialog',
  templateUrl: './calldialog.component.html',
  styleUrls: ['./calldialog.component.scss']
})
export class CallDialog  {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<CallDialog>) {
    
  }

  onAnswerClick(): void {
    
    this.dialogRef.close(true);
  }

  onRefuseClick(): void {
    

    this.dialogRef.close(false);
  }
}