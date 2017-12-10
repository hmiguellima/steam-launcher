(function () {
    "use strict";

    var ControlConstructor = WinJS.UI.Pages.define("/pages/game/game.html", {
        ready: function (element, options) {
            var self = this;
            WinJS.xhr({
                url: 'http://store.steampowered.com/api/appdetails?appids=' + options.gameId,
                responseType: 'json'
            }).done(
                function completed(result) {
                    if (result.status === 200) {
                        self.game = result.response[options.gameId].data;
                        self._data = WinJS.Binding.as(self.game);
                        WinJS.Binding.processAll(element, self._data).then(function () {
                            WinJS.Utilities.query('#playButton').get(0).addEventListener('click', function () {
                                var uri = new Windows.Foundation.Uri('steam://run/' + options.gameId);
                                Windows.System.Launcher.launchUriAsync(uri);
                            });
                        });
                    }
                });
        }
    });

    WinJS.Namespace.define('Controls_PageControls', {
        GamePageControl: ControlConstructor
    });
})();