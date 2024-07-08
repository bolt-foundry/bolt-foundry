import { React } from "aws/client/deps.ts";
import { Link } from "aws/client/components/Link.tsx";
import { captureEvent } from "aws/events/mod.ts";
import { useAppEnvironment } from "aws/client/contexts/AppEnvironmentContext.tsx";
const { useEffect } = React;
type Props = {
  feature: string;
};

const styles: Record<string, React.CSSProperties> = {
  feature: {
    padding: 16,
    display: "flex",
    gap: 8,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  subtitle: {
    fontSize: 14,
    color: "var(--textSecondary)",
  },
};

export default function FeatureMenu({ feature }: Props) {
  const { currentViewer: { id: personId } } = useAppEnvironment();

  useEffect(() => {
    captureEvent("upsell", "opened", { feature }, personId);
  }, []);

  return (
    <div style={styles.feature}>
      <div style={styles.title}>{feature} not available on this plan</div>
      <div style={styles.subtitle}>
        Check out our{" "}
        <Link to="/pricing" data-bf-testid="link-pricing-upsell">
          pricing page
        </Link>{" "}
        to see other plans
      </div>
    </div>
  );
}
