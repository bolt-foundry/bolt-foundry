// import { Maybe, React, ReactRelay } from "deps.ts";
// import { uploadFileToS3 } from "packages/lib/uploadToS3.ts";
// import { Button } from "packages/bfDs/Button.tsx";
// import { FilePreview } from "packages/client/components/FilePreview.tsx";
// // import { useLocalStorage } from "packages/client/hooks/useLocalStorage.tsx";
// import { useAppEnvironment } from "packages/client/contexts/AppEnvironmentContext.tsx";
// // import { FileUploadCreateNewProjectMutation$data } from "packages/__generated__/FileUploadCreateNewProjectMutation.graphql.ts";
// // import { FileUpload_project$key } from "packages/__generated__/FileUpload_project.graphql.ts";
// import { useAppState } from "packages/client/contexts/AppStateContext.tsx";
// // import { captureEvent } from "packages/events/mod.ts";
// import { useFeatureFlag } from "packages/client/hooks/featureFlagHooks.ts";
// import {
//   createMuxedFile,
//   extractEncodedAudio,
// } from "packages/lib/encodingTools.ts";
// import environment from "packages/client/relay/environment.ts";
// import {
//   addFile,
//   refreshFiles,
// } from "packages/client/relay/localResolvers/ProjectResolver.ts";
// import languages from "packages/lib/languages.ts";

// const { ConnectionHandler, commitLocalUpdate } = ReactRelay;

// type Props = {
//   onComplete: (uuid: string) => void;
//   onError: (message: string) => void;
//   onProgress: (percent: number) => void;
//   onStart: () => void;
//   project$key: Maybe<FileUpload_project$key>;
//   maxSizeMB?: number;
// };

// type PreviewData = {
//   projectId: string | null;
//   name: string | null;
//   preview: string | null;
// };

// const styles: Record<string, React.CSSProperties> = {
//   box: {
//     maxHeight: 308,
//     width: 600,
//     maxWidth: "100%",
//     display: "flex",
//     flexDirection: "column",
//     borderBottomWidth: 1,
//     borderBottomStyle: "solid",
//     borderBottomColor: "var(--border)",
//   },
//   form: {
//     height: 308,
//     width: "100%",
//     textAlign: "center",
//     position: "relative",
//   },
//   input: {
//     display: "none",
//   },
//   label: {
//     height: "100%",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 2,
//     borderStyle: "dashed",
//     borderRadius: 5,
//     borderColor: "var(--border)",
//     backgroundColor: "var(--pageBackground)",
//   },
//   labelDrag: {
//     backgroundColor: "var(--background)",
//     borderColor: "var(--success)",
//   },
//   error: {
//     color: "var(--alert)",
//     fontWeight: "bold",
//     marginBottom: 12,
//   },
//   innerLabel: {
//     display: "flex",
//     flexDirection: "column",
//   },
//   dragElement: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     height: "100%",
//     width: "100%",
//     borderRadius: 5,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "var(--text)",
//     marginBottom: 5,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: "var(--textSecondary)",
//     marginBottom: 12,
//   },
// };

// // const createProjectMutation = await graphql`
// //   mutation FileUploadCreateNewProjectMutation(
// //     $name: String!,
// //     $height: Int!,
// //     $width: Int!,
// //     $language: String!,
// //     $model: String!,
// //     $connections: [ID!]!,
// //     $usesOriginPrivateFileSystem: Boolean!
// //   ) {
// //     createProject(
// //       name: $name,
// //       height: $height,
// //       width: $width,
// //       language: $language,
// //       model: $model,
// //       usesOriginPrivateFileSystem: $usesOriginPrivateFileSystem
// //       ) @appendEdge(connections: $connections)
// //       {
// //         node {
// //           trackUploadUrl
// //           url
// //           id
// //         }
// //       }
// //     }
// // `;

// // const fragment = await graphql`
// //   fragment FileUpload_project on Project {
// //     id
// //     opurl
// //   }
// // `;

// function getVideoDimensions(
//   file: File,
// ): Promise<{ width: number; height: number }> {
//   return new Promise((resolve, reject) => {
//     // Create a video element
//     const videoElem = document.createElement("video");

//     // Create URL to the File
//     const fileURL = URL.createObjectURL(file);

//     // When metadata is loaded, get dimensions and revoke URL
//     videoElem.onloadedmetadata = function () {
//       resolve({
//         width: videoElem.videoWidth,
//         height: videoElem.videoHeight,
//       });
//       URL.revokeObjectURL(fileURL);
//     };

//     videoElem.onerror = function () {
//       reject(new Error("Error loading video metadata"));
//       URL.revokeObjectURL(fileURL);
//     };

//     // Set the source of the video element to the file URL
//     videoElem.src = fileURL;
//   });
// }

// const progressRatios = {
//   writing: 0.2,
//   encoding: 0.6,
//   uploading: 0.2,
// };

