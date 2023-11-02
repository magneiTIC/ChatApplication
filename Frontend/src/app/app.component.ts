import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Frontend';
  @HostListener('document:keydown', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    if (event.ctrlKey && (event.key === 'c' || event.key === 'C')) {
      event.preventDefault(); // Empêche l'action par défaut de copier (Ctrl+C)
    }
  }
  constructor(){
    document.addEventListener('keydown', function (event) {
      const isCtrlPressed = event.ctrlKey || event.metaKey;
      const isAltPressed = event.altKey;
    
      // Vous pouvez également ajouter d'autres combinaisons de touches
      if (isCtrlPressed || isAltPressed || event.key === 'PrintScreen') {
        console.log("Tentative de capture d'écran détectée");
        applyBlackout()
        //alert("Capture d'écran détectée. La fonction de copie est désactivée.");
        event.preventDefault();
      }
    });
  }
  
}
function applyBlackout() {
  // Créez un élément div pour le masque noir
  var blackoutDiv = document.createElement('div');
  blackoutDiv.style.position = 'fixed';
  blackoutDiv.style.top = '0';
  blackoutDiv.style.left = '0';
  blackoutDiv.style.width = '100%';
  blackoutDiv.style.height = '100%';
  blackoutDiv.style.backgroundColor = 'black';
  blackoutDiv.style.zIndex = '9999';

  // Ajoutez le masque noir à la page
  document.body.appendChild(blackoutDiv);

  // Supprimez le masque noir après un certain délai
  setTimeout(function () {
    document.body.removeChild(blackoutDiv);
  }, 3000); // Par exemple, supprimez le masque après 3 secondes
}

