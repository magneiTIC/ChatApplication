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

  onSubmit(){
    console.log('coucou')
    console.log(this.loginForm.value.email,this.loginForm.value.password)
    if(this.loginForm.invalid){
      return console.log('invalid') ;
    }else{
      console.log('bonjr')
      this.AuthService.signIn(this.loginForm.value.email, this.loginForm.value.password).then(       
        result=>{
          console.log("HELLO")
          console.log(result)
          this.router.navigate(['/dashboard'])

          // if(result.user.status=='admin'){
          //   this.router.navigate(['/admin/dashboard'])
          // }
          // else{
          //   this.router.navigate(['/dashboard']);

          // }
        }
      )
    }

  }

}

