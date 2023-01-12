import { switchMap } from 'rxjs';
import { HotToastService } from '@ngneat/hot-toast';
import { FbserviceService } from './../../services/fbservice.service';
import { Uye } from './../../models/Uye';
import { Component, OnInit } from '@angular/core';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { FormControl, FormGroup } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { mainModule } from 'process';

@Component({
  selector: 'app-uye',
  templateUrl: './uye.component.html',
  styleUrls: ['./uye.component.scss'],
})
export class UyeComponent implements OnInit {
  uye = this.fbservis.AktifUyeBilgi;
  uyeler!: Uye[];
  modal!: Modal;
  modalBaslik: string = '';
  secUye!: Uye;
  frm: FormGroup = new FormGroup({
    uid: new FormControl(),
    displayName: new FormControl(),
    yas: new FormControl(),
    rol: new FormControl(),
    email: new FormControl(),
    parola: new FormControl(),
  });
  constructor(
    public fbservis: FbserviceService,
    public htoast: HotToastService
  ) {}

  ngOnInit() {
    this.UyeListele();
  }

  Ekle(el: HTMLElement) {
    console.log('ekle');

    this.frm.reset();
    this.frm.patchValue({});
    this.modal = new bootstrap.Modal(el);
    this.modalBaslik = 'Üye Ekle';
    this.modal.show();
  }

  Duzenle(uye: Uye, el: HTMLElement) {
    this.frm.patchValue(uye);
    this.modalBaslik = 'Üye Düzenle';
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }
  Sil(uye: Uye, el: HTMLElement) {
    this.secUye = uye;
    this.modalBaslik = 'Üye Sil';
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }

  UyeListele() {
    this.fbservis.UyeListele().subscribe((d) => {
      this.uyeler = d;
    });
  }
  UyeEkleDuzenle() {
    var uye: Uye = this.frm.value;
    if (!uye.uid) {
      this.fbservis
        .KayitOl(this.frm.value.email, this.frm.value.parola)
        .pipe(
          switchMap(({ user: { uid } }) =>
            this.fbservis.UyeEkle({
              uid,
              email: this.frm.value.email,
              parola: this.frm.value.parola,
              yas: this.frm.value.yas,
              displayName: this.frm.value.displayName,
              rol: this.frm.value.rol,
            })
          ),
          this.htoast.observe({
            loading: 'Üye Ekleniyor',
            success: 'Üye Eklendi',
            error: ({ message }) => `Hata =>${message}`,
          })
        )
        .subscribe(() => {});
      this.modal.toggle();
    } else {
      this.fbservis.UyeDuzenle(uye).pipe(
        this.htoast.observe({
          loading: 'Güncelleniyor',
          success: 'Güncellendi',
          error: ({ message }) => `Hata=>${message}`,
        })
      );
      this.modal.toggle();
    }
  }

  UyeSil() {
    this.fbservis.UyeSil(this.secUye).then(() => {});
    this.modal.toggle();
  }

  // UyeListele() {
  //   this.dataServis.UyeListele().subscribe((d) => {
  //     this.uyeler = d;
  //   });
  // }

  // UyeEkleDuzenle() {
  //   var uye: Uye = this.frm.value;
  //   var tarih = new Date();
  //   if (!uye.id) {
  //     var filtre = this.uyeler.filter((s) => (s.mail == uye.mail));
  //     if (filtre.length > 0) {
  //       this.sonuc.islem = false;
  //       this.sonuc.mesaj = 'Girilen Mail Adresi Kayıtlıdır';
  //       this.toast.ToastUygula(this.sonuc);
  //     } else {
  //       uye.kayTarih = tarih.getTime().toString();
  //       uye.duzTarih = tarih.getTime().toString();
  //       this.dataServis.UyeEkle(uye).subscribe((d) => {
  //         this.sonuc.islem = true;
  //         this.sonuc.mesaj = 'Üye Eklendi';
  //         this.toast.ToastUygula(this.sonuc);
  //         this.UyeListele();
  //         this.modal.toggle();
  //       });
  //     }
  //   } else {
  //     uye.duzTarih = tarih.getTime().toString();
  //     this.dataServis.UyeDuzenle(uye).subscribe((d) => {
  //       this.sonuc.islem = true;
  //       this.sonuc.mesaj = 'Üye Düzenlendi';
  //       this.toast.ToastUygula(this.sonuc);
  //       this.UyeListele();
  //       this.modal.toggle();
  //     });
  //   }
  // }
  // UyeSil() {
  //   this.dataServis.UyeSil(this.secUye.id).subscribe((d) => {
  //     this.sonuc.islem = true;
  //     this.sonuc.mesaj = 'Üye Silindi';
  //     this.toast.ToastUygula(this.sonuc);
  //     this.UyeListele();
  //     this.modal.toggle();
  //   });
  // }
}

// frm: FormGroup = new FormGroup({
//   uid: new FormControl(),
//   adsoyad: new FormControl(),
//   yas: new FormControl(),
//   mail: new FormControl(),
//   rol: new FormControl(),
// });
