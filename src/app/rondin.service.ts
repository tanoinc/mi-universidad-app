import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Headers, Http , Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class RondinService {
        coordenadas: any;
    
constructor(private http: Http){

}


 getCoordenadasJson() {
    console.log("...getCoordenadasJson...");
    return this.http.get("./locations.json")
            .map((res: Response) => res.json() )
            .map( res => {
                this.coordenadas = res; 
                return this.coordenadas },
    )
}


  /*getCoordenadasJsonPromise() : Promise<LatLng[]> {
    console.log("...getCoordenadasJson...");
    return this.jsonp
            .get("app/locations.json")
            .toPromise()
               .then(response => response.json().data as LatLng[])
               .catch(this.handleError);
               
    }*/




    getCoordenadas() {
        return this.coordenadas;

    }
}