import { useEffect, useState } from "react";
import { iso } from "packages/app/__generated__/__isograph/iso.ts";
import { getLogger } from "packages/logger.ts";
import { BfDsTextArea } from "packages/bfDs/components/BfDsTextArea.tsx";
import { useMutation } from "packages/app/hooks/isographPrototypes/useMutation.tsx";
import reviseBlogMutation from "packages/app/__generated__/__isograph/Mutation/ReviseBlog/entrypoint.ts";
import { BfDsButton } from "packages/bfDs/components/BfDsButton.tsx";
import { BfDsCopyButton } from "packages/bfDs/components/BfDsCopyButton.tsx";
import { useEditor } from "packages/app/contexts/EditorContext.tsx";
const logger = getLogger(import.meta);

export const FormatterEditorPanel = iso(`
  field BfOrganization.FormatterEditorPanel @component {
    __typename
    creation {
      draftBlog
      revisions {
        __typename
      }
    }
  }
`)(
  function FormatterEditorPanel(
    { data },
  ) {
    logger.info("FormatterEditorPanel", data.__typename);
    const [isInFlight, setIsInFlight] = useState(false);
    const { blogPost, setBlogPost, textareaRef } = useEditor();
    const { commit } = useMutation(reviseBlogMutation);

    useEffect(() => {
      if (data?.creation?.draftBlog) {
        setBlogPost(data?.creation?.draftBlog);
      }
    }, [data?.creation?.draftBlog]);

    const fullEditorStyle = {
      flex: 1,
      width: "100%",
      border: "none",
      resize: "none" as const,
      borderRadius: "0",
      outline: "none",
      padding: 30,
    };

    return (
      <div className="flex1 flexColumn">
        <BfDsTextArea
          passedRef={textareaRef}
          onChange={(e) => {
            setBlogPost(e.target.value);
          }}
          value={blogPost}
          placeholder="Type or paste your blog post here... (or submit empty to use a sample post)"
          xstyle={fullEditorStyle}
          id="formatter-editor-textarea"
        />
        <div className="editor-actions flexRow gapMedium selfAlignEnd">
          <BfDsCopyButton kind="outlineDark" textToCopy={blogPost} />
          {blogPost.length > 0
            ? (
              <BfDsButton
                kind={data?.creation?.revisions ? "secondary" : "primary"}
                text="Get suggestions"
                onClick={() => {
                  setIsInFlight(true);
                  commit({ blogPost: blogPost }, {
                    onError: () => {
                      logger.error("An error occurred.");
                    },
                    onComplete: (reviseBlogMutationData) => {
                      setIsInFlight(false);
                      logger.debug(
                        "blog created successfully",
                        reviseBlogMutationData,
                      );
                    },
                  });
                }}
                showSpinner={isInFlight}
              />
            )
            : (
              <BfDsButton
                kind={data?.creation?.revisions ? "secondary" : "primary"}
                text="Get suggestions with demo post"
                onClick={() => {
                  setBlogPost(demoBlog);
                  setIsInFlight(true);
                  commit({ blogPost: demoBlog }, {
                    onError: () => {
                      logger.error("An error occurred.");
                    },
                    onComplete: (reviseBlogMutationData) => {
                      setIsInFlight(false);
                      logger.debug(
                        "blog created successfully",
                        reviseBlogMutationData,
                      );
                    },
                  });
                }}
                showSpinner={isInFlight}
              />
            )}
        </div>
      </div>
    );
  },
);

const demoBlog = `
**"Why My Cat is My Personal Trainer (and I’m Too Scared to Quit)"**  

Let’s be real: cats are basically tiny, furry dictators. Mine, Whiskers, has taken her reign to a whole new level by becoming my personal trainer. I didn’t sign up for this, but here we are. Every time I attempt a sit-up, she parks herself directly in front of me, tail flicking, staring me down like, *“Is that all you’ve got, human?”* It’s both motivating and deeply humiliating.  

Forget expensive gym memberships or trendy fitness apps—Whiskers has me on a rigorous routine. Squats? Oh, you mean “reaching for the treats on the top shelf” reps. She’s got me doing at least 20 a day, and if I slack off, she just knocks something breakable off the counter. Cardio? That’s her “chase the laser pointer” game, which is basically HIIT because she expects me to sprint around the house like a maniac.  

And don’t even get me started on her yoga skills. Whiskers is a natural at downward cat, and she judges my form relentlessly. I’ll be mid-pose, trying to channel my inner zen, and she’ll saunter over, plop down on my mat, and stretch out like, *“This is how it’s done, amateur.”*  

The best part? She doesn’t believe in rest days. If I dare to lounge on the couch for too long, she’s there, pawing at my face or biting my toes until I get up and “earn my keep.” Honestly, I’ve never been more active—or more terrified. Who needs a personal trainer when you have a furry drill sergeant who doubles as a cuddle bug?  

So, if you see me limping around the neighborhood, just know it’s not some intense CrossFit class. It’s Whiskers’ world, and I’m just living in it. :feet::muscle: #CatFitnessGoals #SendHelp
`;
