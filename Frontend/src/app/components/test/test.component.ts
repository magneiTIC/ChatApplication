import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {

@ViewChild('endOfChat' )endOfChat!: ElementRef ;

  emailControl = new FormControl(' ', [Validators.required, Validators.email]);

  scrollToBottom(){
    setTimeout(() => {
      if (this.endOfChat) {
        this.endOfChat.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }
   
  
  
  sendMessage(){

  }
}
