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

        this._addLine(this, 'Extract of ' + context.getWorkspace().Name + ' at ' + new Date().toLocaleString());
        this._dumpTimeContext(this, context);
//        this._addInitiativeGrid(this, 'I46', this._filterByID('I46'), false);
//        this._addFeatureGrid(this, 'ReadyFeatures', this._filterByState('Defined'), false);
        this._countFeatures(this,this._filterByState('Defined'), PROJECT_BUSINESS);
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
    _countFeatures: function(container, filters, project){
        Ext.create('Rally.data.wsapi.Store', {
            model: "PortfolioItem/Feature",
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
                    container._addLine(container, "Business Defined features: " + store.getTotalCount());
                }
            }
        });
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
                    project: '/project/37637012809',
                    projectScopeDown: true,
                    projectScopeUp: false
                    },
                filters: filters
                }
            }
        );
    }
});
