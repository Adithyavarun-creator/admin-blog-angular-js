import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Post } from '../models/post';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor(
    private storage: AngularFireStorage,
    private afs: AngularFirestore,
    private toast: ToastrService,
    private router: Router
  ) {}

  uploadImage(
    selectedImage: any,
    postData: Post,
    formStatus: string,
    id: string
  ) {
    const filePath = `postIMG/${Date.now()}`;
    //console.log(filePath);
    this.storage.upload(filePath, selectedImage).then(() => {
      //console.log('post image uploaded');
      this.storage
        .ref(filePath)
        .getDownloadURL()
        .subscribe((URL) => {
          //console.log(URL);
          postData.postImgPath = URL;
          if (formStatus === 'Edit') {
            this.updateData(id, postData);
          } else {
            this.saveData(postData);
          }
        });
    });
  }

  saveData(postData: Post) {
    this.afs
      .collection('posts')
      .add(postData)
      .then((docRef) => {
        this.toast.success('Data inserted successfully');
        this.router.navigate(['/posts']);
      });
  }

  loadData() {
    return this.afs
      .collection('posts')
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, data };
          });
        })
      );
  }

  loadOneData(id: string) {
    return this.afs.collection('posts').doc(id).valueChanges();
  }

  updateData(id: string, postData: Post) {
    this.afs
      .doc(`posts/${id}`)
      .update(postData)
      .then(() => {
        this.toast.success('Data updated successfully');
        this.router.navigate(['/posts']);
      });
  }

  deleteImage(postImgPath: any, id: string) {
    this.storage.storage
      .refFromURL(postImgPath)
      .delete()
      .then(() => {
        this.deleteData(id);
      });
  }

  deleteData(id: string) {
    this.afs
      .doc(`posts/${id}`)
      .delete()
      .then(() => {
        this.toast.warning('Data deleted...');
      });
  }

  markFeatured(id: string, featuredData: any) {
    this.afs
      .doc(`/posts/${id}`)
      .update(featuredData)
      .then(() => {
        this.toast.info('Featured status is updated');
      });
  }
}
