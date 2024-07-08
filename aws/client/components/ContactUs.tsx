import { React } from "aws/client/deps.ts";
import { fonts } from "aws/client/ui_components/ui_const.tsx";
import Button from "aws/client/ui_components/Button.tsx";
import Input from "aws/client/ui_components/Input.tsx";
import TextArea from "aws/client/ui_components/TextArea.tsx";
import { useFeatureFlag } from "aws/client/hooks/featureFlagHooks.tsx";
import { useAppEnvironment } from "aws/client/contexts/AppEnvironmentContext.tsx";

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

function HubSpotForm({ formId }: { formId: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { HUBSPOT_PORTAL_ID } = useAppEnvironment();
  const targetId = `hubspotForm-${formId}`;

  useEffect(() => {
    if (ref.current && HUBSPOT_PORTAL_ID) {
      const script = document.createElement("script");
      script.src = "https://js.hsforms.net/forms/embed/v2.js";
      script.async = true;
      script.onload = () => {
        // @ts-expect-error hbspot isn't typed
        if (window.hbspt) {
          // @ts-expect-error hbspot isn't typed
          window.hbspt.forms.create({
            portalId: HUBSPOT_PORTAL_ID,
            formId,
            target: `#${targetId}`,
          });
        }
      };
      ref.current.appendChild(script);
    }
    // Cleanup function
    return () => {
      if (ref.current) {
        ref.current.innerHTML = "";
      }
    };
  }, [HUBSPOT_PORTAL_ID, formId]);

  return <div ref={ref} id={targetId} />;
}

type Props = {
  showHeader?: boolean;
};

function ContactUs({ showHeader = true }: Props) {
  const { CONTACT_FORM_ID } = useAppEnvironment();
  const [submtting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    company_name: "",
    email: "",
    message: "",
  });

  if (CONTACT_FORM_ID) {
    return <HubSpotForm formId={CONTACT_FORM_ID} />;
  }

  // @ts-expect-error #techdebt
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const submitForm = async () => {
    try {
      const response = await fetch("/contact-us", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Handle successful submission, e.g., show a success message
        // deno-lint-ignore no-console
        console.log("Form submitted successfully");
        setFormData({
          name: "",
          phone: "",
          company_name: "",
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
              name="company_name"
              value={formData.company_name}
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

export default ContactUs;
