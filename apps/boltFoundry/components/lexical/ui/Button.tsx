/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// import "apps/boltFoundry/components/lexical/ui/Button.css";

import type { JSX, ReactNode } from "react";

import joinClasses from "@bfmono/apps/boltFoundry/components/lexical/utils/join-classes.ts";

export default function Button({
  "data-test-id": dataTestId,
  children,
  className,
  onClick,
  disabled,
  small,
  title,
}: {
  "data-test-id"?: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick: () => void;
  small?: boolean;
  title?: string;
}): JSX.Element {
  return (
    <button
      disabled={disabled}
      className={joinClasses(
        "Button__root",
        disabled && "Button__disabled",
        small && "Button__small",
        className,
      )}
      onClick={onClick}
      title={title}
      aria-label={title}
      {...(dataTestId && { "data-test-id": dataTestId })}
    >
      {children}
    </button>
  );
}
