/// <reference path="~/Scripts/backbone.js" />

define([
    'EveApi/charts/models/TableModel',
    'EveApi/updater/EveApiCall'
], function (TableModel, EveApiCall) {
    var eveApiCall = new EveApiCall();

    var RevenueChartModel = TableModel.extend({
        defaults: {
            characterId: undefined,
            station: '',
            stations: [],
            number: 10,
            days: 14,
            total: 0,
            totalLoss: 0,
            totalRevenue: 0
        },

        initialize: function () {
            params = {
                url: 'EveApi/GetRevenue',
                columns: [['string', 'Type'], ['number', 'Revenue']]
            }
            TableModel.prototype.initialize.apply(this, [params]);

            this.listenTo(this, 'change:station', this.onChange);
            this.listenTo(this, 'change:number', this.onChange);
            this.listenTo(this, 'change:days', this.onChange);
        },

        onChange: function () {
            this.update(this.get('characterId'));
        },

        update: function (charId) {
            this.set({ characterId: charId }, { silent: true });

            var that = this;
            eveApiCall.load(
                this.get('url'),
                {
                    characterid: this.get('characterId'),
                    station: this.get('station'),
                    number: this.get('number'),
                    days: this.get('days')
                }, {
                    success: function (data) {
                        that.trigger('success', data);
                    },
                    fail: function (data) {
                        that.trigger('fail', data);
                    }
                });

            $.getJSON(
                'EveApi/GetTransactionStations',
                { characterid: this.get('characterId') },
                function (data, textStatus, jqXHR) {
                    that.set({ stations: data })
                });
        },

        updateDataTable: function (data) {
            this.recalcRevenueAndLoss(data);
            TableModel.prototype.updateDataTable.apply(this, [data]);
        },

        recalcRevenueAndLoss: function (data) {
            var revenue = 0,
                loss = 0;

            data.forEach(function (row) {
                if (row[1] >= 0)
                    revenue += row[1];
                else
                    loss += row[1];
            });

            this.set({ total: revenue + loss, totalRevenue: revenue, totalLoss: loss });
        }
    });

    return RevenueChartModel;
});