import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
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
email: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private socketService: SocketService,
    // private toast: HotToastService

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

    this.resetError(); // Réinitialiser les erreurs

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    const isProfileConfigured = await this.authService.isProfileConfigured(email);

    if (!isProfileConfigured) {
      console.log("Profil non configuré");
      // Rediriger l'utilisateur vers la page "register" s'il n'a pas configuré son profil
      this.router.navigate(['/register']);
    } else {
      const loginSuccessful = await this.authService.login(email, password);

      if (loginSuccessful) {
        console.log('Connexion réussie');
        this.router.navigate(['/test']);
      } else {
        // Gérer l'échec de la connexion en affichant une erreur de connexion
        this.connexionError = true;
      }
    }
  }

  resetError() {
    this.validationError = false;
    this.connexionError = false;
  }
}
