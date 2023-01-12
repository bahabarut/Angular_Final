import { ProfilComponent } from './components/profil/profil.component';
import { SignupComponent } from './components/signup/signup.component';
import { KonuComponent } from './components/konu/konu.component';
import { LoginComponent } from './components/login/login.component';
import { DersComponent } from './components/ders/ders.component';
import { KategoriComponent } from './components/kategori/kategori.component';
import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UyeComponent } from './components/uye/uye.component';
import {
  canActivate,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
} from '@angular/fire/auth-guard';

const redirectToLogin = () => redirectUnauthorizedTo(['login']);
const redirectToHome = () => redirectLoggedInTo(['']);
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'uyeler', component: UyeComponent, ...canActivate(redirectToLogin) },
  {
    path: 'kategoriler',
    component: KategoriComponent,
    ...canActivate(redirectToLogin),
  },
  { path: 'login', component: LoginComponent, ...canActivate(redirectToHome) },
  {
    path: 'signup',
    component: SignupComponent,
    ...canActivate(redirectToHome),
  },
  {
    path: 'profil',
    component: ProfilComponent,
    ...canActivate(redirectToLogin),
  },
  {
    path: 'dersler',
    component: DersComponent,
    ...canActivate(redirectToLogin),
  },
  {
    path: 'dersler/:katId',
    component: DersComponent,
    ...canActivate(redirectToLogin),
  },
  {
    path: 'konular',
    component: KonuComponent,
    ...canActivate(redirectToLogin),
  },
  {
    path: 'konular/:dersId',
    component: KonuComponent,
    ...canActivate(redirectToLogin),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
