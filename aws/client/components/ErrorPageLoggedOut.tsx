import { React } from "aws/client/deps.ts";
import LeftNav from "aws/client/components/LeftNav.tsx";
import Modal from "aws/client/ui_components/Modal.tsx";
import LoginForm from "aws/client/components/LoginForm.tsx";

const styles: Record<string, React.CSSProperties> = {
  pageContainer: {
    display: "flex",
    flexDirection: "row",
    height: "100%",
    position: "relative",
  },
  pageContent: {
    overflowY: "auto",
    flex: "auto",
  },
};

type Props = {
  error: Error;
};

export default function ErrorPageLoggedOut({ error }: Props) {
  return (
    <div style={styles.pageContainer}>
      <LeftNav />
      <div style={styles.pageContent}>
        Error {error.message}
      </div>
      <Modal header="You've been logged out, please log back in">
        <LoginForm />
      </Modal>
    </div>
  );
}
