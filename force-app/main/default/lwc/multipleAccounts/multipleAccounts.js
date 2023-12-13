// multipleAccounts.js


import { LightningElement, track, api } from 'lwc';
import createOrUpdateAccount from '@salesforce/apex/AccountController.createOrUpdateAccount';
import retrieveMatchingAccounts from '@salesforce/apex/AccountController.retrieveMatchingAccounts';
import retrieveAccountDetails from '@salesforce/apex/AccountController.retrieveAccountDetails';
import createAccount from '@salesforce/apex/AccountController.createAccount'; 
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class MultipleAccounts extends LightningElement {
    @api recordId;
    @track keyIndex = 0;
    @track error;
    @track message;
    @track accountSearchTerm = '';
    @track matchingAccounts;
    selectedAccountId = null;
    selectedAccountIndex = null;
    allowSearchAndAdd = true; 

    @track accountRecList = [
        {
            keyIndex: 0,
            Name: '',
            Industry: '',
            Phone: '',
            matchingAccounts: null 
        }
    ];

    // to add New account fields
    newAccount = {
        Name: '',
        Industry: '',
        Phone: ''
    };

    handleNameChange(event) {
        const index = event.target.accessKey;
        this.accountRecList[index].Name = event.target.value;
    }

    handleIndustryChange(event) {
        const index = event.target.accessKey;
        this.accountRecList[index].Industry = event.target.value;
    }

    handlePhoneChange(event) {
        const index = event.target.accessKey;
        this.accountRecList[index].Phone = event.target.value;
    }

    handleAccountSearch(event) {
        const inputValue = event.target.value;
        const rowIndex = event.target.closest('tr').dataset.index;

        // Check if search is allowed
        if (this.allowSearchAndAdd) {
            if (inputValue) {
                retrieveMatchingAccounts({ searchTerm: inputValue })
                    .then(result => {
                        this.accountRecList[rowIndex].matchingAccounts = result;
                    })
                    .catch(error => {
                        console.error('Error retrieving matching accounts:', error);
                    });
            } else {
                this.accountRecList[rowIndex].matchingAccounts = null;
            }
        }
    }



    handleAccountSearchAndEdit(event) {
        const inputValue = event.target.value;
        const rowIndex = event.target.closest('tr').dataset.index;
    
        if (this.allowSearchAndAdd) {
            if (inputValue) {
                // Search for matching accounts
                retrieveMatchingAccounts({ searchTerm: inputValue })
                    .then(result => {
                        this.accountRecList[rowIndex].matchingAccounts = result;
                    })
                    .catch(error => {
                        console.error('Error retrieving matching accounts:', error);
                    });
            } else {
                this.accountRecList[rowIndex].matchingAccounts = null;
            }
        }
    
        // Update the account name  
        this.accountRecList[rowIndex].Name = inputValue;
    }

    
    handleAccountSelection(event) {
        event.preventDefault();
        this.selectedAccountId = event.target.dataset.accountid;
        this.selectedAccountIndex = event.target.closest('tr').dataset.index;

        if (this.selectedAccountId) {
            retrieveAccountDetails({ accountId: this.selectedAccountId })
                .then(account => {
                    if (account) {
                        this.accountRecList[this.selectedAccountIndex] = {
                            ...this.accountRecList[this.selectedAccountIndex], // Preserve existing fields
                            recordId: account.Id, // Set the Id of the existing record
                            Name: account.Name,
                            Industry: account.Industry,
                            Phone: account.Phone,
                        };

                        this.accountRecList[this.selectedAccountIndex].matchingAccounts = null;
                    }
                })
                .catch(error => {
                    console.error('Error retrieving account details:', error);
                });
        }
    }

    // Updated saveMultipleAccounts method
    saveMultipleAccounts() {
        const accountList = this.accountRecList
            .filter(account => account.Name) // Filter out accounts without a Name
            .map(account => ({
                Id: account.recordId || null, 
                Name: account.Name,
                Industry: account.Industry,
                Phone: account.Phone,
            }));

        createOrUpdateAccount({ accList: accountList })
            .then(result => {
                this.message = result;
                this.error = undefined;
                const successMessages = [];
                result.forEach(account => {
                    // Build the success message with account name and record ID
                    const successMessage = `Account Name: ${account.Name}, Record ID: ${account.Id}`;
                    successMessages.push(successMessage);
                });

                // combine the success messages with a separator
                const combinedMessages = successMessages.join(' || ');

                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success Accounts Created/Updated',
                        message: combinedMessages,
                        variant: 'success',
                    }),
                );

                this.accountRecList.forEach(item => {
                     // Reset the recordId for new records afters saving
                    item.recordId = '';
                    item.Name = '';
                    item.Industry = '';
                    item.Phone = '';
                });
            })
            .catch(error => {
                this.message = undefined;
                this.error = error;

                if (error && error.body && error.body.message) {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error creating/updating records',
                            message: error.body.message,
                            variant: 'error',
                        }),
                    );
                } else {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Unknown Error',
                            message: 'An unknown error occurred while creating/updating records.',
                            variant: 'error',
                        }),
                    );
                }
            });
    }

    addRow() {
        if (this.allowSearchAndAdd) {
            this.keyIndex += 1;
            this.accountRecList.push({
                keyIndex: this.keyIndex,
                Name: '',
                Industry: '',
                Phone: '',
                matchingAccounts: null,
            });
        }
    }

    removeRow(event) {
        if (this.accountRecList.length >= 1) {
            this.accountRecList.splice(event.target.accessKey, 1);
            this.keyIndex--;
        }
    }

    // Handle changes in new account fields
    handleNewAccountName(event) {
        this.newAccount.Name = event.target.value;
    }

    handleNewAccountIndustry(event) {
        this.newAccount.Industry = event.target.value;
    }

    handleNewAccountPhone(event) {
        this.newAccount.Phone = event.target.value;
    }

    // Create a new account
    createNewAccount() {
        // Check if required fields are empty
        if (!this.newAccount.Name || !this.newAccount.Industry || !this.newAccount.Phone) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Please fill in all required fields for the new account.',
                    variant: 'error'
                })
            );
            return;
        }

        // Send the request to create a new account
        createAccount({ acc: this.newAccount })
            .then(result => {
                this.message = result;
                this.error = undefined;
                this.newAccount = { Name: '', Industry: '', Phone: '' }; // Reset new account fields

                // Display success message
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'New Account Created!',
                        variant: 'success',
                    })
                );

            })
            .catch(error => {
                this.message = undefined;
                this.error = error;
            });
    }
}