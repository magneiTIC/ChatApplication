import { Component, OnInit } from '@angular/core';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import {  Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  validationError: boolean = false;
connexionError: any;
  constructor(
    private formBuilder:FormBuilder,
    private router:Router,
    private AuthService:AuthService
    ){}

  ngOnInit(): void {

    this.loginForm = this.formBuilder.group({
      email:['',[Validators.required, Validators.email]],
      password:['',[Validators.required]]     
    })
  }

  //  async onSubmit(){
  //   console.log('coucou')
  //   console.log(this.loginForm.value.email,this.loginForm.value.password)
  //   if(this.loginForm.invalid){
  //     this.showError = true;
  //     //alert('Le formulaire est invalide. Veuillez remplir tous les champs correctement.')
  //     return console.log('Le formulaire est invalide. Veuillez remplir tous les champs correctement.') ;
      
  //   }

  //   const email=this.loginForm.value.email
  //   const password=this.loginForm.value.password

  //     const result = await this.AuthService.signIn(email,password)
  //     if (result.user)
    

  // }

 async onSubmit() {
    try {
      if (this.loginForm.invalid) {
        console.log('Formulaire invalide');
        this.validationError=true;
        alert('Le formulaire est invalide. Veuillez remplir tous les champs correctement.');
        return;
      }
  
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
  
      //console.log(`Email: ${email}, Mot de passe: ${password}`);
      
      const result = await this.AuthService.signIn(email, password);
      
      if (result ) {
        this.router.navigate(['home']);
      } 
      else 
      {
        this.connexionError=true
      }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      
      alert('Une erreur s\'est produite lors de la connexion. Veuillez réessayer plus tard.');
    }
  }
  resetError() {
    this.validationError = false;
    this.connexionError = false;
  }
}

