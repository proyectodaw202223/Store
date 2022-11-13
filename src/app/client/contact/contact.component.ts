import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: [
    './contact.component.css',
    '../client.component.css'
    ]
})
export class ContactComponent implements OnInit {

  name: string = '';
  surname: string = '';
  email: string = '';
  message: string = '';

  constructor() { }

  ngOnInit(): void {
  }
  submitForm(){
    //enviar mensaje de contacto
  }

}
