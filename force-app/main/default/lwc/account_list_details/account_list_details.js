import { LightningElement, track } from 'lwc';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import INDUSTRY from '@salesforce/schema/Account.Industry';
import PHONE from '@salesforce/schema/Account.Phone';

export default class Account_list_details extends LightningElement {
    fields = [NAME_FIELD, INDUSTRY, PHONE];
    @track accountId;
    @track message = 'Drop an account  record here';

    dropElement(event) {
        this.accountId = event.dataTransfer.getData("account_id");
        this.message = '';
    }

    allowDrop(event) {
        event.preventDefault();
    }
}