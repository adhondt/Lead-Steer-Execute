/*global Ext*/
Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    launch: function() {
        var PROJECT_RADIAN = '37192747640';
        var PROJECT_BUSINESS = '37637012809';
        var PROJECT_SPRINT_TEAMS = '37213611687';
        var PROJECT_SUPPORTING_TEAMS = '37192947515';
        var PROJECT_EXECUTION = '37192748545';
        var PROJECT_AWS_TEAMS = '35625370074';
        var PROJECT_ECMLDR_TEAMS = '35625373948';
        var PROJECT_PAS_TEAMS = '34799452294';
        var PROJECT_SFDC_TEAMS = '35625125755';
        var context = this.getContext();

//        this._addFeatureGrid(this, 'ReadyFeatures', this._filterByState('Defined'), PROJECT_BUSINESS, false);

/*
this._addLine(this, 'Extract of ' + context.getWorkspace().Name + ' at ' + new Date().toLocaleString());
        this._dumpTimeContext(this, context);
        this._addInitiativeGrid(this, 'I46', this._filterByID('I46'), PROJECT_RADIAN, false);
        this._addInitiativeGrid(this, 'I44', this._filterByID('I44'), PROJECT_RADIAN, true);
        this._addThemeGrid(this, 'T373', this._filterByID('T373'), PROJECT_RADIAN, false);
        this._addThemeGrid(this, 'T418', this._filterByID('T418'), PROJECT_RADIAN, true);
        this._addCount(this,'PortfolioItem/Feature',this._filterByState('Defined'), PROJECT_BUSINESS, 'Business defined features:');
        this._addCount(this,'UserStory',this._filterEstimatedStoriesByRelease('PI.07'), PROJECT_SUPPORTING_TEAMS, 'Estimated Stories--Supporting Teams:');
        this._addCount(this,'UserStory',this._filterEstimatedStoriesByRelease('PI.07'), PROJECT_SPRINT_TEAMS, 'Estimated Stories--Sprint Teams:');
        this._addCount(this,'UserStory',this._filterEstimatedStoriesByRelease('PI.07'), PROJECT_AWS_TEAMS, 'Estimated Stories--AWS Teams:');
        this._addCount(this,'UserStory',this._filterEstimatedStoriesByRelease('PI.07'), PROJECT_ECMLDR_TEAMS, 'Estimated Stories--ECMLDR Teams:');
        this._addCount(this,'UserStory',this._filterEstimatedStoriesByRelease('PI.07'), PROJECT_PAS_TEAMS, 'Estimated Stories--PAS Teams:');
        this._addCount(this,'UserStory',this._filterEstimatedStoriesByRelease('PI.07'), PROJECT_SFDC_TEAMS, 'Estimated Stories--SFDC Teams:');
*/
        this._addAvg(this,"Iteration",this._filterLastSixWeeksOfIterations(),PROJECT_ECMLDR_TEAMS,"Average Velocity","PlannedVelocity");

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
                    projectScopeDown: true 
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
    _filterEstimatedStoriesByRelease: function(value) {
        var filters = Ext.create('Rally.data.QueryFilter', {
            property: 'Release.Name',
            operator: '=',
            value: value
            });
        filters = filters.and(Ext.create('Rally.data.QueryFilter', {
            property: 'PlanEstimate',
            operator: '>',
            value: '0'
            }));
        return filters;
    },
    _filterLastSixWeeksOfIterations: function() {
        var filters = Ext.create('Rally.data.QueryFilter', {
            property: 'StartDate',
            operator: '=',
            value: "today - 56"
            });
        filters = filters.and(Ext.create('Rally.data.QueryFilter', {
            property: 'EndDate',
            operator: '<',
            value: "today"
            }));
        return filters;
    },
    _addAvg: function(container, model, filters, project, message, field){
        Ext.create('Rally.data.wsapi.Store', {
            model: model,
            pagesize: 1,
            autoLoad: true,
            columnCfgs: [
                'Name',
                'Project',
                'PlannedVelocity',
                'PlanEstimate'
            ],
            context: {project: '/project/' + project},
            filters: filters,
            listeners: {
                load: function(store, records) {
                    var total=0;
                    container._addLine(container, store.getTotalCount() + ' ' + model + ' rows in ' + filters);
                    container._addLine(container, "first field:" + records[0].get('Name'));
                    Ext.Array.each(records, function(row) {
                            total += row.PlanEstimate || 0;
                            container._addLine(container, "found row " + row.get('Name') + ' ' + row.get('Project') + ' ' + row.get('PlannedVelocity') + ' ' + row.get('PlanEstimate'));
                    });
                    container._addLine(container, message + ' ' + total);
                }
            }
        });
        },
    _addCount: function(container, model, filters, project, message){
        Ext.create('Rally.data.wsapi.Store', {
            model: model,
            pagesize: 1,
            autoLoad: true,
            context: {
                project: '/project/' + project,
                projectScopeDown: true,
                projectScopeUp: false
                },
            filters: filters,
            listeners: {
                load: function(store, records) {
                    container._addLine(container, message + ' ' + store.getTotalCount());
                }
            }
        });
        },
    _addFeatureGrid: function(container, ID, filters, project, hideHeaders) {
        this._addPortfolioGrid(container,ID,filters, project, hideHeaders,
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
    _addThemeGrid: function(container, ID, filters, project, hideHeaders) {
        this._addPortfolioGrid(container,ID,filters, project, hideHeaders,
        [
        'FormattedID',
        'Name',
        'PercentDoneByStoryPlanEstimate',
        'PercentDoneByStoryCount',
        'AcceptedLeafStoryCount',
        'LeafStoryCount',
        'State',
        'c_BusinessPreWorkState',
        'c_FeatureQACoordinator',
        'c_UATState',
        'Project'
        ],"Theme",
        false);
    },
    _addInitiativeGrid: function(container, ID, filters, project, hideHeaders) {
        this._addPortfolioGrid(container,ID,filters, project, hideHeaders,
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
    _addPortfolioGrid: function(container, ID, filters, project, hideHeaders, columns, model, paging) {
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
                    project: '/project/'+project,
                    projectScopeDown: true,
                    projectScopeUp: false
                    },
                filters: filters
                }
            }
        );
    },
    _isNumeric: function(n){
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
});
