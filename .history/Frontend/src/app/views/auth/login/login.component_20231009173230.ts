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

  onSubmit() {
    if (this.loginForm.invalid) {
      this.validationError = true;
      return;
    }

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    // Connexion au serveur Socket.io et enregistrement du socket.id dans le sessionStorage
    this.socketService.connect();

    // Une fois connecté, enregistrez le socket.id dans sessionStorage
    this.socketService.onConnect(() => {
      const socketId = this.socketService.getSocketId();
      sessionStorage.setItem('socketId', socketId);
      console.log('Socket ID enregistré dans le sessionStorage :', socketId);
      
      // Continuez avec l'authentification
      this.authService.isProfileConfigured(email).subscribe(
        (response) => {
          // Gestion de la réponse de l'API
          console.log('Réponse de l\'API :', response);
          // ... (le reste de votre code d'authentification)
        },
        (error) => {
          // Gestion des erreurs
          console.error('Erreur de connexion :', error);
          this.connexionError = true;
        }
      );
    });
  }
}








  resetError() {
    this.validationError = false;
    this.connexionError = false;
  }
}


