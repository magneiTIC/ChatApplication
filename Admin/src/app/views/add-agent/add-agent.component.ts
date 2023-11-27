import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-agent',
  templateUrl: './add-agent.component.html',
  styleUrls: ['./add-agent.component.css']
})
export class AddAgentComponent  implements OnInit {
  addAgentForm !: FormGroup;
  validationError: boolean = false;
  connexionError: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService
  ) { }
  

  ngOnInit(): void {
    this.addAgentForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      email1: ['', [Validators.required, Validators.email]],
      division: ['', [Validators.required ]],
    });
  }
  onSubmit() {
    if (this.addAgentForm.invalid)  {
      this.validationError = true;
      return;
    } else{console.log('correct')}
    if(this.addAgentForm.value.email == this.addAgentForm.value.email1){
       // Créez un objet avec les données à envoyer à l'API Express
    

    const email= this.addAgentForm.value.email;
    const division =this.addAgentForm.value.division
    const profile ='AGENT'
   
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
    this.router.navigate(['AjoutAgent']);
    this.addAgentForm.reset()
   
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
