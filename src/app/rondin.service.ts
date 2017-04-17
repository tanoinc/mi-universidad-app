import { Injectable } from "@angular/core";
//import { Observable } from "rxjs/Observable";
import { Http , Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
@Injectable()
export class RondinService {
        datosMapa: any;
    
constructor(private http: Http){

}


 getDatosMapaJson() { 
    console.log("...getDatosMapaJson...");
    return this.http.get("assets/data/locations.json")
            .map((res: Response) => res.json() )
            .map( res => {
                this.datosMapa = res; 
                return this.datosMapa },
    );
 
}


 getDatosMapa() {
        return this.datosMapa;

    }
}