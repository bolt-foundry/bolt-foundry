import { React } from "deps.ts";
import { InternalMediaIngestion } from "infra/internalbf.com/client/components/InternalMediaIngestion.tsx";
import { InternalMediaList } from "infra/internalbf.com/client/components/InternalMediaList.tsx"

export function Ingest(){
  return(
    <div>
      <div>
        <div>InternalBF</div>
        <div>Pages List</div>
        <div>Profile</div>
      </div>
      <div>
        <InternalMediaIngestion />
        <InternalMediaList />
      </div>
    </div>
  )
}