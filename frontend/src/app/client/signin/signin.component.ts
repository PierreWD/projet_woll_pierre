import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup,FormBuilder,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpServiceService } from '../../_Services/http-service.service';
import { LogServiceService }from '../../_Services/log-service.service';
import { Api_httpInterceptor } from '../../_Classe/Api_httpInterceptor';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  FormIdentification: FormGroup;
  constructor(private formBuilder: FormBuilder,private httpService: HttpServiceService,private router: Router,public logServiceService:LogServiceService) {
    this.FormIdentification = this.formBuilder.group({
      Login: ['',Validators.required],
      Password: ['',Validators.required],
    });
  }

  ngOnInit(): void {
  }

  login(){
    this.httpService.login(this.FormIdentification.value.Login,this.FormIdentification.value.Password).subscribe(
      data=>{
        console.log(data);
        this.logServiceService.setCurrentClient(this.FormIdentification.value.Login,this.FormIdentification.value.Password,data.nom,data.prenom);
        Api_httpInterceptor.jwtToken=data.jwt;
      }
    )
  }

  submit () {
    console.log(this.FormIdentification.value.Login);
    console.log(this.FormIdentification.value.Password);
    var a=false;
    this.httpService.getClient().then((data:any)=>{
      data.map((d:any)=>{
        if(d.login==this.FormIdentification.value.Login && d.mdp==this.FormIdentification.value.Password){
          a=true;
          this.logServiceService.setCurrentClient(d.login,d.mdp,d.Nom,d.Prenom);
          this.router.navigate(["client/compte"]);
        }
      })
    }).then(()=>{        
      if(a==false){
        alert("identifiants incorrects");    
      }         
    }) 
  }
}
