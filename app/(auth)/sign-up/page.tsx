import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#0A0907] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-[#FFFDF8] mb-1">
            <span className="text-[#C4973F]">venn</span>
          </h1>
          <p className="text-[#555] text-sm">Create your account</p>
        </div>
        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-[#1A1814] border border-[#2A2720] shadow-none rounded-lg",
              headerTitle: "text-[#FFFDF8] font-serif",
              headerSubtitle: "text-[#555]",
              socialButtonsBlockButton:
                "bg-[#0F0E0B] border border-[#2A2720] text-[#FFFDF8] hover:bg-[#1A1814]",
              formFieldInput:
                "bg-[#0F0E0B] border-[#2A2720] text-[#FFFDF8] focus:border-[#C4973F]",
              formFieldLabel: "text-[#888]",
              formButtonPrimary:
                "bg-[#C4973F] text-[#0A0907] hover:bg-[#E8B44B]",
              footerActionLink: "text-[#C4973F]",
              dividerLine: "bg-[#2A2720]",
              dividerText: "text-[#555]",
            },
          }}
        />
      </div>
    </div>
  );
}
