import { HostListener, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class DetectionService {
  apiUrl = 'http://localhost:3000'

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    // Détecter les raccourcis clavier
    if (
      (event.altKey && event.key === "PrintScreen") ||
      (event.ctrlKey && event.key === "PrintScreen") ||
      (event.shiftKey && event.key === "PrintScreen") ||
      ((event.metaKey || event.ctrlKey) && event.shiftKey && (event.key === '3' || event.key === '5'))
    ) {
      this.showWarning();
      const userDetails = {
        email: sessionStorage.getItem('email'), // Remplacez par le nom d'utilisateur de l'utilisateur
        userId: sessionStorage.getItem('uid'),    // Remplacez par l'ID de l'utilisateur
      };
      this.informAdministrator('Tentative de capture d\'écran détectée.', userDetails);
      event.preventDefault(); // Empêcher le comportement par défaut
    }
  }
  showWarning() {
    this.snackBar.open('La capture d\'écran est désactivée sur cette page en raison de la politique de sécurité de l\'entreprise.', 'Fermer', {
      duration: 5000, // Durée d'affichage de la notification (5 secondes)
    });
  }
  informAdministrator(message: string, userDetails: any) {
    // Ajoutez les détails de l'utilisateur à la requête
    this.http.post('/services/screenshotDetected', { message, userDetails }).subscribe(response => {
      console.log('Informé avec succès', response);
    });
  }
}
