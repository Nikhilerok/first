trigger account_update on Opportunity (after insert, after update) {
    Set<Id> accountIds = new Set<Id>();
    Map<Id, Account> accountsToUpdate = new Map<Id, Account>();

    // Collect all related account IDs
    for (Opportunity opp : Trigger.new) {
        accountIds.add(opp.AccountId);
    }

    // Query for related accounts and check their opportunity status
    List<Account> accounts = [SELECT Id, Account_Type__c,
        (SELECT Id, StageName FROM Opportunities)
        FROM Account WHERE Id IN :accountIds];

    for (Account acc : accounts) {
        Boolean hasClosedWonOpportunity = false;
        Boolean hasOpenOpportunity = false;

        for (Opportunity opp : acc.Opportunities) {
            if (opp.StageName == 'Closed Won') {
                hasClosedWonOpportunity = true;
                break;
            } else if (opp.StageName != 'Closed Lost') {
                hasOpenOpportunity = true;
            }
        }

        if (hasClosedWonOpportunity) {
            acc.Account_Type__c = 'Customer';
        } else if (hasOpenOpportunity) {
            acc.Account_Type__c = 'Current Prospect';
        } else {
            acc.Account_Type__c = 'Former Prospect';
        }

        accountsToUpdate.put(acc.Id, acc);
    }

    // Save the updated account records
    if (!accountsToUpdate.isEmpty()) {
        update accountsToUpdate.values();
    }
}