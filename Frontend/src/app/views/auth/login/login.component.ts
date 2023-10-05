import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  validationError: boolean = false;
  connexionError: boolean = false;
  profil: any;

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

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.validationError = true;
      return;
    }

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    try {
      // Utilisez le service AuthService pour gérer la connexion de l'utilisateur
      const userCredential = await this.authService.signIn(email, password);

      // Connexion réussie
      const user = userCredential.user;
      console.log('Utilisateur connecté :', user);

      // Redirigez l'utilisateur vers une autre page (par exemple, le profil)
      this.router.navigate(['/home']);
    } catch (error) {
      // Gérez les erreurs de connexion
      console.error('Erreur de connexion :', error);
      this.connexionError = true;
    }

  }

  resetError() {
    this.validationError = false;
    this.connexionError = false;
  }
}


