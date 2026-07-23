import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 animate-fadeUp">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold mb-2 text-ink">Welcome back</h1>
        <p className="text-body text-ink-muted">
          Sign in to save your analyses and track your history securely.
        </p>
      </div>
      
      <SignIn 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-card rounded-[24px] border border-hairline bg-surface p-8",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            socialButtonsBlockButton: "h-12 border border-hairline text-ink hover:bg-paper focus-ring rounded-full",
            dividerLine: "bg-hairline",
            dividerText: "text-ink-muted",
            formFieldLabel: "text-ink font-medium",
            formFieldInput: "h-12 border-hairline rounded-md focus:border-teal focus:ring-teal",
            formButtonPrimary: "h-12 bg-teal hover:bg-teal-dark text-surface font-semibold rounded-full",
            footerActionLink: "text-teal hover:text-teal-dark",
            identityPreviewEditButtonIcon: "text-teal",
            formFieldInputShowPasswordButton: "text-ink-muted"
          }
        }}
      />
    </div>
  );
}
