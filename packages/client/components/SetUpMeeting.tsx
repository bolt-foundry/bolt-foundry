import { React, ReactRelay } from "deps.ts";
import { graphql } from "packages/client/deps.ts";
import { fonts } from "packages/bfDs/const.tsx";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { BfDsInput } from "packages/bfDs/BfDsInput.tsx";
import type { BfDsTextArea } from "packages/bfDs/BfDsTextArea.tsx";
const { useMutation } = ReactRelay;

const { useState } = React;

const styles: Record<string, React.CSSProperties> = {
  mainTitle: {
    fontFamily: fonts.marketingFontFamily,
    fontSize: "max(16px, 3vw)",
    textAlign: "center",
    marginTop: 3,
  },
  formContainer: {
    width: "100%",
    maxWidth: "60rem",
    alignSelf: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "1vw",
    padding: "30px",
  },
  message: {
    height: "100px",
    fontFamily: fonts.fontFamily,
  },
  submitModal: {
    background: "var(--background)",
    margin: "20% 0",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    borderRadius: 15,
    border: "3px solid white",
    alignSelf: "center",
    padding: "0 1%",
  },
};

type Props = {
  showHeader?: boolean;
};

const contactUsMutation = await graphql`
  mutation SetUpMeetingSubmitFormMutation($input: SubmitContactFormInput!) {
    submitContactForm(input: $input) {
      success
      message
    }
  }
`;

export function SetUpMeeting({ showHeader = false }: Props) {
  const [submtting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [commit] = useMutation(contactUsMutation);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const submitForm = () => {
    setSubmitting(true);
    commit({
      variables: {
        input: formData,
      },
      onCompleted: () => {
        setSubmitted(true);
        setSubmitting(false);
        setTimeout(() => {
          setSubmitted(false);
          setFormData({
            name: "",
            email: "",
          });
        }, 2000);
      },
      onError: () => {
        setSubmitting(false);
        setError(true);
      },
    });
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitForm();
  };

  return (
    <div style={styles.formContainer}>
      <>
        {!submtting && !submitted && (
          <>
            {showHeader && (
              <h1 style={styles.mainTitle}>
                Contact us
              </h1>
            )}
            <form
              style={styles.form}
              onSubmit={handleSubmit}
            >
              <BfDsInput
                type="text"
                placeholder="Name"
                required={true}
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <BfDsInput
                type="email"
                placeholder="Email"
                required={true}
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <BfDsButton type="submit" text="Book a meeting" size="large" />
            </form>
          </>
        )}
        {submtting && (
          <h1 style={styles.mainTitle}>
            Submitting...
          </h1>
        )}
        {submitted &&
          (
            <h1 style={styles.mainTitle}>
              Submitted!
            </h1>
          )}
        {error && <div style={styles.mainTitle}>Error</div>}
      </>
    </div>
  );
}
