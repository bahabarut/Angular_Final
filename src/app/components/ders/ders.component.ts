import { switchMap } from 'rxjs';
import { Konu } from './../../models/Konu';
import { HotToastService } from '@ngneat/hot-toast';
import { FbserviceService } from './../../services/fbservice.service';
import { Kategori } from './../../models/Kategori';
import { Ders } from './../../models/Ders';
import { Component, OnInit } from '@angular/core';
import { Modal } from 'bootstrap';
import { FormControl, FormGroup } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ders',
  templateUrl: './ders.component.html',
  styleUrls: ['./ders.component.scss'],
})
export class DersComponent implements OnInit {
  uye = this.fbservis.AktifUyeBilgi;
  kategoriler!: Kategori[];
  kategoriId!: string;
  dersler!: Ders[];
  modal!: Modal;
  modalBaslik: string = '';
  secDers!: Ders;
  secKategori!: Kategori;
  frm: FormGroup = new FormGroup({
    dersId: new FormControl(),
    dersKodu: new FormControl(),
    dersAdi: new FormControl(),
    dersKredisi: new FormControl(),
    dersSaati: new FormControl(),
    kategoriId: new FormControl(),
  });
  KonuFrm: FormGroup = new FormGroup({
    konuId: new FormControl(),
    konuAdi: new FormControl(),
    dersId: new FormControl(),
  });
  constructor(
    public fbservis: FbserviceService,
    public htoast: HotToastService,
    public route: ActivatedRoute
  ) {}
  ngOnInit() {
    // this.DersListele();
    // this.KategoriListele();
    this.route.params.subscribe((p: any) => {
      this.kategoriId = p.katId;
      this.KategoriById();
    });
    this.KategoriListele();
  }

  KategoriSec(kategoriId: string) {
    this.kategoriId = kategoriId;
    this.KategoriById();
  }

  KategoriListele() {
    this.fbservis.KategoriListele().subscribe((d) => {
      this.kategoriler = d;
    });
  }
  KategoriById() {
    this.fbservis.KategoriById(this.kategoriId).subscribe((d) => {
      this.secKategori = d[0];
      this.DersListele();
    });
  }

  Ekle(el: HTMLElement) {
    this.frm.reset();
    this.frm.patchValue({ kategoriId: this.kategoriId });
    this.modal = new bootstrap.Modal(el);
    this.modalBaslik = 'Ders Ekle';
    this.modal.show();
  }

  Duzenle(ders: Ders, el: HTMLElement) {
    this.frm.patchValue(ders);
    this.frm.patchValue({ kategoriId: this.kategoriId });
    this.modalBaslik = 'Ders Düzenle';
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }
  Sil(ders: Ders, el: HTMLElement) {
    this.secDers = ders;
    this.modalBaslik = 'Ders Sil';
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }
  DersListele() {
    this.fbservis.DersByKategoriId(this.kategoriId).subscribe((d) => {
      this.dersler = d;
    });
  }

  DersEkleDuzenle() {
    var ders: Ders = this.frm.value;
    if (!ders.dersId) {
      this.fbservis
        .DersEkle(ders)
        .pipe(
          this.htoast.observe({
            loading: 'Ders Ekleniyor',
            success: 'Ders Eklendi',
            error: ({ message }) => `Hata => ${message}`,
          })
        )
        .subscribe(() => {});
      this.modal.toggle();
    } else {
      this.fbservis.DersDuzenle(ders).then(() => {});
      this.modal.toggle();
    }
  }
  DersSil() {
    this.fbservis.DersSil(this.secDers).then(() => {});
    this.modal.toggle();
  }

  EkleKonu(el: HTMLElement) {
    this.frm.reset();
    this.frm.patchValue({});
    this.modal = new bootstrap.Modal(el);
    this.modalBaslik = 'Konu Ekle';
    this.modal.show();
  }
  KonuEkle() {
    var konu: Konu = this.KonuFrm.value;
    this.fbservis.KonuEkle(konu).then(() => {});
    this.modal.toggle();
  }
}
