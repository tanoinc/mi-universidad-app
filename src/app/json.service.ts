import { Injectable } from "@angular/core";
//import { Observable } from "rxjs/Observable";
import { Http , Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
@Injectable()
export class JsonService {
        private datos: any;
    
constructor(private http: Http){

}


 getDatosMapaJson(url: string) {
    console.log("...getDatosMapaJson...");
    return this.http.get(url)
            .map((res: Response) => res.json() )
            .map( res => {
                this.datos = res; 
                return this.datos },
    );
 
}


 getDatos() {
        return this.datos;
    }

  setDatos(datos) {
        this.datos= datos;
    }  
}