Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    launch: function() {
        var context = this.getContext();

        this._displayContextValue('Workspace: ' + context.getWorkspace().Name);
        this._displayContextValue('Project: ' + context.getProject().Name);
        var timeboxScope = context.getTimeboxScope(),
            type = timeboxScope && timeboxScope.getType(),
            record = timeboxScope && timeboxScope.getRecord();
        if(timeboxScope) {
            this._displayContextValue('Timebox scope: ' + type + ', value: ' + 
                    (record ? record.get('Name') : 'Unscheduled'));
        } else {
            this._displayContextValue('No timebox scope');
        }
    }, 
    _displayContextValue: function(value) {
        this.add({
            xtype: 'component',
            html: value
        });
    }
});
