Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    launch: function() {
        var context = this.getContext();

        this._displayContextValue(this, 'Workspace: ' + context.getWorkspace().Name);
        this._displayContextValue(this, 'Project: ' + context.getProject().Name);
        this._displayContextValue(this, 'Global Project: ' + context.getGlobalContext().getProject().Name);
        this._dumpTimeContext(this, context);
        this._addStoryGrid(this, context);
        this._addInitiativeGrid(this, 'I46');
        this._addInitiativeGrid(this, 'I67');
    }, 
    _displayContextValue: function(container, value) {
        container.add({
            xtype: 'component',
            html: value
        });
    },
    _dumpTimeContext: function(container, context) {
        var timeboxScope = context.getTimeboxScope(),
            type = timeboxScope && timeboxScope.getType(),
            record = timeboxScope && timeboxScope.getRecord();
        if(timeboxScope) {
            this._displayContextValue(container, 'Timebox scope: ' + type + ', value: ' + 
                    (record ? record.get('Name') : 'Unscheduled'));
        } else {
            this._displayContextValue('No timebox scope');
        }
    },
    _addStoryGrid: function(container, context) {
        container.add({
            xtype: 'rallygrid',
            itemId: 'storyGrid',
            columnCfgs: [
                'FormattedID',
                'Name',
                'Project'
            ],
            context: context,
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
                    project: context.getProject(),
                    projectScopeDown: true  //true is default and can be omitted
                }
            }
        }
        );
    },
    _addInitiativeGrid: function(container, initiative) {
        container.add({
            xtype: 'rallygrid',
            itemId: 'initiativeGrid'+initiative,
            showPagingToolbar: false,
            columnCfgs: [
                'FormattedID',
                'Name',
                'PercentDoneByPlanEstimate',
                'PercentDoneByStoryCount',
                'PlannedEndDate',
                'PreliminaryEstimate',
                'RefinedEstimate',
                'UnEstimatedLeafStoryCount'
                ],
            storeConfig: {
                model: 'PortfolioItem/Initiative',
                autoload: true,
                context: {
                    project: '/project/37192747640', //topmost Radian project
                    projectScopeDown: true,
                    projectScopeUp: false
                    },
                filters: {            
                    property: 'FormattedID',
                    operator: '=',
                    value: initiative
                    }
                }
            }
        );
    }
});
