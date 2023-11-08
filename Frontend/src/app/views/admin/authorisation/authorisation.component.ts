import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ChatsService } from 'src/app/services/chats/chats.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-authorisation',
  templateUrl: './authorisation.component.html',
  styleUrls: ['./authorisation.component.css']
})
export class AuthorisationComponent implements OnInit {
 authForm!: FormGroup;
    validationError: boolean = false;
    connexionError: boolean = false;
  
    constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService,
      private chatsService: ChatsService
    ) { }
  
  
  
    ngOnInit(): void {
      this.authForm = this.formBuilder.group({
        emailUserA: ['', [Validators.required, Validators.email]],
        emailUserB: ['', [Validators.required, Validators.email]],
  
      });
    }
  
  
    
  
    async onSubmit() {
      if (this.authForm.invalid) {
        this.validationError=true;
        return;
    }
    const emailUserA=this.authForm.value.emailUserA
    const emailUserB=this.authForm.value.emailUserB
    try {
      if (emailUserA && emailUserB)
      {
        this.chatsService.createChatWithExternalAgent(emailUserA,emailUserB)
        this.alert();
        this.router.navigate(['autorisation']);
        this.authForm.reset()

      }
      else {
        console.log("création bi dialoul")
      }
    } 
    catch (error) {
      console.error("Erreur lors de la création d'une conversation avec l'utilisateur d'une autre division")
    }

    
  }
  alert() {
    Swal.fire({
      icon: 'success',
      title: 'Autorisation validée !',
      showConfirmButton: false,
      timer: 1000,
    });
  }
}