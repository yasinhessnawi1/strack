import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-600/10 via-background to-blue-600/10">
      <div className="w-full max-w-md">
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700',
              card: 'bg-background border shadow-2xl',
              headerTitle: 'text-foreground',
              headerSubtitle: 'text-muted-foreground',
              socialButtonsBlockButton: 'border hover:bg-muted',
              formFieldLabel: 'text-foreground',
              formFieldInput: 'bg-background border',
              footerActionLink: 'text-violet-500 hover:text-violet-600',
            },
          }}
        />
      </div>
    </div>
  );
}
