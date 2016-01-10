Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    launch: function() {
        var context = this.getContext();

        this._addLine(this, 'Extract of ' + context.getWorkspace().Name + ' at ' + new Date().toLocaleString());
        this._dumpTimeContext(this, context);
        this._addInitiativeGrid(this, 'I46', this._filterByID('I46'), false);
        this._addFeatureGrid(this, 'ReadyFeatures', this._filterByState('Defined'), false);
        this._addLine(this, 'done');

    }, 
    _addLine: function(container, value) {
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
            this._addLine(container, 'Timebox scope: ' + type + ', value: ' + 
                    (record ? record.get('Name') : 'Unscheduled'));
        } else {
            this._addLine('No timebox scope');
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
    _filterByID: function(initiative) {
        return {            
                    property: 'FormattedID',
                    operator: '=',
                    value: initiative
                    };
    },
    _filterByState: function(value) {
        var filters = Ext.create('Rally.data.QueryFilter', {
            property: 'State.Name',
            operator: '=',
            value: value
            });
        return filters;
    },
    _addFeatureGrid: function(container, ID, filters, hideHeaders) {
        this._addPortfolioGrid(container,ID,filters,hideHeaders,
        [
        'FormattedID',
        'Name',
        'State',
        'c_BusinessPreWorkState',
        'c_FeatureQACoordinator',
        'c_UATState',
        'Project'
        ],"Feature",
        true);
    },
    _addInitiativeGrid: function(container, ID, filters, hideHeaders) {
        this._addPortfolioGrid(container,ID,filters,hideHeaders,
        [
        'FormattedID',
        'Name',
        'PercentDoneByStoryPlanEstimate',
        'PercentDoneByStoryCount',
        'AcceptedLeafStoryCount',
        'LeafStoryCount',
        'PlannedEndDate',
        'PreliminaryEstimate',
        'RefinedEstimate',
        'UnEstimatedLeafStoryCount'
        ],
        "Initiative",
        false);
    },
    _addPortfolioGrid: function(container, ID, filters, hideHeaders, columns, model, paging) {
        container.add({
            xtype: 'rallygrid',
            itemId: 'portfolioGrid'+ID,
            showPagingToolbar: paging,
            hideHeaders: hideHeaders,
            viewConfig: {shrinkWrap: 3},
            columnCfgs: columns,
            storeConfig: {
                model: 'PortfolioItem/' + model,
                autoload: true,
                context: {
                    project: '/project/37192747640', //topmost Radian project
                    projectScopeDown: true,
                    projectScopeUp: false
                    },
                filters: filters
                }
            }
        );
    }
});
