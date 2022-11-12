import { Component, OnInit } from '@angular/core';
import { ContactService } from 'src/app/services/contact.service';

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

  constructor(private contact: ContactService) { }

  ngOnInit(): void {
  }
  submitForm(){
    postMessage(this.message);
  }

}
