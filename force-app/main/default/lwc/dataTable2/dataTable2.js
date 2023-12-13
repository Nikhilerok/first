import { LightningElement, api } from 'lwc';

export default class Datatable2 extends LightningElement {
    @api disablePrevious;
    @api disableNext;

    handlePrevious() {
        // Logic to handle previous page
        this.dispatchEvent(new CustomEvent('previous'));
    }

    handleNext() {
        // Logic to handle next page
        this.dispatchEvent(new CustomEvent('next'));
    }
}