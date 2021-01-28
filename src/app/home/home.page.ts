import { Component } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { AngularFirestore} from '@angular/fire/firestore';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  posts: any;
  constructor(
    private toastCtrl:ToastController,
    private loadingCtrl: LoadingController,
    private firestore: AngularFirestore
  ) {}

    ionViewWillEnter() {
      this.getPosts();
    }

    async getPosts(){
      
        let loader = await this.loadingCtrl.create({
          message: "Espere um pouco"
        });
        loader.present();

      try{ 
        this.firestore
        .collection("posts")
        .snapshotChanges()
        .subscribe(data => { console 
        this.posts = data.map(e => {
          return {
            id: e.payload.doc.id,
            title: e.payload.doc.data()["title"],
            details: e.payload.doc.data()["details"]
          };
        });
        loader.dismiss(); 
      });
      
      } catch(e){
        this.showToast(e);
      }
    }

    async deletePost(id: string){
      let loader = this.loadingCtrl.create({
        message: "Espere um pouco"
      });
      (await loader).present();

      await this.firestore.doc("posts/"+ id).delete();

      (await loader).dismiss(); 
    }

    showToast(message: string){
      this.toastCtrl
      .create({
        message:message,
        duration:3000
      })
      .then(toastData => toastData.present());
  
    }


}
