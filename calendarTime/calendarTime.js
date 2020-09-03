import { LightningElement, api } from 'lwc';

const timeFormat = { hour: '2-digit' };
const timeSelectorFormat = { hour: '2-digit', minute: '2-digit' };
const startingHour = 8;

export default class CalendarTime extends LightningElement {
    timeSlots = [];
    timeSlotDialogValue = '0';
    timeSlotDialogOptions = [];
    locked = false;

    connectedCallback() {
        this.onViewChanged();
    }

    onTimeSlotClicked(event) {
        var selectedHour = event.target.getAttribute("hour");
        this.timeSlotDialogOptions = [];
        var date = new Date(Date.UTC(2017, 0, 1));
        for (var i = 0; i < 4; i++) {
            date.setHours(selectedHour, i * 15, 0, 0);
            this.timeSlotDialogOptions.push({ label: date.toLocaleTimeString("en-US", timeSelectorFormat), value: (selectedHour * 60 + i * 15).toString() });
        }
        this.timeSlotDialogValue = this.timeSlotDialogOptions[0].value;


        var dialog = this.template.querySelector('c-dialog');
        dialog.show();
    }

    onDialogAction() {
        var dialogTimeSelector = this.template.querySelector('lightning-combobox');
        var startingTimeSlot = parseInt(dialogTimeSelector.value);
        var finishingTimeSlot = startingTimeSlot + 15;

        var elements = Array.from(this.template.querySelectorAll('div'));
        var selectedTimeSlotElements = elements.filter(div => div.getAttribute("timeslot") >= startingTimeSlot && div.getAttribute("timeslot") <= finishingTimeSlot);
        selectedTimeSlotElements.forEach(function(selectedTimeSlotElement) {
            selectedTimeSlotElement.setAttribute("style", "background: rgb(0,128,114, 0.2)");
        });

        console.log(Math.floor(startingTimeSlot / 60));
        var selectedTime = {
            hours: Math.floor(startingTimeSlot / 60),
            minutes: startingTimeSlot - Math.floor(startingTimeSlot / 60) * 60,
            duration: finishingTimeSlot - startingTimeSlot + 15
        }
        this.dispatchEvent(new CustomEvent('timeselected', { detail: selectedTime }));
    }

    onViewChanged() {
        var date = new Date(Date.UTC(2017, 0, 1));
        for (var i = 8; i < 20; i++) {
            date.setHours(i, 0, 0, 0);
            var tt = [];
            for (var j = 0; j < 4; j++) {
                tt.push(i * 60 + j * 15);
            }
            this.timeSlots.push({ label: date.toLocaleTimeString("en-US", timeFormat), value: i, test: tt });
        }
    }

    @api lock() {
        this.locked = true;
    }

    @api unlock() {
        this.locked = false;
    }

    @api add(timeItems) {
        var elements = Array.from(this.template.querySelectorAll('div'));
        timeItems.forEach(function(timeItem) {
            var startingTimeSlot = timeItem.hours * 60 + timeItem.minutes;
            var finishingTimeSlot = startingTimeSlot + 15;

            var selectedTimeSlotElements = elements.filter(div => div.getAttribute("timeslot") >= startingTimeSlot && div.getAttribute("timeslot") <= finishingTimeSlot);
            selectedTimeSlotElements.forEach(function(selectedTimeSlotElement) {
                selectedTimeSlotElement.setAttribute("style", "background: rgb(0, 128, 114, 0.2)");
            });
        });
    }

    @api remove(date) {
        var startingTimeSlot = date.getHours() * 60 + date.getMinutes();
        var finishingTimeSlot = startingTimeSlot + 15;

        var elements = Array.from(this.template.querySelectorAll('div'));
        var selectedTimeSlotElements = elements.filter(div => div.getAttribute("timeslot") >= startingTimeSlot && div.getAttribute("timeslot") <= finishingTimeSlot);
        selectedTimeSlotElements.forEach(function(selectedTimeSlotElement) {
            selectedTimeSlotElement.setAttribute("style", "background: rgb(250,128,114, 0.2)");
        });
    }

    @api removeAll() {
        var elements = Array.from(this.template.querySelectorAll('div'));
        var selectedTimeSlotElements = elements.filter(div => div.hasAttribute("timeslot"));
        selectedTimeSlotElements.forEach(function(selectedTimeSlotElement) {
            selectedTimeSlotElement.setAttribute("style", "background: rgb(250,128,114, 0.2)");
        });
    }
}