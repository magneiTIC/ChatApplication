import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

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
      private authService: AuthService
    ) { }
  
  
  
    ngOnInit(): void {
      this.authForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        email1: ['', [Validators.required, Validators.email]],
  
      });
    }
  
  
    
  
    onSubmit() {}
  }
