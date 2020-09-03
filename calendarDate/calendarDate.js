import { LightningElement, api } from 'lwc';

export default class CalendarDate extends LightningElement {
    selectedDay;
    currentMonth;
    currentMonthTitle;
    weekDays = [];
    dayMatrix = [];

    @api date;

    connectedCallback() {
        var sundayDate = new Date(Date.UTC(2017, 0, 1));
        for (var i = 0; i < 7; i++) {       
            this.weekDays.push(sundayDate.toLocaleDateString("en-US", { weekday: 'short' }));
            sundayDate.setDate(sundayDate.getDate() + 1);       
        }

        this.currentMonth = new Date();
        this.currentMonth.setDate(1);
        this.onViewChanged();
    }

    onDayClicked(event) {
        if (!event.target.innerText) {
            return;
        }
        if (this.selectedDay == event.target) {
            return;
        }

        this.clearSelected();
        this.selectedDay = event.target;
        this.selectedDay.classList.add("selected");
        this.selectedDay.classList.remove("clickable");
        this.date = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), parseInt(this.selectedDay.innerText));
        this.dispatchEvent(new CustomEvent('dateselected', { detail: this.date }));
    }

    clearSelected() {
        if (this.selectedDay) {
            this.selectedDay.classList.remove("selected");
            this.selectedDay.classList.add("clickable");
            this.selectedDay = null;
            this.date = "";
        }
    }

    onPreviousMonthClicked(event) {
        this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
        this.onViewChanged();
    }

    onNextMonthClicked(event) {
        this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
        this.onViewChanged();
    }

    onViewChanged() {
        this.dayMatrix = [];
        this.currentMonthTitle = this.currentMonth.toLocaleDateString("en-US", { month: 'long', year: 'numeric' });

        var today = new Date();
        var mMonthFirstDayDayOfWeek = this.currentMonth.getDay();
        var monthLength = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0).getDate();

        var day = 1;
        var week = 0;
        while (day <= monthLength) {
            this.dayMatrix.push({ "id" : week, "days" : [] });
            for (var dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
                if (week == 0 && day == 1 && dayOfWeek != mMonthFirstDayDayOfWeek) {
                    this.dayMatrix[week].days.push({"id": dayOfWeek, "value": 0});
                } else if (day > monthLength) {
                    this.dayMatrix[week].days.push({"id": dayOfWeek, "value": 0});
                } else {
                    this.dayMatrix[week].days.push({"id": dayOfWeek, "value": day++});
                }
            }
            week++;
        }
  
        this.clearSelected();
        this.dispatchEvent(new CustomEvent('dateselected', { detail: "" }));
    }
}
