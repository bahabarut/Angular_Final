import { Konu } from './../models/Konu';
import { Kategori } from './../models/Kategori';
import { Ders } from './../models/Ders';
import { Uye } from './../models/Uye';
import { concatMap, from, map, Observable, of, switchMap, take } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  collectionData,
  deleteDoc,
  docData,
  Firestore,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { addDoc, collection, doc, query } from '@firebase/firestore';
import { Auth, authState, signInWithPopup } from '@angular/fire/auth';
import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from '@firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Storage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class FbserviceService {
  aktifUye = authState(this.auth);
  constructor(
    public fs: Firestore,
    public auth: Auth,
    public storage: Storage
  ) {}

  GoogleSignUp() {
    var provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth, provider));
  }
  FacebookSignUp() {
    var provider = new FacebookAuthProvider();
    return from(signInWithPopup(this.auth, provider));
  }

  KayitOl(email: string, parola: string) {
    return from(createUserWithEmailAndPassword(this.auth, email, parola));
  }
  OturumAc(email: string, parola: string) {
    return from(signInWithEmailAndPassword(this.auth, email, parola));
  }
  OturumKapat() {
    return from(this.auth.signOut());
  }

  get AktifUyeBilgi() {
    return this.aktifUye.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }
        const ref = doc(this.fs, 'Uyeler', user?.uid);
        return docData(ref) as Observable<Uye>;
      })
    );
  }

  UyeListele() {
    var ref = collection(this.fs, 'Uyeler');
    return collectionData(ref, { idField: 'uid' }) as Observable<Uye[]>;
  }
  UyeEkle(uye: Uye) {
    var ref = doc(this.fs, 'Uyeler', uye.uid);
    return from(setDoc(ref, uye));
  }
  UyeDuzenle(uye: Uye) {
    var ref = doc(this.fs, 'Uyeler/' + uye.uid);
    return from(updateDoc(ref, { ...uye }));
  }
  UyeSil(uye: Uye) {
    var ref = doc(this.fs, 'Uyeler/' + uye.uid);
    return deleteDoc(ref);
  }

  KategoriListele() {
    var ref = collection(this.fs, 'Kategoriler');
    return collectionData(ref, { idField: 'kategoriId' }) as Observable<
      Kategori[]
    >;
  }
  KategoriById(katId: string) {
    var ref = collection(this.fs, 'Kategoriler');
    var Query = query(ref, where('kategoriId', '==', katId));
    return collectionData(Query, { idField: 'kategoriId' }) as Observable<
      Kategori[]
    >;
  }
  KategoriEkle(kategori: Kategori) {
    var ref = collection(this.fs, 'Kategoriler');
    return addDoc(ref, kategori);
  }
  KategoriDuzenle(kategori: Kategori) {
    var ref = doc(this.fs, 'Kategoriler/' + kategori.kategoriId);
    return updateDoc(ref, { ...kategori });
  }
  KategoriSil(kategori: Kategori) {
    var ref = doc(this.fs, 'Kategoriler/' + kategori.kategoriId);
    return deleteDoc(ref);
  }
  DersEkle(ders: Ders) {
    var ref = collection(this.fs, 'Dersler');
    return this.aktifUye.pipe(
      take(1),
      concatMap((user) =>
        addDoc(ref, {
          dersKodu: ders.dersKodu,
          dersAdi: ders.dersAdi,
          dersKredisi: ders.dersKredisi,
          dersSaati: ders.dersSaati,
          kategoriId: ders.kategoriId,
          uid: user?.uid,
          dersId: ders.dersId,
        })
      ),
      map((ref) => ref.id)
    );
  }
  DersListele() {
    var ref = collection(this.fs, 'Dersler');
    return this.aktifUye.pipe(
      concatMap((user) => {
        const myQuery = query(ref, where('uid', '==', user?.uid));
        return collectionData(myQuery, { idField: 'dersId' }) as Observable<
          Ders[]
        >;
      })
    );
  }
  DersById(drsId: string) {
    var ref = collection(this.fs, 'Dersler');
    var Query = query(ref, where('dersId', '==', drsId));
    return collectionData(Query, { idField: 'dersId' }) as Observable<Ders[]>;
  }

  DersByKategoriId(katId: string) {
    var ref = collection(this.fs, 'Dersler');
    const myQuery = query(ref, where('kategoriId', '==', katId));
    console.log(ref);
    return collectionData(myQuery, { idField: 'kategoriId' }) as Observable<
      Ders[]
    >;
  }
  DersDuzenle(ders: Ders) {
    var ref = doc(this.fs, 'Dersler/' + ders.dersId);
    return updateDoc(ref, { ...ders });
  }
  DersSil(ders: Ders) {
    var ref = doc(this.fs, 'Dersler/' + ders.dersId);
    return deleteDoc(ref);
  }
  KonuListele() {
    var ref = collection(this.fs, 'Konuler');
    return collectionData(ref, { idField: 'konuId' }) as Observable<Konu[]>;
  }

  KonuByDersId(id: string) {
    var ref = collection(this.fs, 'Konular');
    const myQuery = query(ref, where('dersId', '==', id));
    console.log(ref);
    return collectionData(myQuery, { idField: 'dersId' }) as Observable<Konu[]>;
  }
  KonuEkle(konu: Konu) {
    var ref = collection(this.fs, 'Konuler');
    return addDoc(ref, konu);
  }
  KonuDuzenle(konu: Konu) {
    var ref = doc(this.fs, 'Konuler/' + konu.konuId);
    return updateDoc(ref, { ...konu });
  }
  KonuSil(konu: Konu) {
    var ref = doc(this.fs, 'Konuler/' + konu.konuId);
    return deleteDoc(ref);
  }
  uploadImage(image: File, path: string): Observable<string> {
    const storageRef = ref(this.storage, path);
    const uploadTask = from(uploadBytes(storageRef, image));
    return uploadTask.pipe(switchMap((result) => getDownloadURL(result.ref)));
  }
}
