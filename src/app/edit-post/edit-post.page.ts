import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Post } from '../models/post.model';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.page.html',
  styleUrls: ['./edit-post.page.scss'],
})
export class EditPostPage implements OnInit {
post = {} as Post;
id: any;
  
constructor(
    private actRoute: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private firestore: AngularFirestore,
    private toastCtrl: ToastController,
    private navCtrl: NavController
    
    ){
    this.id = this.actRoute.snapshot.paramMap.get("id");
   }

  ngOnInit() {
    this.getPostById(this.id);
  }

  async getPostById(id: string){
    
    let loader = this.loadingCtrl.create({
      message: "Espere um pouco"
    });
    (await loader).present();

    this.firestore
    .doc("posts/" + id)
    .valueChanges()
    .subscribe(data =>{ 
      this.post.title = data["title"];
      this.post.details = data["details"];
    });

    (await loader).dismiss(); 

  }

  async updatePost(post: Post){
    if(this.formValidation()){
      
      let loader = this.loadingCtrl.create({
        message: "Espere um pouco"
      });
    (await loader).present();
    
    try { 
      await this.firestore.doc("posts/"+this.id).update(post); 

    } catch(e){
      this.showToast(e);
    }

    (await loader).dismiss();

    this.navCtrl.navigateRoot("home");
    }
  }

  formValidation(){
    if(!this.post.title){
      this.showToast("Novo titulo");
      return false;
    }
    if(!this.post.details){
      this.showToast("Novo detelhe");
      return false;
    }
    return true;
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
