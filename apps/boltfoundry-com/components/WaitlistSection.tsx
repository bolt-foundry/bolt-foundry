import { useCallback, useState } from "react";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import { BfDsForm } from "@bfmono/apps/bfDs/components/BfDsForm.tsx";
import { BfDsInput } from "@bfmono/apps/bfDs/components/BfDsInput.tsx";
import { BfDsFormSubmitButton } from "@bfmono/apps/bfDs/components/BfDsFormSubmitButton.tsx";
import { BfDsSpinner } from "@bfmono/apps/bfDs/components/BfDsSpinner.tsx";
import JoinWaitlistMutation from "../__generated__/__isograph/Mutation/JoinWaitlist/entrypoint.ts";
import { useMutation } from "../hooks/isographPrototypes/useMutation.tsx";
import { getLogger } from "@bolt-foundry/logger";

const logger = getLogger(import.meta);

/**
 * Form data interface for the waitlist signup
 */
export interface WaitlistFormData {
  name: string;
  email: string;
  company: string;
}

/**
 * Props for the WaitlistSection component
 */
export interface WaitlistSectionProps {
  /** Callback function to scroll to the top of the page */
  actionButton?: () => void;
}

/**
 * State for handling form submission and responses
 */
interface SubmissionState {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
}

/**
 * Waitlist section component with form for collecting user information
 * Includes proper form validation, loading states, and success/error handling
 */
export function WaitlistSection(
  { actionButton }: WaitlistSectionProps,
) {
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    isLoading: false,
    isError: false,
    isSuccess: false,
  });

  const joinWaitlistMutation = useMutation(JoinWaitlistMutation);

  const initialFormData: WaitlistFormData = {
    name: "",
    email: "",
    company: "",
  };

  const handleFormSubmit = useCallback((formData: WaitlistFormData) => {
    // Set loading state
    setSubmissionState({ ...submissionState, isLoading: true, isError: false });

    // Commit the mutation with form data
    // The response will be handled through joinWaitlistMutation.responseElement
    joinWaitlistMutation.commit({
      name: formData.name,
      email: formData.email,
      company: formData.company,
    }, {
      onError: () => {
        logger.error("Error joining waitlist");
        setSubmissionState({
          ...submissionState,
          isLoading: false,
          isError: true,
        });
      },
      onComplete: ({ joinWaitlist }) => {
        if (!joinWaitlist.success) {
          logger.error(joinWaitlist.message);
          setSubmissionState({
            ...submissionState,
            isLoading: false,
            isError: true,
          });
          return;
        }
        logger.info("Successfully joined waitlist");
        setSubmissionState({
          ...submissionState,
          isLoading: false,
          isError: false,
          isSuccess: true,
        });
      },
    });
  }, [joinWaitlistMutation]);

  return (
    <div className="waitlist-form-container">
      <div className="waitlist-form-header">
        <h2>Stay updated</h2>
        <p>
          Be the first to know when new features and improvements are ready. Get
          early access to enhanced AI tooling and structured prompt workflows.
        </p>
      </div>

      {/* Loading Spinner */}
      {submissionState.isLoading && (
        <div className="waitlist-form-loading flexRow alignItemsCenter gapSmall">
          <BfDsSpinner size={24} />
          <span>Joining waitlist...</span>
        </div>
      )}

      {/* Form */}
      {submissionState.isSuccess
        ? (
          <div>
            <h3>Thanks for joining the waitlist!</h3>
            We'll be in touch soon.
            {actionButton && (
              <div style={{ marginTop: 12 }}>
                <BfDsButton
                  variant="primary"
                  icon="arrowUp"
                  onClick={actionButton}
                >
                  Back to top
                </BfDsButton>
              </div>
            )}
          </div>
        )
        : (
          <BfDsForm
            initialData={initialFormData}
            onSubmit={handleFormSubmit}
            className="waitlist-form"
          >
            <BfDsInput
              name="name"
              label="Full Name"
              placeholder="Enter your full name"
              required
              type="text"
              autoComplete="name"
              disabled={submissionState.isLoading}
            />

            <BfDsInput
              name="email"
              label="Email Address"
              placeholder="Enter your email address"
              required
              type="email"
              autoComplete="email"
              disabled={submissionState.isLoading}
            />

            <BfDsInput
              name="company"
              label="Company"
              placeholder="Enter your company name"
              required
              type="text"
              autoComplete="organization"
              disabled={submissionState.isLoading}
            />

            <BfDsFormSubmitButton
              text={submissionState.isLoading ? "Joining" : "Join Waitlist"}
              variant="primary"
              size="medium"
              disabled={submissionState.isLoading}
              spinner={submissionState.isLoading}
            />
            {submissionState.isError && (
              <div>
                <h3>Oops!</h3>
                There was an error... email{" "}
                <a href="mailto:dan@boltfoundry.com">Dan</a>{" "}
                and we'll get in touch.
              </div>
            )}
          </BfDsForm>
        )}
    </div>
  );
}
