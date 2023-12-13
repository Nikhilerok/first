import { LightningElement, track, wire } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import ACCOUNTLMC from '@salesforce/messageChannel/AccountMessageChannel__c';

export default class SubscriberLWC extends LightningElement {
    @track accountId;
    @track additionalInfo;
    fields = ['Name', 'Phone', 'Industry','type'];

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    subscribeToMessageChannel() {
        subscribe(this.messageContext, ACCOUNTLMC, (message) => {
            this.handleMessage(message);
        });
    }

    handleMessage(message) {
        this.accountId = message.AccountId;
        this.additionalInfo = message.AdditionalInfo;
    }
}