import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class Quickaction extends NavigationMixin(LightningElement) {
    @api recordId;
    @api objectApiName;
    @track showStep1 = true;
    @track showStep2 = false;
    @track showContactFields = false;
    @track showStep3 = false;
    @track showOpportunityFields = false;

    accountId;
    accountName; //Account Name for   Step 2

    handleStep1Success(event) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Account Details Updated!',
                variant: 'success'
            })
        );

        // for Account Id and Name in Step 2
        this.accountId = event.detail.id;
        this.accountName = event.detail.fields.Name.value;

        // Proceed to Step 2: Contact 
        this.showStep1 = false;
        this.showStep2 = true;
        this.showContactFields = true;
    }

    handleStep2Success() {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Contact Record Created!',
                variant: 'success'
            })
        );

        // Proceed to Step 3: Opportunity 
        this.showStep2 = false;
        this.showStep3 = true;
        this.showOpportunityFields = true;
    }

    handleStep3Success() {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Opportunity Record Created!',
                variant: 'success'
            })
        );
        // Navigate back to the original Account record page
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.recordId,
                objectApiName: 'Account',
                actionName: 'view'
            }
        });
    }

    handleNext() {
        // Save the Account record
        const recordEditForm = this.template.querySelector('lightning-record-edit-form');
        recordEditForm.submit();
    }

    handleNextToOpportunity() {
        // Save the Contact record 
        const contactEditForm = this.template.querySelector('.contact-form');
        contactEditForm.submit();
    }

    handlePrevious() {
        // Go back to Step 1: Account details first ptrevious
        this.showStep1 = true;
        this.showStep2 = false;
        this.showContactFields = false;
    }

    handlePreviousFromOpportunity() {
        // Go back to Step 2: Contact creation second previous
        this.showStep2 = true;
        this.showStep3 = false;
        this.showOpportunityFields = false;
    }

    handleSaveOpportunity() {
        const opportunityEditForm = this.template.querySelector('.Opportunity-form');
        opportunityEditForm.submit();
    }
}