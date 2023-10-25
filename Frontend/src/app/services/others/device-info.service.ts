import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';


@Injectable({
  providedIn: 'root'
})
export class DeviceInfoService {
  
  apiUrl = 'http://localhost:3000'

  private deviceId: string;

  constructor( private http: HttpClient ) {
    this.deviceId = this.getDeviceId();
  }

  private getDeviceId(): string {
    const storedDeviceId = localStorage.getItem('deviceId');
    if (storedDeviceId ) {
      return storedDeviceId;
    } else {
      const newDeviceId = this.generateDeviceId();
      localStorage.setItem('deviceId', newDeviceId);
      return newDeviceId;
    }
  }

  private generateDeviceId(): string {
    return uuidv4();
  }

  sendDeviceInfo() {
    const userAgent = navigator.userAgent;
    console.log("UserAgent: ", userAgent);
    const data = {
      deviceId: this.deviceId,
      uid: sessionStorage.getItem('uid'),
      userAgent,
    };
    console.log("DeviceInfo: ", data);
  
    this.http.post(`${this.apiUrl}/services/collect-info`, data)
      .subscribe(
        (response) => {
          // Gérer la réponse si la requête est réussie
          console.log('Réponse du serveur:', response);
        },
        (error) => {
          // Gérer les erreurs de la requête
          console.error('Erreur de la requête:', error);
        }
      );
  }
  
  
  

}


