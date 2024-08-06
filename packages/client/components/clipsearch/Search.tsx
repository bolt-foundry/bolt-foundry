import { React } from "deps.ts";
import { Input } from "packages/bfDs/Input.tsx";
import { BfDsForm } from "packages/bfDs/BfDsForm.tsx";
const useState = React.useState;

export function Search() {
  const [prompt, setPrompt] = useState("");
  const [isInFlight, setIsInFlight] = useState(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Searching for", prompt);
    setIsInFlight(true);
    setTimeout(() => setIsInFlight(false), 3000);
    setPrompt("");
  }
  return (
    <div className="cs-search">
      <form onSubmit={onSubmit}>
        <Input
          placeholder="Search"
          showSpinner={isInFlight}
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
          }}
        />
      </form>
    </div>
  );
}
