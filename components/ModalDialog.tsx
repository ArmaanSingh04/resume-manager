"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ModalDialogProps {
  /** Called after the dialog has closed (close button, Escape or backdrop click) */
  onClose: () => void;
  /** id of the element that names the dialog */
  labelledBy?: string;
  /** Extra classes for the full-screen dialog layer, e.g. the padding around the panel */
  className?: string;
  /** Receives a `close` function; closing through it lets the browser restore focus */
  children: (close: () => void) => ReactNode;
}

/**
 * Shared shell for the app's modals, built on the native <dialog> element:
 * traps focus, closes on Escape, renders above everything and dims the page behind.
 * Mount it to open; it calls onClose once it has closed so the parent can unmount it.
 */
export default function ModalDialog({ onClose, labelledBy, className, children }: ModalDialogProps) {
  // Kept in state (not a ref) so `close` can be handed to children during render
  const [dialog, setDialog] = useState<HTMLDialogElement | null>(null);
  // Only treat a click as a backdrop click if the press also started on the backdrop,
  // so selecting text inside the panel and releasing outside doesn't close it
  const pressedOnBackdrop = useRef(false);

  useEffect(() => {
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();

    // Keep the page behind from scrolling while the modal is open
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [dialog]);

  const close = () => dialog?.close();

  return (
    <dialog
      ref={setDialog}
      aria-labelledby={labelledBy}
      onClose={onClose}
      onPointerDown={(e) => {
        pressedOnBackdrop.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        // Clicks on the dialog element itself land on the area around the panel
        if (pressedOnBackdrop.current && e.target === e.currentTarget) close();
      }}
      className={cn(
        "fixed inset-0 m-0 h-dvh w-screen max-h-none max-w-none p-4 bg-transparent overflow-hidden open:flex items-center justify-center backdrop:bg-black/75 backdrop:backdrop-blur-sm",
        className
      )}
    >
      {children(close)}
    </dialog>
  );
}