// export function FileUpload(
//   { onComplete, onError, onProgress, onStart, project$key, maxSizeMB }: Props,
// ) {
//   const enableLocalFileWorkflowUpload = useFeatureFlag(
//     "local_audio_transcribing_pipeline",
//   );
//   const { currentViewer: { id: personId } } = useAppEnvironment();
//   const project = ReactRelay.useFragment(fragment, project$key);
//   const [previewData, setPreviewData] = useLocalStorage<PreviewData>(
//     "previewData",
//     { name: null, preview: null, projectId: null },
//   );
//   const connectionId = ConnectionHandler.getConnectionID(
//     personId ?? "",
//     "ProjectList_projects",
//   );
//   // const [commit, isInFlight] = ReactRelay.useMutation(createProjectMutation);
//   const isInFlight = "false"
//   const [uploadingFile, setUploadingFile] = React.useState<File | null>(null);
//   const [videoPreview, setVideoPreview] = React.useState<string | null>(null);
//   const [dragging, setDragging] = React.useState(false);
//   const [uploadError, setUploadError] = React.useState<string | null>(null);
//   const [language, setLanguage] = React.useState({ ...languages[0] });
//   const inputRef = React.useRef<HTMLInputElement>(null);
//   const offlineMode = false;
//   const { setLoginOpen } = useAppState();
//   const isWhisperEnabled = useFeatureFlag("enable_whisper");

//   const { opurl } = project ?? {};

//   async function upload(file: File | null) {
//     if (!file) return;
//     const { width, height } = await getVideoDimensions(file);
//     onStart();
//     const commitPromise = new Promise((resolve, reject) => {
//       commit({
//         variables: {
//           name: file.name,
//           height,
//           width,
//           language: language.code,
//           model: language.model,
//           connections: [connectionId],
//           usesOriginPrivateFileSystem: true,
//         },
//         onCompleted: (res, _errors) => {
//           resolve(res);
//           captureEvent("person", "uploaded video");
//         },
//         onError: (err) => {
//           reject(err);
//         },
//       });
//     });

//     try {
//       const mutationResponse =
//         (await commitPromise) as unknown as FileUploadCreateNewProjectMutation$data;
//       const { trackUploadUrl, url } = mutationResponse.createProject?.node ??
//         {};

//       if (!trackUploadUrl) {
//         throw new Error("No upload url returned from server");
//       }
//       if (!url) {
//         throw new Error("No url returned from server");
//       }
//       if (enableLocalFileWorkflowUpload) {
//         const rootDirectory = await navigator.storage.getDirectory();
//         const directory = await rootDirectory.getDirectoryHandle("videos", {
//           create: true,
//         });
//         const fileHandle = await directory.getFileHandle(
//           `${mutationResponse.createProject?.node?.id}.mp4`,
//           {
//             create: true,
//           },
//         );
//         const writable = await fileHandle.createWritable();
//         const reader = file.stream().getReader();
//         const writer = writable.getWriter();
//         const totalSize = file.size;
//         let writtenSize = 0;
//         let lastPercent = 0;
//         while (true) {
//           const { done, value } = await reader.read();
//           if (done) {
//             break;
//           }
//           await writer.write(value);
//           writtenSize += value.byteLength;
//           const percent = Math.round(writtenSize / totalSize) *
//             (progressRatios.writing * 100);
//           if (percent > lastPercent) {
//             onProgress(percent);
//             lastPercent = percent;
//           }
//         }

//         await writer.close();
//         await reader.cancel();
//         const writtenFile = await fileHandle.getFile();
//         addFile(writtenFile);

//         // get the audio from the extraction
//         let audioData;
//         try {
//           captureEvent("audio", "extracting", {}, personId);
//           audioData = await extractEncodedAudio(writtenFile);
//         } catch (e) {
//           onError(e.message);
//           return;
//         }
//         captureEvent("audio", "extracted", {}, personId);
//         const { encodedAudioChunks, sampleRate, numberOfChannels, codec } =
//           audioData;
//         const audioChunks: Array<AudioData> = [];
//         const audioDecoder = new AudioDecoder({
//           output: (audioData) => {
//             audioChunks.push(audioData);
//             const timecode = audioData.timestamp / audioData.sampleRate / 1000;
//           },
//           error: (e) => {
//             throw e;
//           },
//         });
//         audioDecoder.configure({
//           codec,
//           numberOfChannels,
//           sampleRate,
//         });

//         for (const chunk of encodedAudioChunks) {
//           audioDecoder.decode(chunk);
//         }

//         await audioDecoder.flush();
//         // create an mp4 by itself which has a single audio track
//         const outputFile = await createMuxedFile(
//           {
//             input: {
//               audio: {
//                 audioChunks,
//                 sampleRate,
//                 numberOfChannels,
//               },
//               // video: {
//             },
//             output: {
//               audio: {
//                 bitrate: 96_000,
//                 numberOfChannels,
//                 sampleRate,
//               },
//             },
//             events: {
//               onAudioProgress: (percent) => {
//                 // percent here is 0 - 1
//                 const progress = (progressRatios.writing +
//                   (percent * progressRatios.encoding)) * 100;
//                 onProgress(progress);
//               },
//             },
//           },
//         );

