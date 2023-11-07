import { Component,Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
// import * as pdf from 'pdfjs-dist/build/pdf';
import * as pdfjslib from 'pdfjs-dist';

@Component({

  selector: 'app-file-viewer-dialog',
  templateUrl: './file-viewer-dialog.component.html',
  styleUrls: ['./file-viewer-dialog.component.css']
})
export class FileViewerDialogComponent implements OnInit {
  pdfData:string | undefined

    constructor(
      private dialog : MatDialog
    ){}
  
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  public dialogRef: MatDialogRef<FileViewerDialogComponent> | undefined 
  @Inject(MAT_DIALOG_DATA) public data: any



  // loadPdfData(pdfUrl: string): void {
  //   pdfjslib.getDocument(pdfUrl).promise.then((pdf) => {
  //     pdf.getPage(1).then((page) => {
  //       const canvas = document.createElement('canvas');
  //       const context = canvas.getContext('2d') as any; // Utilisation de 'any' ici pour éviter les erreurs de type
  //       const viewport = page.getViewport({ scale: 1 });
  //       canvas.height = viewport.height;
  //       canvas.width = viewport.width;

  //       page.render({
  //         canvasContext: context,
  //         viewport: viewport,
  //       }).promise.then(() => {
  //         // Le rendu est terminé, vous pouvez maintenant manipuler l'image sur le canvas.
  //       });
  //     });
  //   });
  // }






  



}
