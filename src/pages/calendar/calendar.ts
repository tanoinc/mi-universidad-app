import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Events } from 'ionic-angular';
import { Webservice } from "../../providers/webservice/webservice";
import { GenericPage } from "../generic/generic";
import { ActionSheetController } from 'ionic-angular';
import { Calendar } from "@ionic-native/calendar";
import { ToastController } from 'ionic-angular';

/*
  Generated class for the Calendar page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html'
})
export class CalendarPage extends GenericPage {
  current_start_date: Date;
  current_end_date: Date;
  title_date: Date;
  event_source;
  view_title;
  isToday: boolean;
  calendar = {
    mode: 'month',
    currentDate: new Date(),
    queryMode: 'remote'
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public ws: Webservice, public loadingCtrl: LoadingController, public alertCtrl: AlertController, protected events: Events, public action_sheet: ActionSheetController, public device_calendar: Calendar, protected toastCtrl: ToastController) {
    super(navCtrl, navParams, ws, loadingCtrl, alertCtrl, events);
  }

  doRefresh(refresher) {
    this.loadCalendar(true, true)
      .then(() => {
        refresher.complete();
      }).catch((error) => {
        refresher.complete();
      });
  }

  setEventSource(ws_events) {
    this.event_source = ws_events;
  }

  calendarError(error) {
    this.showAlert('Error', 'No pudo cargarse el calendario: ' + error.message);
  }

  loadCalendar(show_loader: boolean = true, force_reload: boolean = false) {
    if (show_loader) {
      this.showLoader('Cargando');
    }
    return this
      .loadFromWs(this.current_start_date, this.current_end_date, force_reload)
      .then((ws_events) => this.setEventSource(ws_events))
      .then(() => {
        if (show_loader) {
          this.loading.dismiss();
        }
      })
      .catch((error) => this.calendarError(error));
  }

  protected wsEventToCalendar(ws_event) {
    let start = new Date(ws_event.event_date);
    let end = new Date(ws_event.event_date);
    let s_time = ws_event.event_duration.split(":");
    let is_all_day = false;
    end.setHours(start.getHours() + parseInt(s_time[0]));
    end.setMinutes(start.getMinutes() + parseInt(s_time[1]));
    end.setSeconds(start.getSeconds() + parseInt(s_time[2]));
    if (start.getHours() == 0 && start.getMinutes() == 0 && start.getSeconds() == 0 && ws_event.event_duration == "24:00:00") {
      is_all_day = true;
    }
    let name = ws_event.event_name + " (" + ws_event.application_description + ")";
    if (ws_event.context_id) {
      name = ws_event.context_description + ": " + name;
    }
    return { name: name, start_date: start, end_date: end, is_all_day: is_all_day, description: ws_event.description, location: ws_event.location };
  }

  loadFromWs(start: Date, end: Date, force_reload: boolean = false): Promise<any> {
    return this.ws.userCalendarEventsBetweenDates(start, end, null, force_reload).then((ws_events: any) => {
      let events: Array<any> = [];
      if (ws_events.data.length > 0) {
        events = ws_events.data.map((ws_event) => {
          let calendar_dates = this.wsEventToCalendar(ws_event);
          return {
            title: calendar_dates.name,
            startTime: calendar_dates.start_date,
            endTime: calendar_dates.end_date,
            allDay: calendar_dates.is_all_day,
            location: calendar_dates.location,
            description: calendar_dates.description,
          };
        });
      }
      return Promise.resolve(events);
    });
  }

  protected addEvent(title, location, notes, start_date, end_date) {
    let saved_event = this.device_calendar.createEvent(title, location, notes, start_date, end_date);
    this.toast('Evento guardado!');
    return saved_event;
  }

  protected toast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  saveEvent(event) {
    console.log('Saving event...');
    this.device_calendar.hasReadWritePermission().then((result) => {
      if (result === false) {
        this.device_calendar.requestReadWritePermission().then((v) => {
          this.addEvent(event.title, event.location, event.description, event.startTime, event.endTime);
        }, (r) => {
          console.log("Rejected");
        })
      }
      else {
        this.addEvent(event.title, event.location, event.description, event.startTime, event.endTime);
      }
    });
  }

  presentActionSheet(event) {
    let sheet = this.action_sheet.create({
      title: event.title,
      buttons: [
        {
          text: 'Guardar',
          handler: () => {
            this.saveEvent(event);
          }
        }, {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {

          }
        }
      ]
    });
    sheet.present();
  }

  onViewTitleChanged(title) {
    this.view_title = title;
  }
  onEventSelected(event) {
    console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
    this.presentActionSheet(event);
  }

  today() {
    this.calendar.currentDate = new Date();
  }
  onTimeSelected(ev) {
    this.title_date = ev.selectedTime;
    console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' +
      (ev.events !== undefined && ev.events.length !== 0) + ', disabled: ' + ev.disabled);
  }
  onCurrentDateChanged(event: Date) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    event.setHours(0, 0, 0, 0);
    this.isToday = today.getTime() === event.getTime();
  }
  onRangeChanged(ev) {
    this.current_start_date = ev.startTime;
    this.current_end_date = ev.endTime;
    if (this.calendar.mode == "month") {

    }
    this.loadCalendar();
    console.log('range changed: startTime: ' + ev.startTime + ', endTime: ' + ev.endTime);
  }
  markDisabled(date: Date) {
    var current = new Date();
    current.setHours(0, 0, 0);
    return date < current;
  };

}
