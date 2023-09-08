import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoggedInGuard: boolean = false;

  constructor(
    private afAuth: AngularFireAuth,
    private toast: ToastrService,
    private router: Router
  ) {}

  login(email: string, password: any) {
    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((logRef) => {
        this.toast.success('Logged in successfully');
        this.loadUser();
        this.loggedIn.next(true);
        this.isLoggedInGuard = true;
        this.router.navigate(['/']);
      })
      .catch((e) => {
        this.toast.warning(e);
      });
  }

  loadUser() {
    this.afAuth.authState.subscribe((user) => {
      localStorage.setItem('user', JSON.stringify(user));
    });
  }

  logoutUser() {
    this.afAuth.signOut().then(() => {
      this.toast.success('User logged out');
      localStorage.removeItem('user');
      this.loggedIn.next(false);
      this.isLoggedInGuard = false;

      this.router.navigate(['/login']);
    });
  }

  isLoggedIn() {
    return this.loggedIn.asObservable();
  }
}
