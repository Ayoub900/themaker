"use client";

import type { ComponentProps } from "react";

/**
 * A submit button that asks "are you sure?" first. Used for anything that
 * deletes: the browser's own dialog is plain, but nobody has to learn it.
 */
export function ConfirmButton({
  confirm,
  onClick,
  ...props
}: ComponentProps<"button"> & { confirm: string }) {
  return (
    <button
      type="submit"
      {...props}
      onClick={(event) => {
        if (!window.confirm(confirm)) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
    />
  );
}
