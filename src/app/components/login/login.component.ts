import { HotToastService } from '@ngneat/hot-toast';
import { FbserviceService } from './../../services/fbservice.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    public fbservis: FbserviceService,
    public router: Router,
    public htoast: HotToastService
  ) {}

  ngOnInit() {}
  OturumAc(mail: string, parola: string) {
    this.fbservis
      .OturumAc(mail, parola)
      .pipe(
        this.htoast.observe({
          loading: 'Oturum Açılıyor',
          success: 'Oturum Açıldı',
          error: ({ message }) => `Hata =${message}`,
        })
      )
      .subscribe(() => {
        this.router.navigate(['']);
      });
  }
  GoogleOturumAc() {
    this.fbservis
      .GoogleSignUp()
      .pipe(
        this.htoast.observe({
          loading: 'Giriş Yapılıyor',
          success: 'Giriş Yapıldı',
          error: ({ message }) => `Hata => ${message}`,
        })
      )
      .subscribe(() => {
        this.router.navigate(['']);
      });
  }

  FacebookOturumAc() {
    this.fbservis
      .FacebookSignUp()
      .pipe(
        this.htoast.observe({
          loading: 'Giriş Yapılıyor',
          success: 'Giriş Yapıldı',
          error: ({ message }) => `Hata => ${message}`,
        })
      )
      .subscribe(() => {
        this.router.navigate(['']);
      });
  }

  // OturumAc(mail: string, parola: string) {
  //   this.dataServis.OturumAc(mail, parola).subscribe((d) => {
  //     if (d.length > 0) {
  //       var kayit: Uye = d[0];
  //       localStorage.setItem('adSoyad', kayit.adSoyad);
  //       localStorage.setItem('rol', kayit.rol.toString());
  //       location.href = '/';
  //     } else {
  //       var sonuc: Sonuc = new Sonuc();
  //       sonuc.islem = false;
  //       sonuc.mesaj = 'E-Posta Adresi veya Parola Geçersizdir';
  //       this.toast.ToastUygula(sonuc);
  //     }
  //   });
  // }
}
