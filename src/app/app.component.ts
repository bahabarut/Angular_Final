import { authState, Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { FbserviceService } from './services/fbservice.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  uye = this.fbservis.AktifUyeBilgi;
  aktifUye = authState(this.auth);
  constructor(
    public fbservis: FbserviceService,
    public htoast: HotToastService,
    public router: Router,
    public auth: Auth
  ) {}
  OturumKapat() {
    this.fbservis
      .OturumKapat()
      .pipe(
        this.htoast.observe({
          loading: 'Çıkış Yapılıyor ',
          success: 'Çıkış Yapıldı',
          error: ({ message }) => `Hata => ${message}`,
        })
      )
      .subscribe(() => {
        this.router.navigate(['login']);
      });
  }
}
