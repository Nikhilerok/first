({
    doInit : function(component) {
        var action = component.get("c.getAccounts");
        action.setCallback(this,function(response){
            var accResult = response.getReturnValue();
            component.set("v.accountResults",accResult)
        });
        $A.enqueueAction(action);
    },
    handleClick:function(component,event){
        event.preventDefault();
        var payload = {
            AccountId: event.target.dataset.value,
            AdditionalInfo: 'This is published from AURA Component' 
        }
        

        component.find('ACCOUNTLMC').publish(payload);
       
    }
})