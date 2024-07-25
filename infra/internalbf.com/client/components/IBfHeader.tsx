import { React } from "deps.ts";
import { Button } from "packages/bfDs/Button.tsx";
import { useIntersectionObserver } from "packages/client/hooks/useIntersectionObserver.ts";
import { classnames } from "lib/classnames.ts";

const { useState, useEffect } = React;

type Props = {
  expandedComponent?: React.ReactElement;
  collapsedButton?: string;
  header?: React.ReactNode;
};

export function IbfHeader(
  { expandedComponent, collapsedButton, header }: Props,
) {
  const { isVisible, domRef } = useIntersectionObserver();
  const [animateOn, setAnimateOn] = useState(false);
  const [showExpandedComponent, setShowExpandedComponent] = useState(false);

  useEffect(() => {
    if (isVisible === false) {
      setTimeout(() => setAnimateOn(true), 0);
    } else {
      setAnimateOn(false);
      setShowExpandedComponent(false);
    }
  }, [isVisible]);

  const handleClick = () => {
    setShowExpandedComponent(() => !showExpandedComponent);
  };

  const stickyClasses = classnames([
    "stickyHeader",
    "internalMainHeaderSticky",
    { visible: animateOn },
  ]);

  return (
    <>
      <div className="internalMainHeader" ref={domRef}>
        <div style={{ marginLeft: 20 }}>
          <h2>{header}</h2>
        </div>
        {expandedComponent}
      </div>
      <div className={stickyClasses}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2 className="stickyHeaderH2">{header}</h2>
          {collapsedButton
            ? <Button text={collapsedButton} onClick={handleClick} />
            : null}
        </div>
        {showExpandedComponent && expandedComponent}
      </div>
    </>
  );
}
