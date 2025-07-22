import * as React from "react";
import { BfDsForm } from "@bfmono/apps/bfDs/components/BfDsForm.tsx";
import { BfDsInput } from "@bfmono/apps/bfDs/components/BfDsInput.tsx";
import { BfDsFormSubmitButton } from "@bfmono/apps/bfDs/components/BfDsFormSubmitButton.tsx";
import { BfDsSpinner } from "@bfmono/apps/bfDs/components/BfDsSpinner.tsx";
import JoinWaitlistMutation from "../__generated__/__isograph/Mutation/JoinWaitlist/entrypoint.ts";
import { useMutation } from "../hooks/isographPrototypes/useMutation.tsx";

const { useState, useCallback, useEffect } = React;

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
  /** Optional additional CSS classes */
  className?: string;
  /** Test ID for testing purposes */
  testId?: string;
}

/**
 * State for handling form submission and responses
 */
interface SubmissionState {
  isLoading: boolean;
}

/**
 * Waitlist section component with form for collecting user information
 * Includes proper form validation, loading states, and success/error handling
 */
export function WaitlistSection({ className, testId }: WaitlistSectionProps) {
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    isLoading: false,
  });

  const joinWaitlistMutation = useMutation(JoinWaitlistMutation);

  const initialFormData: WaitlistFormData = {
    name: "",
    email: "",
    company: "",
  };

  const handleFormSubmit = useCallback((formData: WaitlistFormData) => {
    // Set loading state
    setSubmissionState({ isLoading: true });

    // Commit the mutation with form data
    // The response will be handled through joinWaitlistMutation.responseElement
    joinWaitlistMutation.commit({
      name: formData.name,
      email: formData.email,
      company: formData.company,
    });
  }, [joinWaitlistMutation]);

  // Reset loading state when response is available
  useEffect(() => {
    if (joinWaitlistMutation.responseElement) {
      setSubmissionState({ isLoading: false });
    }
  }, [joinWaitlistMutation.responseElement]);

  const sectionClasses = [
    "substack-section",
    className,
  ].filter(Boolean).join(" ");

  return (
    <section className={sectionClasses} data-testid={testId}>
      <div className="landing-content">
        <div className="substack-form">
          <div className="waitlist-form-container">
            <div className="waitlist-form-header">
              <h2>Join the Waitlist</h2>
              <p>
                Be the first to know when new features and improvements are
                ready. Get early access to enhanced AI tooling and structured
                prompt workflows.
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
                text="Join Waitlist"
                variant="primary"
                size="medium"
                disabled={submissionState.isLoading}
                spinner={submissionState.isLoading}
              />
            </BfDsForm>

            {/* Mutation Response */}
            {joinWaitlistMutation.responseElement}
          </div>
        </div>
      </div>
    </section>
  );
}
