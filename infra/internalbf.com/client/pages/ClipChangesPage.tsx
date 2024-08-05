import { React } from "deps.ts";
import { Table } from "packages/bfDs/Table.tsx";
import { TableCell } from "packages/bfDs/TableCell.tsx";
import { Button } from "packages/bfDs/Button.tsx";
import { useRouter } from "infra/internalbf.com/client/contexts/RouterContext.tsx";
import { CopyButton } from "packages/bfDs/CopyButton.tsx";
import { List } from "packages/bfDs/List.tsx";
import { ListItem } from "packages/bfDs/ListItem.tsx";

export function ClipChangesPage({ currentClip, onClose }) {
  return (
    <div className="internalPage flexColumn">
      <div className="internalMainHeader">
        <div className="internalLogo">
          <div style={{ height: 32 }}>
            <Button iconLeft="back" onClick={onClose} />
          </div>
          <div>Reflecting on being from Idaho</div>
        </div>
      </div>
      <div className="internalMainContent" style={{ flex: "auto" }}>
        <List separator={true}>
          {currentClip.comments.length > 0 && (
            currentClip.comments.map((comment) => {
              const content = (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "8px",
                    alignItems: "center",
                  }}
                >
                  <div className="ellipsis" style={{ flex: "1" }}>
                    {comment.comment}
                  </div>
                  <div className="elipses">{`${comment.timecode}s`}</div>
                </div>
              );
              return <ListItem content={content} />;
            })
          )}
        </List>
      </div>
      <div className="internalLinkCopyQC">
        <div>
          <CopyButton textToCopy="www.fakeurl.com" /> and open on your desktop.
        </div>
        <div>
          <CopyButton textToCopy="www.fakeurl.com" /> and put new clips there.
        </div>
        {/* There is almost 100% a better way to do this lol, but i think it's kinda cool */}
      </div>
    </div>
  );
}
