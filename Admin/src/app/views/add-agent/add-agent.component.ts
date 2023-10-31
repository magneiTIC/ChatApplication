import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-add-agent',
  templateUrl: './add-agent.component.html',
  styleUrls: ['./add-agent.component.css']
})
export class AddAgentComponent implements OnInit {
  addDirectorForm!: FormGroup;
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
  }
}
