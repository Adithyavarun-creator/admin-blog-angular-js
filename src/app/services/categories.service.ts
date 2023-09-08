import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private afs: AngularFirestore, private toastr: ToastrService) {}

  saveData(data: any) {
    this.afs
      .collection('categories')
      .add(data)
      .then((docRef) => {
        //console.log(docRef);
        this.toastr.success('Data inserted successfully');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  loadData(): Observable<any> {
    return this.afs
      .collection('categories')
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {
              id,
              data,
            };
          });
        })
      );
  }

  updateData(id: string, editedData: any) {
    this.afs
      .collection('categories')
      .doc(id)
      .update(editedData)
      .then((docRef) => {
        this.toastr.success('Data updated successfully');
      });

    // this.afs
    // .doc(`categoris/${id}`)
    // .update(editedData)
    // .then((docRef) => {
    //   this.toastr.success('Data updated successfully');
    // });
  }

  deleteData(id: string) {
    this.afs
      .collection('categories')
      .doc(id)
      .delete()
      .then((docRef) => {
        this.toastr.success('Data deleted successfully');
      });

    // this.afs
    // .doc(`categoris/${id}`)
    // .delete()
    // .then((docRef) => {
    //   this.toastr.success('Data deleted successfully');
    // });
  }
}
