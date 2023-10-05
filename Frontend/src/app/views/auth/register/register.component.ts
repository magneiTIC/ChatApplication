import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Récupérez l'indicateur de réinitialisation du mot de passe depuis le stockage local
    const mustResetPassword = localStorage.getItem('mustResetPassword');

    // Vérifiez si l'utilisateur doit réinitialiser son mot de passe
    if (mustResetPassword === 'true') {
      // Redirigez l'utilisateur vers la page de réinitialisation du mot de passe
      this.router.navigate(['/reset-password']);
    } else {
      // Redirigez l'utilisateur vers la page principale de l'application
      this.router.navigate(['/home']);
    }
  }
}
