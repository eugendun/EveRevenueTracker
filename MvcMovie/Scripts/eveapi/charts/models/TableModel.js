/// <reference path="../../../backbone.js" />

define(['eveapicall', 'backbone', 'google'], function (EveApiCall) {
    var eveApiCall = new EveApiCall();

    var TableModel = Backbone.Model.extend({
        defaults: {
            url: null,
            columns: null,
            dataTable: null
        },

        initialize: function (params) {
            this.set({
                url: params.url,
                columns: params.columns
            }, { silent: true });
            this.set({ dataTable: this.getNewDataTable() }, { silent: true });

            if (!_.isUndefined(params.data) && !_.isEmpty(params.data)) {
                this.setData(data);
            }

            this.on('success', this.success);
            this.on('fail', this.fail);
        },

        getNewDataTable: function () {
            var dataTable = new google.visualization.DataTable();
            var columns = this.get('columns');
            for (var i = 0; i < columns.length; i++) {
                dataTable.addColumn(columns[i][0], columns[i][1]);
            }
            return dataTable;
        },

        setData: function (data) {
            if (_.isArray(data) && data.length > 0) {
                this.get('dataTable').addRows(data);
            }
        },

        update: function (charId) {
            var that = this;
            eveApiCall.load(this.get('url'), { characterid: charId }, {
                success: function (data) {
                    that.trigger('success', data);
                },
                fail: function (data) {
                    that.trigger('fail', data);
                }
            });
        },

        success: function (data) {
            var dataArray;

            try {
                dataArray = eval(data);
                if (!_.isArray(dataArray))
                    throw Error("Response data is not in a array format!");
            } catch (e) {
                dataArray = [];
            }

            this.updateDataTable(dataArray);
        },

        // TODO
        fail: function (data) {
            this.updateDataTable([]);
            console.error("Data load fails!");
        },

        updateDataTable: function (data) {
            this.set({ dataTable: this.getNewDataTable() });
            this.setData(data);
            this.trigger('change:dataTable');
        }
    });

    return TableModel;
});