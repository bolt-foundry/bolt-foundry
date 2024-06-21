import { React } from "aws/client/deps.ts";
import PageFrame from "aws/client/components/PageFrame.tsx";
import ClipReview from "aws/client/components/ClipReview.tsx";
import classnames from "aws/client/lib/classnames.ts";
import Button from "aws/client/ui_components/Button.tsx";
import TextArea from "aws/client/ui_components/TextArea.tsx";
import { useFeatureFlag } from "aws/client/hooks/featureFlagHooks.tsx";

export type ReviewStatus = "approved" | "rejected" | null;

// TEMP
const projectName = "TC 1/16 7pm";
const clubName = "Tiny Cupboard";
const clipIds = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
const genericClipData = {
  title: "Clip title",
  description: "Desciption about the clip",
  text:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  start_time: 0,
  end_time: 90,
  reviewStatus: null as ReviewStatus,
  reviewComment: "",
};
const videoUrl =
  "https://bf-static-assets.s3.amazonaws.com/test-files/mov_bbb.mp4";
const clipsFromData = clipIds.map((id) => ({
  id,
  ...genericClipData,
}));

function ReviewPageContent() {
  const [clips, setClips] = React.useState(clipsFromData);
  const [lastReviewedClipId, setLastReviewedClipId] = React.useState<
    string | null
  >(null);
  const refContainer = React.useRef<Record<string, HTMLDivElement>>({});

  React.useEffect(() => {
    // after clicking approve/reject, scroll to next unreviewed clip
    if (!lastReviewedClipId) return;
    let scrollToClipId = null;

    const lastReviewedIndex = clips.findIndex((clip) =>
      clip.id === lastReviewedClipId
    );
    const clipsToReviewAfterLastReviewedIndex = clips.slice(
      lastReviewedIndex + 1,
    ).filter((clip) => clip.reviewStatus == null);
    if (clipsToReviewAfterLastReviewedIndex.length > 0) {
      // next unreviewed clip
      scrollToClipId = clipsToReviewAfterLastReviewedIndex[0].id;
    } else {
      // first unreviewed clip
      scrollToClipId = clips.filter((clip) => clip.reviewStatus == null)[0].id;
    }

    if (scrollToClipId && refContainer.current[scrollToClipId]) {
      const element = refContainer.current[scrollToClipId];
      const bounding = element.getBoundingClientRect();

      // Check if the top 100 pixels of the element are not visible within the viewport
      if (bounding.top < 100 || bounding.top > (window.innerHeight - 100)) {
        // wait for CSS animation to finish
        setTimeout(() =>
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }), 250);
      }
    }
  }, [lastReviewedClipId]);

  const handleReview = (clipId: string, reviewStatus: ReviewStatus) => {
    const clipIndex = clips.findIndex((clip) => clip.id === clipId);
    const clip = { ...clips[clipIndex] };
    if (!clip) return;
    if (clip.reviewStatus === reviewStatus) {
      setLastReviewedClipId(null);
      clip.reviewStatus = null;
    } else {
      setLastReviewedClipId(clipId);
      clip.reviewStatus = reviewStatus;
    }
    const newClips = [...clips];
    newClips[clipIndex] = clip;
    setClips(newClips);
  };

  const handleChangeComment = (
    clipId: string,
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const clipIndex = clips.findIndex((clip) => clip.id === clipId);
    const clip = { ...clips[clipIndex] };
    if (!clip) return;
    clip.reviewComment = e.target.value;
    const newClips = [...clips];
    newClips[clipIndex] = clip;
    setClips(newClips);
  };

  const numReviewed = clips.filter((clip) => clip.reviewStatus != null).length;
  const totalClips = clips.length;

  return (
    <div className="page" style={{ height: "100vh" }}>
      <div className="header reviewHeader">
        <div className="headerText" style={{ flex: 1 }}>
          Review: {projectName}
        </div>
        <Button
          kind="primary"
          disabled={numReviewed !== totalClips}
          // deno-lint-ignore no-console
          onClick={() => console.log("TODO: submit review")}
          subtext={`${numReviewed} / ${totalClips} clips reviewed`}
          testId="button-submit-review"
          text="Submit Review"
          tooltip="You must review all clips before submitting"
        />
      </div>
      <div className="clips" style={{ paddingTop: 40, overflowY: "auto" }}>
        <div className="clip" style={{ padding: 20 }}>
          {clubName}{" "}
          would like to feature some of your clips on their social media
          channels. Please approve any of your clips below to give them
          permission to share them. You can also download any clips and to use
          on your own channels.
        </div>
        {clips.map((clip) => {
          const approved = clip.reviewStatus === "approved";
          const rejected = clip.reviewStatus === "rejected";

          const clipClasses = classnames([
            "clip",
            {
              approved,
              rejected,
            },
          ]);

          return (
            <div
              className="flexRow"
              key={clip.id}
              ref={(el) => {
                if (clip.id && el) {
                  refContainer.current[clip.id] = el;
                }
              }}
            >
              <div className={clipClasses} style={{ flex: 1 }}>
                <ClipReview
                  key={clip.id}
                  clipData={{ ...clip, title: `${clip.title} ${clip.id}` }}
                  videoUrl={videoUrl}
                />
                <div className="clipComment">
                  <TextArea
                    value={clip.reviewComment}
                    onChange={(e) => handleChangeComment(clip.id, e)}
                    placeholder="Add a comment..."
                    xstyle={{ width: "100%" }}
                    rows={1}
                  />
                </div>
              </div>
              <div className="flexColumn reviewButtons">
                <Button
                  kind={approved ? "filledSuccess" : "outlineSuccess"}
                  iconLeft="check"
                  onClick={() => handleReview(clip.id, "approved")}
                  size="xlarge"
                  testId="button-review-approved-clip"
                  tooltip="Approve clip"
                  tooltipPosition="left"
                />
                <Button
                  kind={rejected ? "filledAlert" : "outlineAlert"}
                  iconLeft="cross"
                  onClick={() => handleReview(clip.id, "rejected")}
                  size="xlarge"
                  testId="button-review-rejected-clip"
                  tooltip="Reject clip"
                  tooltipPosition="left"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ReviewPage() {
  const enableReviewPage = useFeatureFlag("enable_review_page");

  if (!enableReviewPage) {
    throw new Error("Page not found");
  }

  return (
    <PageFrame>
      <ReviewPageContent />
    </PageFrame>
  );
}
