"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var typeDefs_1 = require("./typeDefs");
var useInjectScript_1 = require("./useInjectScript");
function useDrivePicker() {
    var defaultScopes = ["https://www.googleapis.com/auth/drive.file"];
    var _a = useInjectScript_1.useInjectScript("https://apis.google.com/js/api.js"), loaded = _a[0], error = _a[1];
    var _b = react_1.useState(false), pickerApiLoaded = _b[0], setpickerApiLoaded = _b[1];
    var _c = react_1.useState(), callBackInfo = _c[0], setCallBackInfo = _c[1];
    var _d = react_1.useState(false), openAfterAuth = _d[0], setOpenAfterAuth = _d[1];
    var _e = react_1.useState(typeDefs_1.defaultConfiguration), config = _e[0], setConfig = _e[1];
    var picker = null;
    // get the apis from googleapis
    react_1.useEffect(function () {
        if (loaded && !error && !pickerApiLoaded) {
            loadApis();
        }
    }, [loaded, error, pickerApiLoaded]);
    // use effect to open picker after auth
    react_1.useEffect(function () {
        if (openAfterAuth && config.token && loaded && !error && pickerApiLoaded) {
            createPicker(config);
            setOpenAfterAuth(false);
        }
    }, [openAfterAuth, config.token, loaded, error, pickerApiLoaded]);
    // open the picker
    var openPicker = function (config) {
        // global scope given conf
        setConfig(config);
        // if we didnt get token generate token.
        if (!config.token) {
            openAuthWindow();
        }
        // if we have token and everything is loaded open the picker
        if (config.token && loaded && !error && pickerApiLoaded) {
            return createPicker(config);
        }
    };
    // load the Drive picker api 
    var loadApis = function () {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.gapi.load("auth");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.gapi.load("picker", { callback: onPickerApiLoad });
    };
    var onPickerApiLoad = function () {
        setpickerApiLoaded(true);
    };
    var openAuthWindow = function () {
        window.gapi.auth.authorize({
            client_id: "1083447939024-dqpa47vi26h23psatvfh0vepb21crm75.apps.googleusercontent.com",
            scope: defaultScopes,
            immediate: false
        }, handleAuthResult);
    };
    var handleAuthResult = function (authResult) {
        if (authResult && !authResult.error) {
            setConfig(function (prev) { return (__assign(__assign({}, prev), { token: authResult.access_token })); });
            setOpenAfterAuth(true);
        }
    };
    var createPicker = function (_a) {
        var token = _a.token, _b = _a.appId, appId = _b === void 0 ? "" : _b, _c = _a.supportDrives, supportDrives = _c === void 0 ? false : _c, developerKey = _a.developerKey, views = _a.views, _d = _a.disabled, disabled = _d === void 0 ? false : _d, multiselect = _a.multiselect, _e = _a.mineOnly, mineOnly = _e === void 0 ? false : _e, _f = _a.navHidden, navHidden = _f === void 0 ? false : _f;
        if (disabled)
            return false;
        // const viewObjects = views.map(view => view instanceof DocsUploadView ? new google.picker.DocsUploadView() : new google.picker.DocsView((view as DocsUploadView).viewId)) ;
        var viewObjects = views.map(function (view) {
            if (view.hasOwnProperty("viewId")) {
                var v = new google.picker.DocsUploadView();
                for (var prop in view) {
                    switch (prop) {
                        case "mimeTypes":
                            v.setMimeTypes(view.mimeTypes);
                            break;
                        case "parent":
                            v.setParent(view.parent);
                            break;
                        case "includeFolders":
                            v.setIncludeFolders(view.includeFolders);
                            break;
                    }
                }
            }
            else {
                var v = new google.picker.DocsView();
                for (var prop in view) {
                    switch (prop) {
                        case "mimeTypes":
                            v.setMimeTypes(view.mimeTypes);
                            break;
                        case "parent":
                            v.setParent(view.parent);
                            break;
                        case "includeFolders":
                            v.setIncludeFolders(view.includeFolders);
                            break;
                        case "enableDrives":
                            v.setEnableDrives(view.enableDrives);
                            break;
                        case "selectFolderEnabled":
                            v.setSelectFolderEnabled(view.selectFolderEnabled);
                            break;
                        case "viewMode":
                            v.setMode(view.viewMode);
                            break;
                        case "ownedByMe":
                            v.setOwnedByMe(view.ownedByMe);
                            break;
                        case "isStarred":
                            v.setStarred(view.isStarred);
                            break;
                    }
                }
            }
        });
        picker = new google.picker.PickerBuilder()
            .setAppId(appId)
            .setOAuthToken(token)
            .setDeveloperKey(developerKey)
            .setCallback(pickerCallback)
            .setLocale("en");
        viewObjects.forEach(function (view) { return picker.addView(view); });
        if (mineOnly)
            picker.enableFeature(google.picker.Feature.MINE_ONLY);
        if (navHidden)
            picker.enableFeature(google.picker.Feature.NAV_HIDDEN);
        if (multiselect)
            picker.enableFeature(google.picker.Feature.MULTISELECT_ENABLED);
        if (supportDrives)
            picker.enableFeature(google.picker.Feature.SUPPORT_DRIVES);
        picker.build().setVisible(true);
        return true;
    };
    // A simple callback implementation.
    var pickerCallback = function (data) {
        if (data.action === google.picker.Action.PICKED) {
            setCallBackInfo(data);
        }
    };
    return [openPicker, callBackInfo];
}
exports.default = useDrivePicker;
//# sourceMappingURL=index.js.map