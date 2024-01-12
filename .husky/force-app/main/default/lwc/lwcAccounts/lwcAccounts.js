import { LightningElement, wire, track } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import SEARCH_MESSAGE_CHANNEL from '@salesforce/messageChannel/SearchMessagingChannel__c'; // Replace with your message channel's API name

import getAccounts from '@salesforce/apex/AccountController.getAccounts';

export default class LwcAccounts extends LightningElement {
    @track accounts;
    @track accountidfrmparent;
    
    @wire(MessageContext)
    messageContext;

    @wire(getAccounts)
    wiredAccounts(data) {
            this.accounts = data;
            console.log('Accounts:', this.accounts); // Add this line
        }
    
    

    handleClick(event) {
        event.preventDefault();
        this.accountidfrmparent = event.target.dataset.accountid;
        this.publishAccountId();
    }

    publishAccountId() {
        const payload = { accountId: this.accountidfrmparent };
        publish(this.messageContext, SEARCH_MESSAGE_CHANNEL, payload);
    }
}