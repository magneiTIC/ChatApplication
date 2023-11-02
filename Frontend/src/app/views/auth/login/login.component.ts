import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/services/sockets/sockets.service';
import { DeviceInfoService } from 'src/app/services/others/device-info.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  validationError: boolean = false;
  connexionError: boolean = false;
  errorMessage: any;
  email: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private deviceInfoService: DeviceInfoService,
    private socketService: SocketService,
    // private toast: HotToastService

  ) { }


  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }


  async onSubmit() {
    if (this.loginForm.invalid) {
      this.validationError = true;
      return;
    }

    this.resetError(); // Réinitialiser les erreurs

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    const isProfileConfigured = await this.authService.isProfileConfigured(email);

    if (!isProfileConfigured) {
      console.log("Profil non configuré");
      // Rediriger l'utilisateur vers la page "register" s'il n'a pas configuré son profil
      sessionStorage.setItem('email', email)
      this.router.navigate(['/register']);
    } else {
      
      const loginSuccessful = await this.authService.login(email, password);
      if (loginSuccessful) {
        // Récupérer l'ID de l'utilisateur à partir de l'AuthService
        const storedUid = sessionStorage.getItem("uid");
        if (storedUid !== null) {
          const userId = await this.authService.getCurrentUserIdByUid(storedUid);
          if (userId) {
            console.log('Connexion réussie');
            // Initialiser la connexion socket avec l'ID de l'utilisateur
            this.socketService.initializeSocketConnection();
            this.deviceInfoService.sendDeviceInfo();
            this.router.navigate(['/home']);
          } else {
            console.log("L'ID de l'utilisateur n'est pas valide");
            // Gérer l'erreur ici, par exemple, afficher un message à l'utilisateur.
          }
        } else {
          console.log("L'ID de l'utilisateur est null");
          // Gérer l'erreur ici, par exemple, afficher un message à l'utilisateur.
        }
      } else {
        // Gérer l'échec de la connexion en affichant une erreur de connexion
        this.connexionError = true;
      }
    }

  }

  resetError() {
    this.validationError = false;
    this.connexionError = false;
  }

}


