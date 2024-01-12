import { LightningElement, api, wire } from 'lwc';
import getContactsByAccountId from '@salesforce/apex/AccountController.getContactsByAccountId';

const COLUMNS = [
    { label: 'Name', fieldName: 'Name', type: 'text' },
    { label: 'Email', fieldName: 'Email', type: 'email' },
];

export default class Contacts_tables extends LightningElement {
    @api accountid;

    @wire(getContactsByAccountId, { accountId: '$accountid' })
    contacts;

    columns = COLUMNS;
}