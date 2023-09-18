import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {  Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm= new FormGroup({
    email: new FormControl('',[ Validators.required,Validators.email]),
    mdp: new FormControl('',Validators.required)
    
  })
  constructor(    
    private router:Router,
   ){}

  ngOnInit(): void {}
  onSubmit(){
    console.log('coucou')
    console.log(this.loginForm.value.email,this.loginForm.value.mdp)
    if(this.loginForm.invalid){
      return console.log('invalid') ;
    }else{
      
            this.router.navigate(['/login']);

          
        }
      
    }

  }

