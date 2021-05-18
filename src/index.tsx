// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let google: any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let window: any
import { useEffect, useState } from "react";
import { authResult, defaultConfiguration, PickerCallback, PickerConfiguration, DocsUploadView, DocsView } from "./typeDefs";
import { useInjectScript } from './useInjectScript';


export default function useDrivePicker(): [(config: PickerConfiguration) => boolean | undefined, PickerCallback | undefined,] {
	const defaultScopes = ["https://www.googleapis.com/auth/drive.file"];
	const [loaded, error] = useInjectScript("https://apis.google.com/js/api.js");
	const [pickerApiLoaded, setpickerApiLoaded] = useState(false);
	const [callBackInfo, setCallBackInfo] = useState<PickerCallback>()
	const [openAfterAuth, setOpenAfterAuth] = useState(false)
	const [config, setConfig] = useState<PickerConfiguration>(defaultConfiguration)
	
	let picker: any = null;

	// get the apis from googleapis
	useEffect(() => {
		if(loaded && !error && !pickerApiLoaded){
			loadApis()
		}
	}, [loaded, error, pickerApiLoaded])

  // use effect to open picker after auth
	useEffect(() => {
		if(openAfterAuth && config.token && loaded && !error && pickerApiLoaded) {
			createPicker(config)
			setOpenAfterAuth(false)
		}
	}, [openAfterAuth, config.token, loaded, error, pickerApiLoaded])

	// open the picker
	const openPicker = (config: PickerConfiguration) => {
		// global scope given conf
		setConfig(config);

		// if we didnt get token generate token.
		if(!config.token) {
			openAuthWindow();
		}

		// if we have token and everything is loaded open the picker
		if(config.token && loaded && !error && pickerApiLoaded) {
			return createPicker(config)
		}

	}
	
  // load the Drive picker api 
	const loadApis = () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		window.gapi.load("auth");
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		window.gapi.load("picker", {callback: onPickerApiLoad})
	}

	const onPickerApiLoad = () => {
    setpickerApiLoaded(true);
  };

	const openAuthWindow = () => {
    window.gapi.auth.authorize(
      {
        client_id: "1083447939024-dqpa47vi26h23psatvfh0vepb21crm75.apps.googleusercontent.com",
        scope: defaultScopes,
        immediate: false
      },
      handleAuthResult
    );
  };

	const handleAuthResult = (authResult: authResult) => {
    if (authResult && !authResult.error) {
			setConfig(prev => ({...prev, token: authResult.access_token}))
			setOpenAfterAuth(true)
    }
  };


	const createPicker = (
		{token, appId = "", supportDrives = false, developerKey, views,
		disabled = false, multiselect, mineOnly = false, navHidden = false
	}: PickerConfiguration) => {
		if(disabled) return false
		// const viewObjects = views.map(view => view instanceof DocsUploadView ? new google.picker.DocsUploadView() : new google.picker.DocsView((view as DocsUploadView).viewId)) ;
		const viewObjects = views.map(view => {
			if(view.hasOwnProperty("viewId")) {
				const v = new google.picker.DocsUploadView() ;
				for(const prop in view) {
					switch(prop) {
						case "mimeTypes":
							v.setMimeTypes(view.mimeTypes) ;
							break ;
						case "parent":
							v.setParent(view.parent) ;
							break ;
						case "includeFolders":
							v.setIncludeFolders(view.includeFolders) ;
							break ;
					}
				}
			}
			else {
				const v = new google.picker.DocsView() ;
				for(const prop in view) {
					switch(prop) {
						case "mimeTypes":
							v.setMimeTypes(view.mimeTypes) ;
							break ;
						case "parent":
							v.setParent(view.parent) ;
							break ;
						case "includeFolders":
							v.setIncludeFolders(view.includeFolders) ;
							break ;
						case "enableDrives":
							v.setEnableDrives((view as DocsView).enableDrives) ;
							break ;
						case "selectFolderEnabled":
							v.setSelectFolderEnabled((view as DocsView).selectFolderEnabled)
							break ;
						case "viewMode":
							v.setMode((view as DocsView).viewMode) ;
							break ;
						case "ownedByMe":
							v.setOwnedByMe((view as DocsView).ownedByMe)
							break ;
						case "isStarred":
							v.setStarred((view as DocsView).isStarred)
							break ;
					}
				}
			}
		}) ;

		picker = new google.picker.PickerBuilder()
			.setAppId(appId)
			.setOAuthToken(token)
			.setDeveloperKey(developerKey)
			.setCallback(pickerCallback)
			.setLocale("en") ;

    	viewObjects.forEach(view => picker.addView(view)) ;

		if(mineOnly) picker.enableFeature(google.picker.Feature.MINE_ONLY) ;
		if(navHidden) picker.enableFeature(google.picker.Feature.NAV_HIDDEN) ;
		if(multiselect) picker.enableFeature(google.picker.Feature.MULTISELECT_ENABLED) ;
		if(supportDrives) picker.enableFeature(google.picker.Feature.SUPPORT_DRIVES) ;

		picker.build().setVisible(true);
		return true
  };

	
	// A simple callback implementation.
	const pickerCallback = (data: PickerCallback) => {
    if (data.action === google.picker.Action.PICKED) {
      setCallBackInfo(data);
    }
  };
	
	return [openPicker, callBackInfo]
}

