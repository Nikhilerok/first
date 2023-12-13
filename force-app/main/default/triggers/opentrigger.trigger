trigger opentrigger on Opportunity (after insert, after update) {
    // Collect Opportunity Ids and their corresponding Account Ids
    Set<Id> accountIds = new Set<Id>();
    Map<Id, Id> opportunityAccountMap = new Map<Id, Id>();

    for (Opportunity opp : Trigger.new) {
        if (opp.StageName != 'Closed Lost' && opp.StageName != 'Closed Won') {
            accountIds.add(opp.AccountId);
            opportunityAccountMap.put(opp.Id, opp.AccountId);         // Current Prospect   Former Prospect  Customer    Account_Type__c
        }
    }

    // Query for the relevant Accounts
    List<Account> accountsToUpdate = [SELECT Id, Type FROM Account WHERE Id IN :accountIds];

    // Update the Account Type field to "Current Prospect"
    for (Account acc : accountsToUpdate) {
        acc.Account_Type__c = 'Current Prospect';
    }

    // Update the affected Accounts
    if (!accountsToUpdate.isEmpty()) {
        update accountsToUpdate;
    }
}