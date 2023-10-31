import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-add-agent',
  templateUrl: './add-agent.component.html',
  styleUrls: ['./add-agent.component.css']
})
export class AddAgentComponent implements OnInit {
addAgentForm!: FormGroup;
  validationError: boolean = false;
  connexionError: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }



  ngOnInit(): void {
    this.addAgentForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      email1: ['', [Validators.required, Validators.email]],

    });
  }


  

  onSubmit() {
    const email= this.addAgentForm.value.email;
   const division = "Police Judiciaire "
   const profile ='AGENT'
  
    if (this.addAgentForm.invalid)  {
      console.log('validation incorrect')
      this.validationError = true;
      return;
    } else{console.log('validation correct')}
    if(this.addAgentForm.value.email == this.addAgentForm.value.email1){
       // Créez un objet avec les données à envoyer à l'API Express
       console.log('email correct')
     
    const userData = {
      email: this.addAgentForm.value.email,
      division: "Police Judiciaire ",
      profile:'Agent'
    };
   
    // Utilisez le service AuthService pour envoyer les données
    this.authService.createUser(email,profile,division)
    // .subscribe(
    //   (response) => {
    //     console.log('Inscription de l\'utilisateur commencée avec succès :', response);
    //     // Gérez la réponse ici, par exemple, affichez un message de confirmation
    //   },
    //   (error) => {
    //     console.error('Erreur lors de la tentative de début d\'inscription :', error);
    //     // Gérez les erreurs ici
    //   }
    // );
    }
   
  }
}

