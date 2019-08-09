import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Events, ModalController, ToastController } from 'ionic-angular';
import { Webservice } from "../../providers/webservice/webservice";
import 'rxjs/add/operator/map';
import { GenericDynamicListPage } from "../generic-dynamic-list/generic-dynamic-list";
import { NotificationDetailPage } from '../notification-detail/notification-detail';
import { BarcodeScannerOptions, BarcodeScanner } from "@ionic-native/barcode-scanner";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-attendance',
  templateUrl: 'attendance.html',
  providers: []
})
export class AttendancePage extends GenericDynamicListPage {

  protected list_now: any = [];
  protected qr_scanner_options: BarcodeScannerOptions;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ws: Webservice, public loadingCtrl: LoadingController, public alertCtrl: AlertController, protected events: Events, protected modalCtrl: ModalController, private toast: ToastController, private qr: BarcodeScanner, protected trans: TranslateService) {
    super(navCtrl, navParams, ws, loadingCtrl, alertCtrl, events);
    this.full_screen = false;
    this.list_searching = true;
    this.qr_scanner_options = {
      showTorchButton: true,
      showFlipCameraButton: true
    };    
  }

  ionViewDidLoad() {
    this.list_searching = true;
    this.initUpdates();
    super.ionViewDidLoad();
  }

  private initUpdates() {
    setInterval(() => {
      this.updateNowList();
      this.updateFutureList();
    }, 1000);
  }

  protected isHappeningNow(attendance: any) {
    var start = new Date(attendance.start_time);
    var end = new Date(attendance.end_time);
    var now = new Date();
    return (now >= start && now <= end);
  }

  protected moveToListNow(index) {
    var attendance = this.list[index];
    this.list.splice(index, 1);
    this.list_now.push(attendance);
    this.toastMessage(this.trans.instant("ATTENDANCE_NEW_SESSION"));
  }



  protected toastMessage(message: string) {
    this.toast.create({
      message: message,
      duration: 3000,
      position: 'top',
      showCloseButton: true
    }).present();
  }

  protected removeFromListNow(index) {
    this.list_now.splice(index, 1);
  }

  protected updateNowList() {
    this.list_now.forEach((element, index, list) => {
      if (!this.isHappeningNow(element)) {
        this.removeFromListNow(index);
      }
    });
  }

  protected updateFutureList() {
    this.list.forEach((element, index, list) => {
      if (this.isHappeningNow(element)) {
        this.moveToListNow(index);
      }
    });
  }

  protected getUpdatePromise(force_load: boolean = false): Promise<any> {
    return this.ws.userAttendanceNow(1, null, true)
      .then((data: any) => {
        this.list_now = data.data;
      })
      .then(() => this.ws.userAttendanceFuture(this.page, null, true));
  }

  protected getLoadMorePromise(): Promise<any> {
    return this.ws.userAttendanceFuture(this.page);
  }

  protected controlToIcon(control_name: string) {
    if (control_name == 'qr') {
      return 'qr-scanner';
    }
    if (control_name == 'geolocation') {
      return 'locate';
    }
    if (control_name == 'ip') {
      return 'wifi';
    }

    return 'lock';
  }

  open(attendance_event) {
    let profileModal = this.modalCtrl.create(NotificationDetailPage, { notification: attendance_event, type: 'attendance' });
    profileModal.present();
  }

  present(attendance_event) {
    this
      .createControlParameters(attendance_event)
      .then((parameters) => this.ws.userAttendanceChangeStatusPresent(attendance_event.id, parameters))
      .then(() => {
        attendance_event.status = 'p';
        this.toastMessage(this.trans.instant("ATTENDANCE_STATUS_PRESENT"));
      }).catch((error) => {
        console.log(error);
        this.toastMessage(this.trans.instant(error.error.message));
      });

  }

  protected createControlParameters(attendance_event): Promise<any> {
    for (let control of attendance_event.controls) {
      if (control == 'qr') {
        return this.controlQrParameter();
      }
    }

    return Promise.resolve({});
  }

  protected controlQrParameter(): Promise<any> {
    return this.qr.scan(this.qr_scanner_options).then(scanned => {
      console.log("Scaned: "+JSON.stringify(scanned));
      if (scanned.cancelled) {
        return Promise.reject();
      }

      return Promise.resolve({ 'code': scanned.text });
    }).catch(err => {
      this.toastMessage(this.trans.instant("ERROR_QR"));
      console.log('Error', err);
    });    
  }

}
