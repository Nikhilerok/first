public with sharing class wrapperclass {
    @AuraEnabled(cacheable=true)
    public static List<AccountContactWrapper> getPrimaryAccountContacts() {
        List<AccountContactWrapper> wrappers = new List<AccountContactWrapper>();
        for (Contact c : [SELECT Account.Id, Account.Name, FirstName, LastName, Birthdate, Phone FROM Contact WHERE Account.Name!=null  AND Primary_Contact__c = true]) {
            AccountContactWrapper wrpr = new AccountContactWrapper();
            wrpr.accountId = c.Account.Id;
            wrpr.AccountLink = '/' + c.Account.Id;
            wrpr.accountName = c.Account.Name;
            wrpr.primaryContactName = c.FirstName + ' ' + c.LastName;
            wrpr.birthdatee = c.Birthdate;
            wrpr.phone = c.Phone;
            wrappers.add(wrpr);
        }
        return wrappers;
    }
    

    public class AccountContactWrapper {
        @AuraEnabled public String AccountLink { get; set; }
        @AuraEnabled public Id accountId { get; set; }
        @AuraEnabled public String accountName { get; set; }
        @AuraEnabled public String primaryContactName { get; set; }
        @AuraEnabled public Date birthdatee { get; set; }
        @AuraEnabled public String phone { get; set; }
    }
}