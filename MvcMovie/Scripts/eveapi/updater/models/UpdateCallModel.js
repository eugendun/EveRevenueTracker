define(['eveapicall', 'backbone'], function (EveApiCall) {
    var eveApiCall = new EveApiCall();

    var UpdateCallModel = Backbone.Model.extend({
        defaults: {
            name: '',
            url: '',
            status: 'initiate'
        },

        initialize: function () {
            this.on('success', this.success);
            this.on('fail', this.fail);
            this.on('change:status', function () { console.log("status of " + this.get('name') + " changed: " + this.get('status')) });
        },

        update: function (charId) {
            this.set('status', 'load');

            var that = this;
            eveApiCall.load(this.get('url'), { characterid: charId }, {
                success: function (data) {
                    that.trigger('success', data);
                },
                fail: function (data) {
                    that.trigger('fail', data);
                }
            });

            //var that = this;
            //$.post(this.get('url'), { characterid: this.get('charId') }, function () {
            //    that.trigger('success');
            //})
            //    .fail(function (data, textstatus, jqXHE) {
            //        that.trigger('fail');
            //    });
        },

        success: function (data) {
            this.set('status', 'success');
        },

        fail: function (data) {
            this.set('status', 'fail');
            console.error("EveApiCall::load fail!");
        }
    });

    return UpdateCallModel;
});