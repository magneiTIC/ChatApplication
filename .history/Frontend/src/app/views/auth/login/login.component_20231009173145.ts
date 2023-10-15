import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
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
    private socketService: SocketService,
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    // Obtenez le nom d'utilisateur et le mot de passe depuis le formulaire
    const username = this.username;
    const password = this.password;

    // Effectuez l'authentification de l'utilisateur
    this.authService.login(username, password).subscribe(
      (response) => {
        // Authentification réussie, maintenant connectez-vous au serveur Socket.io
        this.socketService.connect();
        
        // Attendez que la connexion au serveur Socket.io soit établie
        this.socketService.onConnect(() => {
          // Une fois connecté, stockez le socket ID dans le sessionStorage
          const socketId = this.socketService.getSocketId();
          sessionStorage.setItem('socketId', socketId);

          // Redirigez vers la page de chat ou toute autre page appropriée
          this.router.navigate(['/chat']);
        });
      },
      (error) => {
        // Gestion des erreurs d'authentification
        console.error('Erreur d\'authentification :', error);
        // Af



        



      }
    }
  }







  resetError() {
    this.validationError = false;
    this.connexionError = false;
  }
}


