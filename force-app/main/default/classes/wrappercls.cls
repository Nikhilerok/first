public with sharing class wrappercls {

    @AuraEnabled(cacheable=true)
    public static List<AccountContactWrapperClass> fetchAccountContactDetails(){
        List<AccountContactWrapperClass> lstAccountContWrapper = new List<AccountContactWrapperClass>();
        for(Account acc : [select id,name,billingAddress,type,BillingCity,BillingCountry,BillingStreet, (select id, Name from Contacts) from 
                            Account where Name !=null LIMIT 10]){
            List<Contact> contacts = acc.Contacts;
            List<String> contactNames = new List<String>();
            for (Contact con : contacts) {
                contactNames.add(con.Name);
            }
            lstAccountContWrapper.add(new AccountContactWrapperClass(acc, contactNames));
        }
        return lstAccountContWrapper;
    }
    
    public class AccountContactWrapperClass{
        @AuraEnabled
        public Account acc;
        @AuraEnabled
        public List<String> contactNames;
        @AuraEnabled
        public String billingAdress;
        @AuraEnabled
        public String type;
        @AuraEnabled
        public String AccountName;
        @AuraEnabled
        public String AccountLink;

        public AccountContactWrapperClass(Account acc, List<String> contactNames){

            this.acc = acc;
            this.contactNames = contactNames;
            this.AccountLink = '/' + acc.Id;
            this.type = acc.type;
            this.AccountName = acc.Name;
            this.billingAdress = acc.BillingStreet + ',' + acc.BillingCity + ',' + acc.BillingCountry ;
             /* this.billingAddress = acc.BillingStreet + ',' + acc.BillingCity + ',' + acc.BillingCountry;
             this.billingAdress = contactNames.MailingAddress  contactNames   ;
              */
        }
    }
}