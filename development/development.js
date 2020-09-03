import { LightningElement, api } from 'lwc';

export default class App extends LightningElement {
    rendered = false;
    scheduledEvents = new Map();
    scheduledEventsThisSession = new Map();
    displayedScheduledEventsThisSession = [];

    renderedCallback() {
        if (this.rendered) {
            return;
        }

        this.rendered = true;
        var calendarTime = this.template.querySelector('c-calendar-time');
        calendarTime.lock();
    }

    onDateSelected(event) {
        var calendarTime = this.template.querySelector('c-calendar-time');
        if (!calendarTime) {
            return;
        }

        var selectedDate = event.detail;
        if (selectedDate) {
            calendarTime.unlock();
            calendarTime.removeAll();
            calendarTime.add(Array.from(this.getScheduledEvents(selectedDate).values()));
        } else {
            calendarTime.lock();
            calendarTime.removeAll();
        }
    }

    onTimeSelected(event) {
        var calendarDate = this.template.querySelector('c-calendar-date');
        var date = new Date(calendarDate.date.getTime());
        date.setHours(event.detail.hours, event.detail.minutes, 0, 0);

        this.scheduledEventsThisSession.set(date + '  ' + date.toLocaleTimeString("en-US") + ' Duration: ' + event.detail.duration, { date: date, duration: event.detail.duration});
        this.displayedScheduledEventsThisSession = Array.from(this.scheduledEventsThisSession.keys());
        this.addScheduledEvent(calendarDate.date, event.detail);
    }

    onSelectedTimeRemoved(event) {
        var removedEvent = this.scheduledEventsThisSession.get(event.target.label);
        this.scheduledEventsThisSession.delete(event.target.label);
        this.displayedScheduledEventsThisSession = Array.from(this.scheduledEventsThisSession.keys());

        var calendarDate = this.template.querySelector('c-calendar-date');
        var selectedDate = calendarDate.date;
        if (selectedDate && selectedDate.getYear() == removedEvent.date.getYear() && selectedDate.getMonth() == removedEvent.date.getMonth() && selectedDate.getDay() == removedEvent.date.getDay()) {
            var calendarTime = this.template.querySelector('c-calendar-time');
            calendarTime.remove(removedEvent.date);
        }
        this.removeScheduledEvent(removedEvent.date, { hours: removedEvent.date.getHours(), minutes: removedEvent.date.getMinutes() })
    }

    @api getSelectedScheduledEvents() {
        var selectedScheduledEvents = [];
        this.scheduledEventsThisSession.forEach(function(value) {
            selectedScheduledEvents.push(value);
        });
        return selectedScheduledEvents;
    }

    //
    // Utils
    //

    getScheduledEvents(date) {
        var dateId = date.toLocaleDateString('en-US');
        if (!this.scheduledEvents.has(dateId)) {
            return new Map();
        }
        return this.scheduledEvents.get(dateId);
    }
 
    addScheduledEvent(date, eventDetails) {
        var dateId = date.toLocaleDateString('en-US');
        if (!this.scheduledEvents.has(dateId)) {
            this.scheduledEvents.set(dateId, new Map());
        }
        var eventId = '' + eventDetails.hours + eventDetails.minutes;
        this.scheduledEvents.get(dateId).set(eventId, eventDetails);
    }

    removeScheduledEvent(date, eventDetails) {
        var dateId = date.toLocaleDateString('en-US');
        if (this.scheduledEvents.has(dateId)) {
            var eventId = '' + eventDetails.hours + eventDetails.minutes;
            this.scheduledEvents.get(dateId).delete(eventId);
        }
    }
}