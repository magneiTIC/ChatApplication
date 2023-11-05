import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { AuthService } from 'src/app/services/auth/auth.service';

// Utilisez les fonctionnalités de crypto

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  validationError: boolean = false;
  connexionError: boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService) { }
  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      password1: ['', Validators.required],

    });
  }
  async onSubmit() {
    if (this.registerForm.invalid) {
      this.validationError = true;
      return;
    }
    const username = this.registerForm.value.username;
    const password = this.registerForm.value.password;
    const email = sessionStorage.getItem('email');
    try {
      if (email) {
        // Génération d'une paire de clés AES (clé publique et clé privée)
        const keyPair = CryptoJS.lib.WordArray.random(256 / 8);        
        await this.authService.createUserWithFirebase(username, password, email )
        console.log('Inscription de l\'utilisateur terminée avec succès :');
        // Gérez la réponse ici, par exemple, affichez un message de confirmation
        this.router.navigate(['/login']);
      }
      else {
        console.log("inscription bi dialoul");
      }
    } catch (error) {
      console.error('Erreur lors de la tentative de début d\'inscription :');
      // Gérez les erreurs ici
    }
  }
}
