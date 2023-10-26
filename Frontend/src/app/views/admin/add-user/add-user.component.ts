import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  registerForm!: FormGroup;
  validationError: boolean = false;
  connexionError: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  emailControl = new FormControl(' ', [Validators.required, Validators.email]);


  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      division: ['', [Validators.required]]
    });
  }
  onSubmit() {
    if (this.registerForm.invalid) {
      this.validationError = true;
      return;
    } 
    // Créez un objet avec les données à envoyer à l'API Express
    const userData = {
      email: this.registerForm.value.email,
      division: this.registerForm.value.division,
    };
    // Utilisez le service AuthService pour envoyer les données
    this.authService.createUser(userData).subscribe(
      (response) => {
        console.log('Inscription de l\'utilisateur commencée avec succès :', response);
        // Gérez la réponse ici, par exemple, affichez un message de confirmation
      },
      (error) => {
        console.error('Erreur lors de la tentative de début d\'inscription :', error);
        // Gérez les erreurs ici
      }
    );
  }
}
