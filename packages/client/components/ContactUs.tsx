import { React, ReactRelay } from "packages/logger/logger.ts";
import { graphql } from "packages/client/deps.ts";
import { fonts } from "packages/bfDs/const.tsx";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { BfDsInput } from "packages/bfDs/BfDsInput.tsx";
import { BfDsTextArea } from "packages/bfDs/BfDsTextArea.tsx";
import { MarketingFrame } from "packages/client/components/MarketingFrame.tsx";
import { useRouter } from "packages/client/contexts/RouterContext.tsx";
const { useMutation } = ReactRelay;

const { useState } = React;

const styles: Record<string, React.CSSProperties> = {
  mainTitle: {
    fontFamily: "Ubuntu",
    fontSize: "max(16px, 3vw)",
    textAlign: "center",
    marginTop: 3,
  },
  error: {
    background: "var(--backgroundAlert)",
    padding: 12,
    borderRadius: 8,
    border: "1px solid var(--alert)",
    color: "var(--textOnDark)",
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
  mutation ContactUsSubmitFormMutation($input: SubmitContactFormInput!) {
    submitContactForm(input: $input) {
      success
      message
    }
  }
`;

export function ContactUs({ showHeader = true }: Props) {
  const { navigate } = useRouter();
  const [submtting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    company: "",
    email: "",
    message: "",
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
          navigate("/");
        }, 2000);
      },
      onError: (e) => {
        setSubmitting(false);
        setError(e.message);
      },
    });
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitForm();
  };

  return (
    <MarketingFrame>
      <div style={styles.formContainer}>
        <>
          {!submtting && !submitted && (
            <>
              {showHeader && (
                <h1 style={styles.mainTitle}>
                  Contact Us
                </h1>
              )}
              <form
                style={styles.form}
                onSubmit={handleSubmit}
              >
                <BfDsInput
                  label="Name"
                  type="text"
                  placeholder="Your name"
                  required={true}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                <BfDsInput
                  label="Phone number"
                  type="phone"
                  placeholder="(123) 456-7890"
                  required={false}
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <BfDsInput
                  label="Company name"
                  type="text"
                  placeholder="Company Name"
                  required={false}
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                />
                <BfDsInput
                  label="Email"
                  type="email"
                  placeholder="your@email.com"
                  required={true}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <BfDsTextArea
                  label="Message"
                  placeholder="Write a message..."
                  xstyle={styles.message}
                  required={true}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                />
                {error && (
                  <div style={styles.error}>
                    {error}
                    <br /> You can reach out to{" "}
                    <a href="mailto:support@boltfoundry.com">
                      support@boltfoundry.com
                    </a>{" "}
                    if you have any questions.
                  </div>
                )}
                <BfDsButton type="submit" text="Submit" size="xlarge" />
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
        </>
      </div>
    </MarketingFrame>
  );
}
