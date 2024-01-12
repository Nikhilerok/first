({
    handleKeyUp: function(component, event, helper) {
        var searchText = component.find('enter-search').get('v.value');
        var action = component.get('c.searchRecords');
        
        action.setParams({
            searchText: searchText
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var recordList = response.getReturnValue();
                // Perform operations with the recordList
                console.log('Record List:', recordList);
            } else if (state === 'ERROR') {
                var errors = response.getError();
                if (errors) {
                    console.error('Error retrieving records:', errors);
                }
            }
        });
        
        $A.enqueueAction(action);
    }
})