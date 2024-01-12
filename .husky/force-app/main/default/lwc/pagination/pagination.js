// paginationComponent.js
import { LightningElement, api } from 'lwc';

export default class PaginationComponent extends LightningElement {
    @api pageNumber;
    @api totalPages;
    @api totalRecords;
    @api disableFirst;
    @api disableLast;

    handlePrevious() {
        this.dispatchEvent(new CustomEvent('previous'));
    }

    handleNext() {
        this.dispatchEvent(new CustomEvent('next'));
    }
}