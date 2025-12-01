import { useTheme } from "next-themes";
import { Toaster as Sonner, toast as sonnerToast } from "sonner";
import { useEffect } from "react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  useEffect(() => {
    // Override default toast functions to add OK button
    const originalToast = sonnerToast;
    
    // Show backdrop when toast appears
    const showBackdrop = () => {
      const backdrop = document.getElementById('toast-backdrop');
      if (backdrop) backdrop.style.display = 'block';
    };
    
    const hideBackdrop = () => {
      setTimeout(() => {
        const toastElements = document.querySelectorAll('[data-sonner-toast]');
        if (toastElements.length === 0) {
          const backdrop = document.getElementById('toast-backdrop');
          if (backdrop) backdrop.style.display = 'none';
        }
      }, 100);
    };

    // Intercept toast calls
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          showBackdrop();
        } else if (mutation.removedNodes.length > 0) {
          hideBackdrop();
        }
      });
    });

    const toasterElement = document.querySelector('[data-sonner-toaster]');
    if (toasterElement) {
      observer.observe(toasterElement, { childList: true });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .sonner-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 9998;
          backdrop-filter: blur(4px);
          transition: opacity 0.2s;
        }
        
        [data-sonner-toaster] {
          z-index: 9999 !important;
        }
        
        [data-sonner-toast] {
          min-width: 400px !important;
          max-width: 500px !important;
          padding: 20px !important;
        }
        
        [data-sonner-toast] button[data-button],
        [data-sonner-toast] [data-action="true"] button {
          margin-left: auto !important;
          padding: 8px 24px !important;
          background: white !important;
          color: hsl(var(--primary)) !important;
          border-radius: 6px !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          border: none !important;
          font-size: 14px !important;
          display: inline-flex !important;
          align-items: center !important;
        }
        
        [data-sonner-toast] button[data-button]:hover,
        [data-sonner-toast] [data-action="true"] button:hover {
          opacity: 0.9 !important;
        }
        
        [data-content] {
          font-size: 15px !important;
          line-height: 1.5 !important;
        }
      `}</style>
      <div className="sonner-backdrop" id="toast-backdrop" style={{ display: 'none' }} />
      <Sonner
        theme={theme as ToasterProps["theme"]}
        className="toaster group"
        position="top-center"
        duration={4000}
        closeButton={false}
        toastOptions={{
          classNames: {
            toast:
              "group toast group-[.toaster]:bg-primary group-[.toaster]:text-primary-foreground group-[.toaster]:border-primary group-[.toaster]:shadow-2xl",
            description: "group-[.toast]:text-primary-foreground/90 group-[.toast]:text-base",
            actionButton: "!bg-white !text-primary !ml-auto !px-6 !py-2 !rounded-md !font-semibold !border-none hover:!opacity-90",
            cancelButton: "",
          },
        }}
        {...props}
      />
    </>
  );
};

// Create custom toast wrapper that adds OK button and dismisses previous toasts
const createToastWithOK = (toastFn: any) => {
  return (message: string, options?: any) => {
    // Dismiss all existing toasts before showing new one
    sonnerToast.dismiss();
    
    // Small delay to ensure previous toasts are cleared
    setTimeout(() => {
      return toastFn(message, {
        ...options,
        action: {
          label: 'OK',
          onClick: () => {},
        },
      });
    }, 100);
  };
};

const toast = {
  success: createToastWithOK(sonnerToast.success),
  error: createToastWithOK(sonnerToast.error),
  info: createToastWithOK(sonnerToast.info),
  warning: createToastWithOK(sonnerToast.warning),
  message: createToastWithOK(sonnerToast),
  dismiss: sonnerToast.dismiss,
};

export { Toaster, toast };
