"use client";
import { useState, useEffect } from "react";
import {
  Github,
  Code2,
  DollarSign,
  Shield,
  TrendingUp,
  Zap,
} from "lucide-react";
import heroPattern from "@/assets/hero-pattern.jpg";
import { useSession, signIn } from "next-auth/react";

const Index = () => {
  const { data: session, status } = useSession();

  console.log("Session:", session, status);
  // Access token:
  useEffect(() => {
    if (status === "authenticated") {
      console.log("GitHub Access Token:", session?.accessToken);
    }
    console.log(status);
  }, [status]);
  useEffect(() => {
    console.log(session);
  }, [status]);
  if (session?.accessToken) {
    console.log("GitHub Access Token:", session.accessToken);
  }

  const [loading, setLoading] = useState(false);
  const handleGitHubSignIn = async () => {
    setLoading(true); // Assuming 'setLoading' is from a useState hook
    console.log("GitHub sign-in clicked");

    try {
      // This initiates the sign-in flow with the "github" provider
      // defined in your NextAuth config.
      await signIn("github");

      // Note: The signIn function will typically redirect the user.
      // The code after this line might not run immediately, or at all,
      // as the page will navigate away for authentication.
      // The loading state will effectively end when the page unloads.
    } catch (error) {
      // Handle any errors that might occur *before* the redirect
      console.error("Error initiating GitHub sign-in:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          // backgroundImage: url(${heroPattern}),
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(263,80%,12%)] via-[hsl(250,70%,8%)] to-[hsl(220,80%,10%)]" />

      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Branding & Features */}
          <div className="text-white space-y-8 lg:pr-12">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full px-4 py-2 text-sm">
                {/*<Zap className="w-4 h-4 text-accent" />*/}
                <span>Get paid for your code</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Earn Bounties on
                <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  GitHub Issues
                </span>
              </h1>

              <p className="text-lg text-gray-300">
                Connect your GitHub account and start earning rewards by solving
                real-world coding challenges. Quality code, instant rewards.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-card/10 backdrop-blur-sm border border-white/10">
                <div className="p-2 rounded-lg bg-accent/20">
                  {/*<Code2 className="w-5 h-5 text-accent" />*/}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Solve Issues</h3>
                  <p className="text-sm text-gray-400">
                    Browse open bounties and pick challenges that match your
                    skills
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-card/10 backdrop-blur-sm border border-white/10">
                <div className="p-2 rounded-lg bg-primary/20">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Earn Money</h3>
                  <p className="text-sm text-gray-400">
                    Get paid based on code quality and contribution impact
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-card/10 backdrop-blur-sm border border-white/10">
                <div className="p-2 rounded-lg bg-accent/20">
                  <Shield className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Secure Payments</h3>
                  <p className="text-sm text-gray-400">
                    Transparent escrow system ensures you get paid for your work
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-card/10 backdrop-blur-sm border border-white/10">
                <div className="p-2 rounded-lg bg-primary/20">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Build Reputation</h3>
                  <p className="text-sm text-gray-400">
                    Grow your developer profile with verified contributions
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                <span>1,247 Active Bounties</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span>$284K Paid Out</span>
              </div>
            </div>
          </div>

          {/* Right side - Login Card */}
          <div className="w-full max-w-md mx-auto">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-20 blur-2xl rounded-3xl" />

              {/* Card */}
              <div className="relative bg-card/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8 space-y-8">
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4">
                    <Github className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold">Welcome to BountyGit</h2>
                  <p className="text-muted-foreground">
                    Sign in with GitHub to start earning
                  </p>
                </div>

                <button
                  onClick={handleGitHubSignIn}
                  disabled={loading}
                  className="w-full h-12 text-base font-semibold inline-flex items-center justify-center gap-3 rounded-lg bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <Github className="w-5 h-5" />
                      <span>Continue with GitHub</span>
                    </>
                  )}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/50" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-2 text-muted-foreground">
                      Trusted by 10,000+ developers
                    </span>
                  </div>
                </div>

                {/* <div className="space-y-3">
                  {[
                    { icon: "✓", text: "Connect in seconds with OAuth", color: "text-accent" },
                    { icon: "✓", text: "No credit card required", color: "text-accent" },
                    { icon: "✓", text: "Start earning immediately", color: "text-accent" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <span className={font-bold ${item.color}}>{item.icon}</span>
                      <span className="text-muted-foreground">{item.text}</span>
                    </div>
                  ))}
                </div> */}

                <div className="pt-4 border-t border-border/50 text-center text-xs text-muted-foreground">
                  By continuing, you agree to our Terms of Service and Privacy
                  Policy
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
