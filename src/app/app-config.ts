import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { IonicStorageModule } from '@ionic/storage-angular';
import { provideAnimations } from '@angular/platform-browser/animations';

export const config: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideIonicAngular(),
    provideAnimations(),
    importProvidersFrom(IonicStorageModule.forRoot())
  ]
};
