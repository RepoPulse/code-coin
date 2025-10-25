"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, Wallet, LogOut } from "lucide-react";

export default function UserDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("bounty-high");
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  // Mock user data
  const userData = {
    name: "Alex Developer",
    avatar: "/developer-avatar.png",
    totalEarned: 1250.5,
    completedBounties: 23,
    avgAIScore: 92,
    topPercentile: "Top 10%",
  };

  // Mock bounties data
  const allBounties = [
    {
      id: 1,
      repo: "react/react",
      difficulty: "medium",
      title: "Fix memory leak in useEffect cleanup",
      description:
        "Memory leak occurring in component unmount with async operations",
      amount: 250,
      aiScore: "AI 85",
      tags: ["React", "Bug Fix"],
    },
    {
      id: 2,
      repo: "vercel/next.js",
      difficulty: "hard",
      title: "Optimize image loading performance",
      description:
        "Improve image component lazy loading and reduce bundle size",
      amount: 500,
      aiScore: "AI 92",
      tags: ["Performance", "Feature"],
    },
    {
      id: 3,
      repo: "tailwindlabs/tailwindcss",
      difficulty: "easy",
      title: "Add new gradient utilities",
      description: "Implement gradient background utilities for v4.0",
      amount: 150,
      aiScore: "AI 78",
      tags: ["UI", "Feature"],
    },
  ];

  // Filter and sort bounties
  const filteredBounties = allBounties
    .filter(
      (b) => filterDifficulty === "all" || b.difficulty === filterDifficulty,
    )
    .filter(
      (b) =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.repo.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "bounty-high") return b.amount - a.amount;
      if (sortBy === "bounty-low") return a.amount - b.amount;
      if (sortBy === "ai-score")
        return Number.parseInt(b.aiScore) - Number.parseInt(a.aiScore);
      return 0;
    });

  // const handleConnectWallet = () => {
  //   setWalletConnected(true)
  //   setWalletAddress("0x742d...8f2a")
  //   setShowWalletModal(false)
  // }

  const handleConnectWallet = async () => {
    try {
      const albedo = (await import("@albedo-link/intent")).default;

      const result = await albedo.publicKey({
        token: "CodeCoin Wallet Connection",
      });

      if (result && result.pubkey) {
        setWalletConnected(true);
        setWalletAddress(result.pubkey);
        setShowWalletModal(false);
        console.log("Connected Stellar Address:", result.pubkey);
      } else {
        alert("Wallet connection failed or cancelled.");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Something went wrong while connecting to Albedo.");
    }
  };

  const handleWithdraw = () => {
    if (withdrawAmount && Number.parseFloat(withdrawAmount) > 0) {
      console.log(`Withdrawing ${withdrawAmount} USDC`);
      setWithdrawAmount("");
      setShowWithdrawModal(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect-strong border-b border-red-900/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-red-700 to-red-800 flex items-center justify-center text-white font-bold text-sm">
              &lt;/&gt;
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              CodeBounty
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-green-500 text-sm font-medium">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              1250.5 USDC
            </div>
            <button
              onClick={() => setShowWalletModal(true)}
              className="px-4 py-2 rounded-lg glass-effect hover:glass-effect-strong text-white font-medium text-sm flex items-center gap-2 transition-all"
            >
              <Wallet className="w-4 h-4" />
              {walletConnected ? "Wallet" : "Connect"}
            </button>
            <button className="w-10 h-10 rounded-full bg-gradient-to-r from-red-700 to-red-800 flex items-center justify-center text-white font-bold depth-shadow">
              A
            </button>
          </div>
        </div>
      </header>

      {/* Wallet Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="glass-effect-strong border-red-900/30 w-full max-w-md depth-shadow">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Wallet Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!walletConnected ? (
                <>
                  <p className="text-gray-400 text-sm">
                    Connect your Stellar wallet to receive payments
                  </p>
                  <Button
                    onClick={handleConnectWallet}
                    className="w-full bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-bold"
                  >
                    Connect Stellar Wallet
                  </Button>
                </>
              ) : (
                <>
                  <div className="p-3 bg-red-900/10 rounded-lg border border-red-900/30">
                    <p className="text-gray-400 text-xs mb-1">
                      Connected Wallet
                    </p>
                    <p className="text-white font-mono text-sm">
                      {walletAddress}
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setShowWithdrawModal(true);
                      setShowWalletModal(false);
                    }}
                    className="w-full bg-gradient-to-r from-green-700 to-green-800 hover:from-green-600 hover:to-green-700 text-white font-bold"
                  >
                    Withdraw USDC
                  </Button>
                  <Button
                    onClick={() => {
                      setWalletConnected(false);
                      setShowWalletModal(false);
                    }}
                    variant="outline"
                    className="w-full text-red-400 border-red-900/30 hover:bg-red-900/10"
                  >
                    Disconnect
                  </Button>
                </>
              )}
              <Button
                onClick={() => setShowWalletModal(false)}
                variant="outline"
                className="w-full text-gray-400 border-red-900/30 hover:bg-red-900/10"
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="glass-effect-strong border-red-900/30 w-full max-w-md depth-shadow">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <LogOut className="w-5 h-5" />
                Withdraw USDC
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount (USDC)
                </label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-2 bg-black border border-red-900/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-red-700"
                />
              </div>
              <p className="text-gray-400 text-xs">Available: 1250.5 USDC</p>
              <Button
                onClick={handleWithdraw}
                className="w-full bg-gradient-to-r from-green-700 to-green-800 hover:from-green-600 hover:to-green-700 text-white font-bold"
              >
                Confirm Withdrawal
              </Button>
              <Button
                onClick={() => setShowWithdrawModal(false)}
                variant="outline"
                className="w-full text-gray-400 border-red-900/30 hover:bg-red-900/10"
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Earned Card */}
          <Card className="glass-effect-strong border-red-900/20 hover:border-red-900/40 transition-all depth-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-400 text-sm font-medium">
                  Total Earned
                </CardTitle>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-green-500 mb-1">
                $1250.5
              </div>
              <p className="text-gray-500 text-xs">+12% this month</p>
            </CardContent>
          </Card>

          {/* Bounties Completed Card */}
          <Card className="glass-effect-strong border-red-900/20 hover:border-red-900/40 transition-all depth-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-400 text-sm font-medium">
                  Active
                </CardTitle>
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-white mb-1">23</div>
              <p className="text-gray-500 text-xs">Bounties Completed</p>
            </CardContent>
          </Card>

          {/* AI Score Card */}
          <Card className="glass-effect-strong border-red-900/20 hover:border-red-900/40 transition-all depth-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-400 text-sm font-medium">
                  Top 10%
                </CardTitle>
                <span className="text-yellow-500">⚡</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-yellow-500 mb-1">92</div>
              <p className="text-gray-500 text-xs">Avg AI Score</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Available Bounties Section */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🎯</span>
            <h2 className="text-2xl font-black text-white">
              Available Bounties
            </h2>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="text"
                placeholder="Search bounties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black border border-red-900/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-red-700"
              />
            </div>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-4 py-2 bg-black border border-red-900/30 rounded-lg text-white focus:outline-none focus:border-red-700"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-black border border-red-900/30 rounded-lg text-white focus:outline-none focus:border-red-700"
            >
              <option value="bounty-high">Highest Bounty</option>
              <option value="bounty-low">Lowest Bounty</option>
              <option value="ai-score">Best AI Score</option>
            </select>
          </div>

          {/* Bounties List */}
          <div className="space-y-4">
            {filteredBounties.map((bounty) => (
              <Card
                key={bounty.id}
                className="glass-effect-strong border-red-500/10 hover:border-red-500/30 transition-all depth-shadow hover:depth-shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-mono text-gray-400">
                          {bounty.repo}
                        </span>
                        <Badge
                          variant="secondary"
                          className={`glass-effect text-xs font-medium ${
                            bounty.difficulty === "easy"
                              ? "text-green-400 border-green-500/30"
                              : bounty.difficulty === "medium"
                                ? "text-yellow-400 border-yellow-500/30"
                                : "text-red-400 border-red-500/30"
                          }`}
                        >
                          {bounty.difficulty.charAt(0).toUpperCase() +
                            bounty.difficulty.slice(1)}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="glass-effect text-purple-400 border-purple-500/30 text-xs"
                        >
                          {bounty.aiScore}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        {bounty.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3">
                        {bounty.description}
                      </p>
                      <div className="flex gap-2">
                        {bounty.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="glass-effect text-gray-300 border-red-500/20 text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <div className="text-right">
                        <div className="text-3xl font-black text-green-400">
                          {bounty.amount}
                        </div>
                        <p className="text-gray-500 text-xs">USDC</p>
                      </div>
                      <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold px-6 py-2 rounded-lg text-sm depth-shadow">
                        View Issue
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
