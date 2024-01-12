import { LightningElement, api, wire, track } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import SEARCH_MESSAGE_CHANNEL from '@salesforce/messageChannel/SearchMessagingChannel__c'; // Replace with your message channel's API name

export default class LwcAccountsPubSub extends LightningElement {
    @track fields = ['Name', 'Industry', 'Phone'];
    @api accountId;

    @wire(MessageContext)
    messageContext;

    subscription;

    connectedCallback() {
        this.subscribeToChannel();
    }

    subscribeToChannel() {
        this.subscription = subscribe(
            this.messageContext,
            SEARCH_MESSAGE_CHANNEL,
            (message) => this.handleMessage(message)
        );
    }

    handleMessage(message) {
        this._accountId = message.accountId; // Update the private property
    }
}