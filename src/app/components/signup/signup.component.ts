import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { switchMap, Observable } from 'rxjs';
import { FbserviceService } from './../../services/fbservice.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  constructor(
    public fbservis: FbserviceService,
    public htoast: HotToastService,
    public router: Router
  ) {}

  ngOnInit() {}
  UyeOl(adsoyad: string, email: string, parola: string, yas: string) {
    this.fbservis
      .KayitOl(email, parola)
      .pipe(
        switchMap(({ user: { uid } }) =>
          this.fbservis.UyeEkle({
            uid,
            email,
            displayName: adsoyad,
            yas,
            parola,
          })
        ),
        this.htoast.observe({
          success: 'Kayıt Yapıldı',
          loading: 'Kayıt Yapılıyor...',
          error: ({ message }) => `${message}`,
        })
      )
      .subscribe(() => {
        this.router.navigate(['']);
      });
  }
}
