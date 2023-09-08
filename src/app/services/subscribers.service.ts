import { Injectable } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubscribersService {
  constructor(private afs: AngularFirestore, private toast: ToastrService) {}

  loadSubscribers() {
    return this.afs
      .collection('subscribers')
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { data, id };
          });
        })
      );
  }

  deleteSubscribers(id: string) {
    this.afs
      .doc(`subscribers/${id}`)
      .delete()
      .then((docRef) => {
        this.toast.success('User deleted');
      });
  }
}
