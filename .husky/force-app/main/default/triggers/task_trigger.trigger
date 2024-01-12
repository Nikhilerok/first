trigger task_trigger on Account (after update) { 
    List <task> newtask = new list <task> ();
    for (Account acc : Trigger.new){
        
         if(acc.Account_Type__c == 'Former Prospect' && Trigger.oldMap.get(acc.Id).Account_Type__c == 'Current Prospect') {
           
               Task t = new Task();
            t.WhatId = acc.Id;
            t.Subject = 'Recover - ' + acc.Name;
            t.OwnerId = acc.OwnerId;
            t.ActivityDate = System.today().addYears(1);
            t.Status = 'Not Started';
            t.Priority = 'High';
            newtask.add(t);
        }   
           }
     insert newtask;
   }