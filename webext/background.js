/* global chrome */
(function() {
    'use strict';

    function doInCurrentTab(tabCallback) {
        chrome.tabs.query(
            { currentWindow: true, active: true },
            function (tabArray) { tabCallback(tabArray[0]); }
        );
    }



    if (chrome.declarativeContent) {
        chrome.runtime.onInstalled.addListener(function () {
            chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
                chrome.declarativeContent.onPageChanged.addRules([{
                    conditions: [
                        new chrome.declarativeContent.PageStateMatcher({
                            pageUrl: {
                                hostEquals: 'arxiv.org',
                                pathPrefix: '/pdf'
                            }
                        })
                    ],
                    actions: [ new chrome.declarativeContent.ShowPageAction() ]
                }]);
            });
        });
    } else {
        // chrome.pageAction.show();
        doInCurrentTab(function(tab) { chrome.pageAction.show(tab.id); });
    }

    var contextMenuItem = {
        "id": "copyPdfTitle",
        "title": "Copy paper to clipboard",
        "contexts": ["all"],
    };

    chrome.pageAction.onClicked.addListener(function (tab) {
        chrome.tabs.sendMessage(tab.id, 'update-page-title.');
    });

    chrome.contextMenus.create(contextMenuItem);

    chrome.contextMenus.onClicked.addListener(function (clickData) {
        if (clickData.menuItemId == "copyPdfTitle") {
            // call context script function
            chrome.tabs.query({
                "active": true,
                "currentWindow": true
            }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    "functiontoInvoke": "copyPaperToClipboard"
                });
            });
        }
    });

})();
