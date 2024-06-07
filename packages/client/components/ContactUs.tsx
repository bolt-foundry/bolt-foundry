import { React, ReactRelay } from "deps.ts";
import { graphql } from "packages/client/deps.ts";
import { fonts } from "packages/bfDs/const.tsx";
import { Button } from "packages/bfDs/Button.tsx";
import { Input } from "packages/bfDs/Input.tsx";
import { TextArea } from "packages/bfDs/TextArea.tsx";

// import { useFeatureFlag } from "packages/client/hooks/featureFlagHooks.ts";
// import { useAppEnvironment } from "packages/client/contexts/AppEnvironmentContext.ts";

const { useEffect, useRef, useState } = React;

const styles: Record<string, React.CSSProperties> = {
  mainTitle: {
    fontFamily: "Ubuntu",
    fontSize: "max(16px, 3vw)",
    textAlign: "center",
    marginTop: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1vw",
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

export function ContactUs({ showHeader = true }: Props) {
  const [submtting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    company: "",
    email: "",
    message: "",
  });

  // @ts-expect-error #techdebt
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const contactUsMutation = graphql`
    mutation ContactUsSubmitFormMutation($input: SubmitContactFormInput!) {
      submitContactForm(input: $input) {
        success
        message
      }
    }
  `;

  const submitForm = async () => {
    try {
      const response = await fetch("https://sheetdb.io/api/v1/j4zqewe3isc9r", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: [
            formData,
          ],
        }),
      });

      if (response.ok) {
        // Handle successful submission, e.g., show a success message
        // deno-lint-ignore no-console
        console.log("Form submitted successfully");
        setFormData({
          name: "",
          phone: "",
          company: "",
          email: "",
          message: "",
        });
        setSubmitting(false);
        setSubmitted(true);
      } else {
        // Handle submission error, e.g., show an error message
        // deno-lint-ignore no-console
        console.log("Form submission failed");
        setError(true);
      }
    } catch (error) {
      // Handle network or other errors
      // deno-lint-ignore no-console
      console.error("Error:", error);
      setError(true);
    }
  };
  // @ts-expect-error #techdebt
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    submitForm();
  };
  // const handleSubmittingModal = () => {
  //   setSubmitting(true);
  // };

  return (
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
            <Input
              label="Name"
              type="text"
              placeholder="Your name"
              required={true}
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <Input
              label="Phone number"
              type="phone"
              placeholder="(123) 456-7890"
              required={false}
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <Input
              label="Company name"
              type="text"
              placeholder="Company Name"
              required={false}
              name="company"
              value={formData.company}
              onChange={handleChange}
            />
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              required={true}
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextArea
              label="Message"
              placeholder="Write a message..."
              xstyle={styles.message}
              required={true}
              name="message"
              value={formData.message}
              onChange={handleChange}
            />
            <Button type="submit" text="Submit" size="xlarge" />
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
  );
}
