import { iso } from "@iso-bfc";

export const LogInOrOutButton = iso(`
  field CurrentViewer.LogInOrOutButton @component {
    __typename
    id
    orgBfOid
    personBfGid
  }
`)(function LogInOrOutButton({ data }) {
  // For now, we'll determine authentication state based on whether we have user data
  // This is a temporary approach until we fix the interface implementation
  const isLoggedIn = data.personBfGid != null && data.orgBfOid != null;

  if (isLoggedIn) {
    return (
      <div>
        <p>Welcome! You are logged in.</p>
        <button
          onClick={() => {
            // Clear cookies and reload
            document.cookie =
              "bf_access=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie =
              "bf_refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            globalThis.location.reload();
          }}
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div>
      <p>You are not logged in.</p>
      <button
        onClick={() => {
          // Mock login for now
          alert("Login functionality will be implemented next");
        }}
      >
        Continue with Google
      </button>
    </div>
  );
});