export type CallbackDoc = {
  downloadUrl?: string;
  uploadState?: string;
  description: string;
  driveSuccess: boolean;
  embedUrl: string;
  iconUrl: string;
  id: string;
  isShared: boolean;
  lastEditedUtc: number;
  mimeType: string;
  name: string;
  rotation: number;
  rotationDegree: number;
  serviceId: string;
  sizeBytes: number;
  type: string;
  url: string;
};

export type PickerCallback = {
  action: string;
  docs: CallbackDoc[];
};

export type authResult = {
  access_token: string;
  authuser: string;
  client_id: string;
  cookie_policy: string;
  expires_at: string;
  expires_in: string;
  issued_at: string;
  login_hint: string;
  response_type: string | undefined;
  scope: string;
  session_state: null;
  status: { signed_in: boolean; method: string; google_logged_in: boolean };
  token_type: string;
  error: boolean | undefined;
};

type ViewIdOptions =
  | "DOCS"
  | "DOCS_IMAGES"
  | "DOCS_IMAGES_AND_VIDEOS"
  | "DOCS_VIDEOS"
  | "DOCUMENTS"
  | "DRAWINGS"
  | "FOLDERS"
  | "FORMS"
  | "PDFS"
  | "SPREADSHEETS";

export type DocsUploadView = {
  includeFolders?: boolean;
  parent?: string;
  mimeTypes?: string;
}

type ViewMode =
  | "GRID"
  | "LIST";

export type DocsView = {
  viewId: ViewIdOptions;
  mimeTypes?: string;
  enableDrives?: boolean;
  includeFolders?: boolean;
  selectFolderEnabled?: boolean;
  viewMode?: ViewMode;
  ownedByMe?: boolean;
  parent?: string;
  isStarred?: boolean;
} ;

export type PickerConfiguration = {
  clientId: string;
  developerKey: string;
  views: (DocsUploadView|DocsView)[];
  token?: string;
  appId?: string;
  mineOnly?: boolean;
  navHidden?: boolean;
  multiselect?: boolean;
  disabled?: boolean;
  supportDrives?: boolean;
};

export const defaultConfiguration: PickerConfiguration = {
  clientId: "",
  developerKey: "",
  views: [<DocsView>{viewId: "DOCS"}],
};
