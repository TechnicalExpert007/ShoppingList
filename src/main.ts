import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app-config';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

addIcons({
  add: add,
});


bootstrapApplication(AppComponent, config)
  .catch(err => console.error(err));