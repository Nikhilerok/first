import { LightningElement, wire, api } from 'lwc';
import getSentEmails from '@salesforce/apex/emails.getSentEmails';

const COLUMNS = [
    { label: 'Subject', fieldName: 'subject', type: 'text' },
    { label: 'Created Date', fieldName: 'createdDate', type: 'date' },
    { label: 'Related To', fieldName: 'relatedTo', type: 'text' },
];

export default class DisplayEmails extends LightningElement {
    @api recordId; // Account Id passed from the record page
    emailList = [];
    columns = COLUMNS;

    @wire(getSentEmails, { accountId: '$recordId' })
    wiredEmails({ error, data }) {
        if (data) {
            this.emailList = data;
        } else if (error) {
            // Handle error
        }
    }
}