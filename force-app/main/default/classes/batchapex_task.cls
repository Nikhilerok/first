public class batchapex_task  implements Database.Batchable<sObject> {
    public Database.QueryLocator start(Database.BatchableContext BC) {
        Set<String> emailSet = new Set<String>();                  //batchapex_testclass

        // Retrieve distinct email addresses from api_records__c
        for (api_records__c record : [SELECT Email_Address__c FROM api_records__c]) {
            emailSet.add(record.Email_Address__c);
        }

        // Retrieve api_records__c records with matching email addresses in Contact
        return Database.getQueryLocator([ SELECT Id, Email_Address__c
            FROM api_records__c
            WHERE Email_Address__c IN :emailSet
        ]);
    }

    public void execute(Database.BatchableContext BC, List<sObject> scope) {
        Set<Id> apiRecordIds = new Set<Id>(); // to store api_records__c record Ids
        Set<Id> contactIds = new Set<Id>(); // to store Contact Ids
        Set<Id> caseIds = new Set<Id>(); // to store Case Ids
        Set<Id> opportunityIds = new Set<Id>(); // to store Opportunity Ids
        Set<Id> taskIds = new Set<Id>(); // to store Task Ids

        for (sObject record : scope) {
            api_records__c apiRecord = (api_records__c)record;
            String email = apiRecord.Email_Address__c;

            // Retrieve associated Contact records
            List<Contact> contacts = [SELECT Id FROM Contact WHERE Email = :email];

            if (!contacts.isEmpty()) {
                // Add api_records__c record Id to the set if associated contacts exist
                apiRecordIds.add(apiRecord.Id);

                for (Contact con : contacts) {
                    // Retrieve associated Case and Opportunity records
                    List<Case> cases = [SELECT Id FROM Case WHERE ContactId = :con.Id];
                    List<Opportunity> opportunities = [SELECT Id FROM Opportunity WHERE ContactId = :con.Id];
                    List<Task> tasks = [SELECT Id FROM Task WHERE WhoId = :con.Id];

                    contactIds.add(con.Id);

                    for (Opportunity opportunity : opportunities) {
                        opportunityIds.add(opportunity.Id);
                    }

                    for (Case caseRecord : cases) {
                        caseIds.add(caseRecord.Id);
                        // Retrieve associated tasks of the case
                        List<Task> caseTasks = [SELECT Id FROM Task WHERE WhatId = :caseRecord.Id];
                        for (Task caseTask : caseTasks) {
                            taskIds.add(caseTask.Id);
                        }
                    }

                    for (Task task : tasks) {
                        taskIds.add(task.Id);
                    }
                }
            }
        }

        // Delete associated Case, Opportunity, Task, and Contact records
        delete [SELECT Id FROM Case WHERE Id IN :caseIds];
        delete [SELECT Id FROM Opportunity WHERE Id IN :opportunityIds];
        
        delete [SELECT Id FROM Task WHERE Id IN :taskIds];
        delete [SELECT Id FROM Contact WHERE Id IN :contactIds];
        
        delete [SELECT Id FROM api_records__c WHERE Id IN :apiRecordIds];
    }

    public void finish(Database.BatchableContext BC) {
        System.debug('Batch deletion completed.');
    }
}