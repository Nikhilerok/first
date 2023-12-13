import { LightningElement, wire } from 'lwc';
import getPrimaryAccountContacts from '@salesforce/apex/wrapperclass.getPrimaryAccountContacts';

const columns = [
    { 
        label : 'Account Name',
        fieldName : 'AccountLink',
        type : 'url',
        typeAttributes :{
            label : {
                fieldName : 'accountName'
            },
            target : '_blank'
        }
    },
    {
         label: 'Primary Contact',
          fieldName: 'primaryContactName'
     },
     {
         label: 'Birthdate',
         fieldName: 'birthdatee',
         type: 'date'
     },
     {
         label: 'Phone',
         fieldName: 'phone',
         type: 'phone'
     }
];

export default class Wrapper_component extends LightningElement {
    columns = columns;
    wrappers = [];

    @wire(getPrimaryAccountContacts)
    wiredWrappers({ error, data }) {
        if (data) {
            this.wrappers = data.map(wrapper => {
                return {
                    id: wrapper.accountId,
                    accountName: wrapper.accountName,
                    primaryContactName: wrapper.primaryContactName,
                    AccountLink: wrapper.AccountLink,
                    birthdatee: wrapper.birthdatee,
                    phone: wrapper.phone
                };
            });
        } else if (error) {
            console.error(error);
        }
    }
}