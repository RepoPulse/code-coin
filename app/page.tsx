"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RoleSelector } from "@/components/role-selector";
import { LokiTimelineBackground } from "@/components/loki-timeline-background";
import SignInPage from "@/components/SignInPage";
export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden">
      <SignInPage />
    </main>
  );
}
// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { RoleSelector } from "@/components/role-selector"
// import { LokiTimelineBackground } from "@/components/loki-timeline-background"

// export default function Home() {
//   const router = useRouter()
//   const [isLoaded, setIsLoaded] = useState(false)
//   const [selectedRole, setSelectedRole] = useState<"user" | "maintainer" | null>(null)

//   useEffect(() => {
//     setIsLoaded(true)
//   }, [])

//   const handleRoleSelect = (role: "user" | "maintainer") => {
//     setSelectedRole(role)
//   }

//   const handleGetStarted = () => {
//     if (selectedRole === "user") {
//       router.push("/user")
//     } else if (selectedRole === "maintainer") {
//       router.push("/maintainer")
//     }
//   }

//   return (
//     <main className="min-h-screen bg-background text-foreground overflow-hidden">
//       <LokiTimelineBackground />

//       {selectedRole === null && <RoleSelector onRoleSelect={handleRoleSelect} />}

//       {/* Success State */}
//       {selectedRole && (
//         <section className="relative w-full min-h-screen bg-black flex items-center justify-center px-6 py-20 overflow-hidden">
//           <div className="absolute inset-0 overflow-hidden pointer-events-none">
//             <div className="absolute top-20 right-20 w-96 h-96 bg-red-900/5 rounded-full blur-3xl" />
//             <div className="absolute bottom-20 left-20 w-96 h-96 bg-red-900/5 rounded-full blur-3xl" />
//             <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-red-800/3 rounded-full blur-3xl" />
//           </div>

//           <div className="relative z-10 text-center max-w-3xl">
//             <div className="mb-8 inline-block">
//               <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-700 to-red-800 flex items-center justify-center animate-pulse depth-shadow">
//                 <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center">
//                   <span className="text-3xl font-black text-transparent bg-gradient-to-r from-red-600 to-red-700 bg-clip-text">
//                     ✓
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <h2 className="text-5xl md:text-6xl font-black mb-6 text-white tracking-tight">
//               Welcome, {selectedRole === "user" ? "Contributor" : "Maintainer"}!
//             </h2>

//             <p className="text-lg text-gray-400 mb-12 leading-relaxed">
//               {selectedRole === "user"
//                 ? "You're ready to explore amazing projects and start contributing. Your journey to building an incredible portfolio starts now."
//                 : "You're ready to lead projects and build thriving communities. Let's shape the future of open source together."}
//             </p>

//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <button
//                 onClick={() => setSelectedRole(null)}
//                 className="px-8 py-4 rounded-xl glass-effect hover:glass-effect-strong text-white font-bold transition-all duration-300"
//               >
//                 Change Role
//               </button>
//               <button
//                 onClick={handleGetStarted}
//                 className="px-8 py-4 rounded-xl bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-bold transition-all duration-300 depth-shadow hover:depth-shadow-lg"
//               >
//                 Get Started
//               </button>
//             </div>
//           </div>
//         </section>
//       )}
//     </main>
//   )
// }
