import { LightningElement,track,wire } from 'lwc';
import getAccounts from "@salesforce/apex/AccountController.getAccounts";
import ACCOUNTLMC from "@salesforce/messageChannel/AccountMessageChannel__c";
import {publish, MessageContext} from 'lightning/messageService';

export default class PublisherLWC extends LightningElement {
    @track accountList;
    @wire(MessageContext)
    messageContext;
    connectedCallback(){
        getAccounts()
        .then(result=>{
            this.accountList = result;
        })
        .catch(error=>{
            console.log(error);
        })
    }
    handleClick(event){
        event.preventDefault();
        const payload ={
            AccountId: event.target.dataset.value,
            AdditionalInfo: 'This published from LWC'
        }
        publish(this.messageContext,ACCOUNTLMC,payload);
        console.log('event published');
    }
}