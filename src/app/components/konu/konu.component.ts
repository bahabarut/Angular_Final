import { FbserviceService } from './../../services/fbservice.service';
import { Konu } from './../../models/Konu';
import { Ders } from './../../models/Ders';
import { Component, OnInit } from '@angular/core';
import { Modal } from 'bootstrap';

import { ActivatedRoute } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-konu',
  templateUrl: './konu.component.html',
  styleUrls: ['./konu.component.scss'],
})
export class KonuComponent implements OnInit {
  uye = this.fbservis.AktifUyeBilgi;
  dersler!: Ders[];
  derslery!: Ders[];
  dersId!: string;
  konular!: Konu[];
  modal!: Modal;
  modalBaslik: string = '';
  secKonu!: Konu;
  secDers!: Ders;
  frm: FormGroup = new FormGroup({
    konuId: new FormControl(),
    konuAdi: new FormControl(),
    dersId: new FormControl(),
  });
  constructor(
    public route: ActivatedRoute,
    public fbservis: FbserviceService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((p: any) => {
      this.dersId = p.dersId;
    });
    this.KonuListele();
    this.DersListele();
  }
  DersListele() {
    this.fbservis.DersListele().subscribe((d) => {
      this.dersler = d;
    });
  }
  Ekle(el: HTMLElement) {
    this.frm.reset();
    this.frm.patchValue({});
    this.modal = new bootstrap.Modal(el);
    this.modalBaslik = 'Konu Ekle';
    this.modal.show();
  }

  Duzenle(konu: Konu, el: HTMLElement) {
    this.frm.patchValue(konu);
    this.frm.patchValue({ dersId: this.dersId });
    this.modalBaslik = 'Konu Düzenle';
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }
  Sil(konu: Konu, el: HTMLElement) {
    this.secKonu = konu;
    this.modalBaslik = 'Konu Sil';
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }
  KonuListele() {
    this.fbservis.KonuListele().subscribe((d) => {
      this.konular = d;
    });
  }

  KonuEkleDuzenle() {
    var konu: Konu = this.frm.value;
    if (!konu.konuId) {
      this.fbservis.KonuEkle(konu).then(() => {});
      this.modal.toggle();
    } else {
      this.fbservis.KonuDuzenle(konu).then(() => {});
      this.modal.toggle();
    }
  }
  KonuSil() {
    this.fbservis.KonuSil(this.secKonu).then(() => {});
    this.modal.toggle();
  }
}
