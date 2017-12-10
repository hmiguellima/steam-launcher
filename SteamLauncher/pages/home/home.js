(function () {
    "use strict";

    var nav = WinJS.Navigation;
    var gameList = new WinJS.Binding.List();

    WinJS.Namespace.define('SteamLauncher.gameList', {
        data: gameList
    });

    var ControlConstructor = WinJS.UI.Pages.define("/pages/home/home.html", {
        ready: function (element, options) {
            var self = this;
            this._data = WinJS.Binding.as(options);

            gameList.splice(0, gameList.length);
            WinJS.Binding.processAll(element, this._data).then(function () {
                var listView = WinJS.Utilities.query('#listView')[0].winControl;
                listView.addEventListener("iteminvoked", function (evt) {
                    var game = gameList.getAt(evt.detail.itemIndex)
                    nav.navigate('/pages/game/game.html', game);
                });
                self.loadData();
            });
        },

        loadData: function() {
            WinJS.xhr({
                url: "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?include_appinfo=1&key=" + SteamLauncher.key + "&steamid=" + SteamLauncher.profile + "&format=json",
                responseType: "json"
            }).done(
                function completed(result) {
                    var i;
                    var games;
                    var gameId;
                    var title;
                    var imgHash;

                    if (result.status === 200) {
                        games = result.response.response.games.sort(function (a, b) {
                            return a.playtime_2weeks ? b.playtime_2weeks ? 0 : -1 : b.playtime_2weeks ? 1 : 0;
                        });
                        for (i = 0; i < games.length; i++) {
                            gameId = games[i].appid;
                            title = games[i].name;
                            imgHash = games[i].img_logo_url;
                            gameList.push({
                                runUrl: "steam://run/" + gameId,
                                gameId: gameId,
                                title: title,
                                picture: "http://media.steampowered.com/steamcommunity/public/images/apps/" + gameId + "/" + imgHash + ".jpg"
                            });
                        }
                    }
                });
        }
    });

    WinJS.Namespace.define('Controls_PageControls', {
        HomePageControl: ControlConstructor
    });
})();