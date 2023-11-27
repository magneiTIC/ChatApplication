import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-director',
  templateUrl: './add-director.component.html',
  styleUrls: ['./add-director.component.css']
})
export class AddDirectorComponent implements OnInit {
    addDirectorForm !: FormGroup;
    validationError: boolean = false;
    connexionError: boolean = false;
  
    constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      private userService: UserService
    ) { }
    
  
    ngOnInit(): void {
      this.addDirectorForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        email1: ['', [Validators.required, Validators.email]],
        division: ['', [Validators.required ]],
      });
    }
    onSubmit() {
      if (this.addDirectorForm.invalid)  {
        this.validationError = true;
        return;
      } else{console.log('correct')}
      if(this.addDirectorForm.value.email == this.addDirectorForm.value.email1){
         // Créez un objet avec les données à envoyer à l'API Express
      

      const email= this.addDirectorForm.value.email;
      const division =this.addDirectorForm.value.division
      const profile ='DIRECTEUR'
     
      // Utilisez le service AuthService pour envoyer les données
      this.userService.createUser(email,profile,division)
      .subscribe((userData) => {
        // Vous pouvez traiter les données renvoyées ici
        console.log('Utilisateur créé avec succès', userData);
      }, (error) => {
        console.error('Erreur lors de la création de l\'utilisateur', error);
        // Gérez les erreurs ici
      });
      }
      this.alert();
      this.router.navigate(['AjoutDirecteur']);
      this.addDirectorForm.reset()
     
    }
    alert() {
      Swal.fire({
        icon: 'success',
        title: 'Création réussie !',
        showConfirmButton: false,
        timer: 1000,
      });
    }

}
