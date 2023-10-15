import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { LoginResponse } from './login-response.interface'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  validationError: boolean = false;
  connexionError: boolean = false;
  errorMessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  

  resetError() {
    this.validationError = false;
    this.connexionError = false;
  }
}


