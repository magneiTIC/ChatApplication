import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { LoginResponse } from './login-response.interface';
import { SocketService } from 'src/app/services/sockets/sockets.service';

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
    private authService: AuthService,
    private socketService: SocketService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.validationError = true;
      return;
    }
    const email = this.loginForm.value;
    const password = this.loginForm.value;
    this.authService.isProfileConfigured(email).subscribe(
      (response) => {
        // Utilisez une assertion de type ici
        const loginResponse = response as LoginResponse; // Assertion de type
        // Gestion de la réponse de l'API
        console.log('Réponse de l\'API :', response);
        if (loginResponse.isConfigured === false) {
          // Rediriger vers la page d'inscription si l'inscription n'est pas terminée
          console.log('L\'utilisateur doit terminer son inscription.');
          sessionStorage.setItem('email', email);
          this.router.navigate(['/register']);
        } else {
          this.authService.login(email, password)

          Rediriger vers la page de chat si l'inscription est terminée
          console.log('L\'utilisateur est connecté et peut accéder à la page de chat.');
          this.router.navigate(['/test']);
        }
      },
      (error) => {
        // Gestion des erreurs
        console.error('Erreur de connexion :', error);
        this.errorMessage = 'Adresse e-mail ou mot de passe incorrect.';
      }
    )
  }

  resetError() {
    this.validationError = false;
    this.connexionError = false;
  }
}


