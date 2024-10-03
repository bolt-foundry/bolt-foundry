import { graphql } from "packages/client/deps.ts";
import { useFragment } from "react-relay";
import { BfDsTooltip } from "packages/bfDs/BfDsTooltip.tsx";
import { Pill } from "packages/bfDs/Pill.tsx";
import { FeatureFlag } from "packages/client/components/FeatureFlag.tsx";
import { ClipEditButton } from "packages/client/components/clipsearch/ClipEditButton.tsx";
import type { SearchResult_bfSavedSearchResult$key } from "packages/__generated__/SearchResult_bfSavedSearchResult.graphql.ts";

const fragment = await graphql`
    fragment SearchResult_bfSavedSearchResult on BfSavedSearchResult {
      id
      title
      body
      description
      rationale
      topics
      confidence
      startTime
      endTime
      ...ClipEditModal_bfSavedSearchResult
    }
  `;

type Props = {
  bfSavedSearchResult$key: SearchResult_bfSavedSearchResult$key;
};

export function SearchResult(props: Props) {
  const data = useFragment(fragment, props.bfSavedSearchResult$key);
  const topicPills = data.topics?.map((topic) => <Pill text={topic?.trim()} />);
  // const length = `${(endTime - startTime).toFixed(2)}s`;
  return (
    <div className="clip">
      <div className="clipInner clipContainer">
        <FeatureFlag name="placeholder">
          <div className="videoPlayer tall">
            (video player)
          </div>
        </FeatureFlag>
        <div className="clipContent">
          <div className="clipHeader">
            <div className="clipHeaderLeft">
              <div className="clipTitle" dir="auto">{data.title}</div>
              <div className="clipDescription" dir="auto">
                {data.description}
              </div>
            </div>
            <div className="clipActions row-column">
              <FeatureFlag name="placeholder">
                <ClipEditButton bfSavedSearchResult$key={data} />
              </FeatureFlag>
              {
                /* <DownloadClipButton
                  startTime={startTime}
                  endTime={endTime}
                  mediaId={mediaId}
                  title={title}
                  transcriptId={transcriptId}
                /> */
              }

              {/* <StarClipButton clip$key={{id: 20, isStarred: true}}/> */}
              {
                /* <ChangeRequestButton /> */
              }
            </div>
          </div>

          <div className="clipMain">{data.body}</div>

          <div className="clipMeta flexColumn" style={{ gap: "10px" }}>
            <div className="flexRow" style={{ gap: "5px" }}>
              {
                /* <BfDsTooltip canCopy text={mediaId} position="right">
                  <Pill label="Source" text={filename} />
                </BfDsTooltip> */
              }
              <BfDsTooltip text={data.rationale} position="right">
                <Pill label="Rating" text={data.confidence ?? "?"} />
              </BfDsTooltip>
              <BfDsTooltip canCopy text="mediaId" position="right">
                <Pill label="Source" text="filename" />
              </BfDsTooltip>
              {
                /* <BfDsTooltip
                  text={`Start: ${startTime} End: ${endTime}`}
                  position="right"
                >
                  <Pill label="Length" text={length} />
                </BfDsTooltip> */
              }
            </div>

            <div className="flexRow" style={{ gap: "5px" }}>
              {topicPills}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
