/** Teal aligned with mock and RetireReady brand */
const primary = "#149191";

/**
 * Shared Clerk UI customization — keeps Clerk handling auth; we control look & feel.
 * @see https://clerk.com/docs/customization/overview
 */
export const retireReadyAuthAppearance = {
  layout: {
    socialButtonsVariant: "blockButton",
    shimmer: false,
  },
  variables: {
    colorPrimary: primary,
    colorText: "#111827",
    colorTextSecondary: "#6b7280",
    colorBackground: "#ffffff",
    colorInputBackground: "#ffffff",
    colorInputText: "#111827",
    borderRadius: "0.75rem",
  },
  elements: {
    rootBox: "w-full mx-auto",
    card: "shadow-none border-0 bg-transparent p-0 gap-6",
    cardBox: "shadow-none border-0",
    main: "gap-6",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
    logoBox: "hidden",
    logoImage: "hidden",

    socialButtonsRoot: "flex flex-col gap-3 w-full",
    socialButtonsBlockButton:
      "w-full justify-center border border-slate-200 !bg-white !text-slate-800 hover:!bg-slate-50 rounded-xl h-11 font-medium shadow-sm",
    socialButtonsBlockButtonText: "text-slate-800 font-medium",
    socialButtonsProviderIcon: "size-5",

    dividerRow: "gap-4 my-2",
    dividerLine: "bg-slate-200",
    dividerText: "text-slate-400 text-xs uppercase tracking-wide",

    formFieldRow: "gap-2",
    formFieldLabel: "text-slate-700 text-sm font-medium",
    formFieldInput:
      "rounded-xl border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 h-11 px-3 focus:ring-2 focus:ring-[#149191]/25 focus:border-[#149191]",

    formButtonPrimary:
      "rounded-xl h-11 font-semibold text-base shadow-sm !bg-[#149191] hover:!bg-[#118080] !text-white",
    formButtonReset: "text-slate-600",

    footer: "text-center",
    footerAction: "text-slate-600 text-sm",
    footerActionLink: "text-[#149191] font-semibold hover:text-[#118080]",
    footerActionText: "text-slate-600",

    identityPreview: "rounded-xl border border-slate-200",
    identityPreviewText: "text-slate-800",
    identityPreviewEditButton: "text-[#149191]",

    formFieldSuccessText: "text-emerald-700",
    formFieldErrorText: "text-red-600 text-sm",
    alertText: "text-sm",

    otpCodeFieldInput: "rounded-xl border-slate-200",
    formResendCodeLink: "text-[#149191] font-medium",
  },
} as const;
