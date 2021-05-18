import {useEffect} from 'react';
import useDrivePicker from './dist/index';


function App() {
  const [openPicker, data] = useDrivePicker();
  const handleOpenPicker = () => {
    openPicker({
      clientId: "xxxxxxxxxxxxxxxxx",
      developerKey: "xxxxxxxxxxxx",
      views: [
        {
          viewId: "DOCS",
          enableDrives: true,
          includeFolders: true,
          selectFolderEnabled: false,
          viewMode: "LIST",
          ownedByMe: false,
          parent: "xxxxxxxxxxxx",
          isStarred: false
        },
        {
          mimeTypes: "image/jpg",
          includeFolders: true,
          parent: "xxxxxxxxxxxx"
        }
      ],
      // token: token, // pass oauth token in case you already have one
      appId: "xxxxxxxxxx",
      mineOnly: false,
      navHidden: false,
      disabled: false,
      supportDrives: true,
      multiselect: true
    })
  }

  useEffect(() => {
    // do anything with the selected/uploaded files
    if (data) {
      data.docs.map(i => console.log(i.name))
    }
  }, [data])


  return (
      <div>
        <button onClick={() => handleOpenPicker()}>Open Picker</button>
      </div>
  );
}

export default App;