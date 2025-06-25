/// <reference types="@types/google.accounts" />
// import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
// import { useEffect, useRef, useState } from "react";
// import { CfDsButton } from "apps/cfDs/components/CfDsButton.tsx";
// import { getConfigurationVariable } from "packages/get-configuration-var/get-configuration-var.ts";
// import { getLogger } from "packages/logger/logger.ts";

// import { useMutation } from "apps/boltFoundry/hooks/isographPrototypes/useMutation.tsx";
// import loginWithGoogleMutation from "apps/boltFoundry/__generated__/__isograph/Mutation/LoginWithGoogleCurrentViewer/entrypoint.ts";

// const logger = getLogger(import.meta);

// export const LoginWithGoogleButton = iso(`
//   field CurrentViewer.LoginWithGoogleButton @component {
//     asCurrentViewerLoggedIn { __typename }
//     asCurrentViewerLoggedOut { __typename }
//   }
// `)(function LoginWithGoogleButton({ data }) {
//   const { commit, responseElement } = useMutation(loginWithGoogleMutation);

//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const googleButtonRef = useRef<HTMLDivElement>(null);
//   useEffect(() => {
//     // Load the Google Identity Services script
//     const script = document.createElement("script");
//     script.src = "https://accounts.google.com/gsi/client";
//     script.async = true;
//     script.defer = true;
//     document.body.appendChild(script);
//     const client_id = getConfigurationVariable("GOOGLE_OAUTH_CLIENT_ID");
//     if (!client_id) {
//       logger.error("GOOGLE_OAUTH_CLIENT_ID is not set");
//       // Display error message to the user
//       setError(
//         "Google OAuth is not configured. Please check server configuration.",
//       );
//       return;
//     }

//     // Initialize Google Identity Services when script loads
//     script.onload = () => {
//       if (globalThis.google && googleButtonRef.current) {
//         globalThis.google.accounts.id.initialize({
//           client_id,
//           callback: handleCredentialResponse,
//           auto_select: false,
//           cancel_on_tap_outside: true,
//         });

//         // Display the Sign In With Google button
//         globalThis.google.accounts.id.renderButton(googleButtonRef.current, {
//           type: "standard",
//           theme: "outline",
//           size: "large",
//           text: "signin_with",
//           shape: "rectangular",
//           logo_alignment: "left",
//         });
//       }
//     };

//     return () => {
//       // Clean up script
//       document.body.removeChild(script);
//     };
//   }, []);

//   const handleCredentialResponse = (response: { credential: string }) => {
//     setIsLoading(true);
//     setError(null);
//     logger.info(response);

//     // Call the mutation with the ID token
//     commit(
//       { idToken: response.credential },
//       {
//         onComplete: () => {
//           setIsLoading(false);
//           // Reload the page to reflect the logged-in state
//           // window.location.reload();
//         },
//         onError: () => {
//           setIsLoading(false);
//           setError("Failed to sign in with Google. Please try again.");
//           // console.error("Google sign-in error:", err);
//         },
//       },
//     );
//   };

//   // Show spinner while loading or error if there was one
//   if (isLoading) {
//     return <div>Signing in...</div>;
//   }

//   if (responseElement) {
//     return <div>{responseElement}</div>;
//   }

//   if (error) {
//     return (
//       <div>
//         <div className="colorAlert">{error}</div>
//       </div>
//     );
//   }

//   // If user is already logged in, show logout button
//   if (data.asCurrentViewerLoggedIn) {
//     return (
//       <CfDsButton
//         text="Sign Out"
//         onClick={() => {
//           // Redirect to logout endpoint
//           globalThis.location.href = "/logout";
//         }}
//       />
//     );
//   }

//   // Show Google Sign-In button for logged out users
//   return (
//     <div>
//       <div ref={googleButtonRef}></div>
//     </div>
//   );
// });
