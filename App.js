Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    launch: function() {
        var context = this.getContext();

        this._displayContextValue('Workspace: ' + context.getWorkspace().Name);
        this._displayContextValue('Project: ' + context.getProject().Name);
        this._dumpTimeContext();
        this._addStoryGrid();
        
    }, 
    _displayContextValue: function(value) {
        this.add({
            xtype: 'component',
            html: value
        });
    },
    _dumpTimeContext: function() {
        var context = this.getContext();
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
    _addStoryGrid: function() {
        this.add({
            xtype: 'rallygrid',
            itemId: 'storyGrid',
            columnCfgs: [
                'FormattedID',
                'Name',
                'Project'
            ],
            context: this.getContext(),
            storeConfig: {
                model: 'userstory',
                filters: [
                    {
                        property: 'LastUpdateDate',
                        operator: '>=',
                        value: 'today-7'
                    }      
                ],
                context:{
                    project: this.getContext().getProject(),
                    projectScopeDown: true  //true is default and can be omitted
                }
            }
        }
        );
    }
});
