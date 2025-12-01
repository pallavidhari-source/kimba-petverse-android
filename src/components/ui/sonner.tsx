import { useTheme } from "next-themes";
import { Toaster as Sonner, toast as sonnerToast } from "sonner";
import { useEffect } from "react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  useEffect(() => {
    // Show backdrop when any toast is displayed
    const handleToastChange = () => {
      const toastElements = document.querySelectorAll('[data-sonner-toast]');
      const backdrop = document.getElementById('toast-backdrop');
      if (backdrop) {
        backdrop.style.display = toastElements.length > 0 ? 'block' : 'none';
      }
    };

    // Use MutationObserver to detect toast changes
    const observer = new MutationObserver(handleToastChange);
    const toasterElement = document.querySelector('[data-sonner-toaster]');
    if (toasterElement) {
      observer.observe(toasterElement, { childList: true, subtree: true });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .sonner-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 9998;
          backdrop-filter: blur(2px);
          transition: opacity 0.2s;
        }
        
        [data-sonner-toaster] {
          z-index: 9999 !important;
        }
        
        [data-sonner-toast] {
          min-width: 400px;
          max-width: 500px;
        }
        
        .toast-ok-button {
          margin-left: auto;
          padding: 8px 24px;
          background: white;
          color: hsl(var(--primary));
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        
        .toast-ok-button:hover {
          opacity: 0.9;
        }
      `}</style>
      <div className="sonner-backdrop" id="toast-backdrop" style={{ display: 'none' }} />
      <Sonner
        theme={theme as ToasterProps["theme"]}
        className="toaster group"
        position="top-center"
        duration={Infinity}
        closeButton={false}
        toastOptions={{
          classNames: {
            toast:
              "group toast group-[.toaster]:bg-primary group-[.toaster]:text-primary-foreground group-[.toaster]:border-primary group-[.toaster]:shadow-2xl group-[.toaster]:p-6",
            description: "group-[.toast]:text-primary-foreground/90 group-[.toast]:text-base",
            actionButton: "toast-ok-button",
            cancelButton: "group-[.toast]:bg-primary-foreground/20 group-[.toast]:text-primary-foreground",
          },
        }}
        {...props}
      />
    </>
  );
};

// Wrapper functions that add OK button automatically
const toast = {
  success: (message: string) => {
    return sonnerToast.success(message, {
      action: {
        label: 'OK',
        onClick: () => {},
      },
    });
  },
  error: (message: string) => {
    return sonnerToast.error(message, {
      action: {
        label: 'OK',
        onClick: () => {},
      },
    });
  },
  info: (message: string) => {
    return sonnerToast.info(message, {
      action: {
        label: 'OK',
        onClick: () => {},
      },
    });
  },
  warning: (message: string) => {
    return sonnerToast.warning(message, {
      action: {
        label: 'OK',
        onClick: () => {},
      },
    });
  },
  message: (message: string) => {
    return sonnerToast.message(message, {
      action: {
        label: 'OK',
        onClick: () => {},
      },
    });
  },
  dismiss: sonnerToast.dismiss,
};

export { Toaster, toast };