//         // upload that to s3
//         captureEvent("audio", "uploading", {}, personId);
//         await uploadFileToS3(outputFile, trackUploadUrl, (percent) => {
//           // percent here is 0 - 100
//           const progress = ((progressRatios.writing +
//             progressRatios.encoding) * 100) +
//             percent * progressRatios.uploading;
//           onProgress(progress);
//         }, (e) => {
//           captureEvent("audio", "uploaded", {}, personId);
//           onComplete(url);
//         });
//         return;
//       }

//       await uploadFileToS3(file, trackUploadUrl, (percent) => {
//         onProgress(percent);
//       }, (e) => {
//         onComplete(url);
//       });
//     } catch (error) {
//       if (error.code === "USER_NOT_LOGGED_IN") {
//         setLoginOpen(true);
//         onError("Please log in to upload videos");
//       } else {
//         // deno-lint-ignore no-console
//         console.error("Error uploading file:", error.message, error);
//         onError("Error uploading file");
//       }
//     }
//   }

//   function handleDrag(e: React.DragEvent) {
//     e.preventDefault();
//     e.stopPropagation();
//     setUploadError(null);
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragging(true);
//     } else if (e.type === "dragleave" || e.type === "drop") {
//       setDragging(false);
//     }
//   }

//   function handleDrop(e: React.DragEvent) {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragging(false);
//     if (e.dataTransfer.files.length > 0) {
//       const file = e.dataTransfer.files[0];
//       if (file.type.startsWith("video/")) {
//         chooseFile(file);
//         captureEvent("file", "droppedInUploader", {}, personId);
//       } else {
//         setUploadError("Only video files supported");
//       }
//     }
//   }

//   function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
//     e.preventDefault();
//     const file = e.target.files ? e.target.files[0] : null;
//     chooseFile(file);
//   }

//   function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//   }

//   function onButtonClick() {
//     if (inputRef.current != null) {
//       inputRef.current.click();
//     }
//   }

//   const chooseFile = (file: File | null) => {
//     if (!file) return;
//     const fileSize = Math.round(file.size / 1024 / 1024);
//     if (maxSizeMB && fileSize > maxSizeMB) {
//       setUploadError(
//         `File size must be less than ${maxSizeMB}MB. (currently ~${fileSize}MB)`,
//       );
//       return;
//     }

//     const url = URL.createObjectURL(file);
//     setUploadingFile(file);
//     upload(file);
//   };

//   const uploadOffline = () => {
//     onProgress(100);
//     onComplete("offline_mode");
//   };

//   const labelStyle = dragging
//     ? { ...styles.label, ...styles.labelDrag }
//     : styles.label;

//   const projectId = project?.id ?? null;

//   const data = projectId != null && previewData.projectId != null
//     ? previewData
//     : null;
//   const name = data ? data.name : uploadingFile?.name ?? null;

//   const uploadForm = opurl == null
//     ? (
//       <div style={styles.box}>
//         <form
//           id="form-file-upload"
//           style={styles.form}
//           onDragEnter={handleDrag}
//           onSubmit={handleSubmit}
//         >
//           <input
//             accept="video/*"
//             type="file"
//             id="input-file-upload"
//             multiple={false}
//             onChange={handleChange}
//             ref={inputRef}
//             style={styles.input}
//           />
//           <label
//             id="label-file-upload"
//             htmlFor="input-file-upload"
//             style={labelStyle}
//           >
//             <div style={styles.innerLabel}>
//               <div style={styles.title}>Add new video</div>
//               <div style={styles.subtitle}>Drag and drop new video here</div>
//               {uploadError && <div style={styles.error}>{uploadError}</div>}
//               <Button
//                 kind="outline"
//                 text="Or select video"
//                 onClick={onButtonClick}
//                 testId="button-select-video-upload"
//               />
//               {offlineMode && (
//                 <Button
//                   kind="outline"
//                   text="Offline mode"
//                   onClick={uploadOffline}
//                 />
//               )}
//             </div>
//           </label>
//           {dragging && (
//             <div
//               style={styles.dragElement}
//               onDragEnter={handleDrag}
//               onDragLeave={handleDrag}
//               onDragOver={handleDrag}
//               onDrop={handleDrop}
//             />
//           )}
//         </form>
//       </div>
//     )
//     : (
//       <div style={styles.box}>
//         <FilePreview
//           src={opurl}
//           name={name}
//         />
//       </div>
//     );

//   const languagesMenu = languages.map((lang) => {
//     return {
//       label: lang.display_name,
//       onClick: () => {
//         setLanguage(lang);
//       },
//     };
//   });

//   return (
//     <div>
//       {isWhisperEnabled && (
//         <Button
//           tooltipMenuDropdown={languagesMenu}
//           tooltipJustification="end"
//           tooltipPosition="bottom"
//           text={language.display_name}
//         />
//       )}
//       {uploadForm}
//     </div>
//   );
// }
