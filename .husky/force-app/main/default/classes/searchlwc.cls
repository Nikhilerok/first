public with sharing class searchlwc {
    @AuraEnabled(cacheable=true)
    public static List<String> searchObjects(String searchText) {
        List<String> objectList = new List<String>();
        
        String query = 'SELECT QualifiedApiName FROM EntityDefinition WHERE IsCustomizable = true  AND QualifiedApiName LIKE \'' + searchText +  '%\' LIMIT 10';
        for (EntityDefinition entityDef : Database.query(query)) {
            objectList.add(entityDef.QualifiedApiName);
        }
        
        return objectList;
    }

    @AuraEnabled(cacheable=true)
    public static List<SObject> searchRecords(String selectedObject, String searchText) {
        String objectAPIName = String.valueOf(selectedObject);
        String query;
        
        // Check if the object has a Name field, otherwise search by Subject or CaseNumber
        if (objectAPIName == 'Case') {
              String query1 = 'SELECT CaseNumber, Subject, Status, Priority FROM Case ';
        if (!String.isEmpty(searchText)) {
            String escapedSearchText = String.escapeSingleQuotes(searchText);
            query += 'WHERE CaseNumber LIKE \'%' + escapedSearchText + '%\' OR Subject LIKE \'%' + escapedSearchText + '%\' ';
        }
        }else {
            query = 'SELECT Id, Name FROM ' + objectAPIName + ' WHERE Name LIKE \'%' + searchText + '%\' LIMIT 10';
        }
        
        return Database.query(query);
    }
}


   /* 
  @AuraEnabled(cacheable=true)
    public static List<SObject> searchRecords(String selectedObject, String searchText) {
        String objectAPIName = String.valueOf(selectedObject);
        String query = 'SELECT Id, Name FROM ' + objectAPIName + ' WHERE Name LIKE \'%' + searchText + '%\' LIMIT 10';
        
        return Database.query(query);
    }
         */
/*  

    @AuraEnabled(cacheable=true)
    public static List<SObject> searchRecords(String selectedObject, String searchText) {
        String objectAPIName = String.valueOf(selectedObject);
        String query;
        
        if (objectAPIName == 'Case') {
            query = 'SELECT Id, CaseNumber FROM Case WHERE CaseNumber LIKE \'%' + searchText + '%\' LIMIT 10';
        } else {
            query = 'SELECT Id, Name FROM ' + objectAPIName + ' WHERE Name LIKE \'%' + searchText + '%\' LIMIT 10';
        }
        
        return Database.query(query);
    }
}
//        String query = 'SELECT QualifiedApiName FROM EntityDefinition WHERE IsCustomizable = true  AND QualifiedApiName LIKE \'' + searchText +  '%\' LIMIT 10';


/*    @AuraEnabled(cacheable=true)
    public static List<SObject> searchRecords(String selectedObject, String searchText) {
        String objectAPIName = String.valueOf(selectedObject);
        String query = 'SELECT Id, Name FROM ' + objectAPIName + ' WHERE Name LIKE \'%' + searchText + '%\' LIMIT 10';
        
        return Database.query(query);
    }

*/ 
//         String query = 'select fields(all) FROM ' + objectAPIName + ' WHERE Name LIKE \'%' + searchText + '%\' LIMIT 10';
//        SELECT CaseNumber FROM Case WHERE CaseNumber= '00001393'
//     query = 'SELECT Id, Name,Subject FROM ' + objectAPIName + ' WHERE Name LIKE \'%' + searchText + '%\' OR Subject LIKE \'%' + searchText + '%\' LIMIT 10';