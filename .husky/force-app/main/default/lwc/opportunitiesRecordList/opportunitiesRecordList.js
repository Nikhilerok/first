import { LightningElement,api,wire } from 'lwc';
import accountopportunities from '@salesforce/apex/opportunitiescontroller.accountopportunities';

export default class OpportunitiesRecordList extends LightningElement {
    columns =  [
        { label: 'Opportunity Name', fieldName: 'Name' },
        { label: 'CloseDate', fieldName: 'CloseDate', type: 'date' },  

         
    ];

     @api accountId;
    @wire(accountopportunities,{accountId:'$accountId'}) Opportunity;   
}