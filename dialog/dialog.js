import { LightningElement, api } from 'lwc';

export default class Dialog extends LightningElement {
    visible = false;

    @api header;



    get isHeaderEmpty() {
        return !this.header || /^\s*$/.test(this.header);
    }

    @api show() {
        this.visible = true;
    }

    onActionClicked() {
        this.visible = false;
        this.dispatchEvent(new CustomEvent('action'));
    }

    onCancelClicked() {
        this.visible = false;
    }
}