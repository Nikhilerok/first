public with sharing class datatablecontroller {
    @AuraEnabled (cacheable =true)
    public static List<case> mycases (){
        

            return [SELECT Id,CaseNumber ,Status,Subject,createdDate FROM case ];
        }
        
    }