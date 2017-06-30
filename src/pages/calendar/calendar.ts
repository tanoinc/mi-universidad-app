import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Events } from 'ionic-angular';
import { Webservice } from "../../providers/webservice/webservice";
import { GenericPage } from "../generic/generic";

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
  eventSource;
  viewTitle;
  isToday: boolean;
  calendar = {
    mode: 'month',
    currentDate: new Date(),
    queryMode: 'remote'
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public ws: Webservice, public loadingCtrl: LoadingController, public alertCtrl: AlertController, protected events: Events) {
    super(navCtrl, navParams, ws, loadingCtrl, alertCtrl, events);
  }

  doRefresh(refresher) {
    this.loadCalendar()
      .then(() => {
        refresher.complete();
      }).catch((error) => {
        refresher.complete();
      });
  }

  setEventSource(ws_events) {
    this.eventSource = ws_events;
  }

  calendarError(error) {
    this.showAlert('Error', 'No pudo cargarse el calendario: ' + error.message);
  }

  loadCalendar(show_loader: boolean = true) {
    if (show_loader) {
      this.showLoader('Cargando');
    }
    return this
      .loadFromWs(this.current_start_date, this.current_end_date)
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
    return { name: name, start_date: start, end_date: end, is_all_day: is_all_day };
  }

  loadFromWs(start: Date, end: Date): Promise<any> {
    return this.ws.userCalendarEventsBetweenDates(start, end).then((ws_events: any) => {
      let events: Array<any> = [];
      if (ws_events.data.length > 0) {
        events = ws_events.data.map((ws_event) => {
          let calendar_dates = this.wsEventToCalendar(ws_event);
          return {
            title: calendar_dates.name,
            startTime: calendar_dates.start_date,
            endTime: calendar_dates.end_date,
            allDay: calendar_dates.is_all_day
          };
        });
      }
      return Promise.resolve(events);
    });
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }
  onEventSelected(event) {
    console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
  }

  today() {
    this.calendar.currentDate = new Date();
  }
  onTimeSelected(ev) {
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
    this.loadCalendar();
    console.log('range changed: startTime: ' + ev.startTime + ', endTime: ' + ev.endTime);
  }
  markDisabled(date: Date) {
    var current = new Date();
    current.setHours(0, 0, 0);
    return date < current;
  };

}