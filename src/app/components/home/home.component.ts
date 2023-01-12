import { FbserviceService } from './../../services/fbservice.service';
import { Component, OnInit } from '@angular/core';
import { Kategori } from 'src/app/models/Kategori';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  kategoriler!: Kategori[];
  uye = this.fbservis.AktifUyeBilgi;
  constructor(public fbservis: FbserviceService) {}

  ngOnInit() {
    this.KategoriListele();
  }

  KategoriListele() {
    this.fbservis.KategoriListele().subscribe((d) => {
      this.kategoriler = d;
    });
  }
}
