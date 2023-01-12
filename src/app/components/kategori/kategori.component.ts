import { HotToastService } from '@ngneat/hot-toast';
import { FbserviceService } from './../../services/fbservice.service';
import { Kategori } from './../../models/Kategori';
import { Component, OnInit } from '@angular/core';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-kategori',
  templateUrl: './kategori.component.html',
  styleUrls: ['./kategori.component.scss'],
})
export class KategoriComponent implements OnInit {
  uye = this.fbservis.AktifUyeBilgi;
  kategoriler!: Kategori[];
  modal!: Modal;
  modalBaslik: string = '';
  secKategori!: Kategori;
  frm: FormGroup = new FormGroup({
    kategoriId: new FormControl(),
    kategoriAdi: new FormControl(),
    aciklama: new FormControl(),
  });
  constructor(
    public fbservis: FbserviceService,
    public htoast: HotToastService
  ) {}

  ngOnInit() {
    this.KategoriListele();
  }

  Ekle(el: HTMLElement) {
    this.frm.reset();
    this.frm.patchValue({});
    this.modal = new bootstrap.Modal(el);
    this.modalBaslik = 'Kategori Ekle';
    this.modal.show();
  }

  Duzenle(kategori: Kategori, el: HTMLElement) {
    this.frm.patchValue(kategori);
    this.modalBaslik = 'Kategori Düzenle';
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }
  Sil(kategori: Kategori, el: HTMLElement) {
    this.secKategori = kategori;
    this.modalBaslik = 'Kategori Sil';
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }

  KategoriListele() {
    this.fbservis.KategoriListele().subscribe((d) => {
      this.kategoriler = d;
    });
  }

  KategoriEkleDuzenle() {
    var kategori: Kategori = this.frm.value;
    if (!kategori.kategoriId) {
      this.fbservis.KategoriEkle(kategori).then();
      this.modal.toggle();
    } else {
      this.fbservis.KategoriDuzenle(kategori).then(() => {
        this.modal.toggle();
      });
    }
  }

  KategoriSil() {
    this.fbservis.KategoriSil(this.secKategori).then(() => {});
    this.modal.toggle();
  }

  // KategoriListele() {
  //   this.dataServis.KategoriListele().subscribe((d) => {
  //     this.kategoriler = d;
  //   });
  // }

  // KategoriEkleDuzenle() {
  //   var kategori: Kategori = this.frm.value;
  //   var tarih = new Date();
  //   if (!kategori.id) {
  //     var filtre = this.kategoriler.filter(
  //       (s) => s.kategoriAdi == kategori.kategoriAdi
  //     );
  //     if (filtre.length > 0) {
  //       this.sonuc.islem = false;
  //       this.sonuc.mesaj = 'Girilen Kategori Adı Kayıtlıdır';
  //       this.toast.ToastUygula(this.sonuc);
  //     } else {
  //       kategori.kayTarih = tarih.getTime().toString();
  //       kategori.duzTarih = tarih.getTime().toString();
  //       this.dataServis.KategoriEkle(kategori).subscribe((d) => {
  //         this.sonuc.islem = true;
  //         this.sonuc.mesaj = 'Kategori Eklendi';
  //         this.toast.ToastUygula(this.sonuc);
  //         this.KategoriListele();
  //         this.modal.toggle();
  //       });
  //     }
  //   } else {
  //     kategori.duzTarih = tarih.getTime().toString();
  //     this.dataServis.KategoriDuzenle(kategori).subscribe((d) => {
  //       this.sonuc.islem = true;
  //       this.sonuc.mesaj = 'Kategori Düzenlendi';
  //       this.toast.ToastUygula(this.sonuc);
  //       this.KategoriListele();
  //       this.modal.toggle();
  //     });
  //   }
  // }
  // KategoriSil() {
  //   this.dataServis.KategoriSil(this.secKategori.id).subscribe((d) => {
  //     this.sonuc.islem = true;
  //     this.sonuc.mesaj = 'Kategori Silindi';
  //     this.toast.ToastUygula(this.sonuc);
  //     this.KategoriListele();
  //     this.modal.toggle();
  //   });
  // }
}
