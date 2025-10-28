"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";

import {
  Search,
  TrendingUp,
  Wallet,
  LogOut,
  ExternalLink,
  GitBranch,
  Loader2,
} from "lucide-react";

interface PullRequest {
  id: number;
  github_pr_id: number;
  github_pr_number: number;
  repo_name: string;
  title: string;
  contributor_id: number;
  complexity_score: number;
  estimated_payout: number;
  actual_payout: number | null;
  status: string;
  merged_at: string | null;
  paid_at: string | null;
  created_at: string;
}

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("bounty-high");
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [activeTab, setActiveTab] = useState<"bounties" | "prs">("bounties");
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [prLoading, setPrLoading] = useState(true);
  const [prError, setPrError] = useState<string | null>(null);
  const [prSearchQuery, setPrSearchQuery] = useState("");
  const [prFilterStatus, setPrFilterStatus] = useState("all");
  const { data: session, status } = useSession();

  const [userData, setUserData] = useState<any>(null);
  useEffect(() => {
    async function fetchUserProfile() {
      if (!session?.user?.id) return; // wait until session is ready

      try {
        const res = await fetch(
          `http://localhost:3001/api/users/${session.user.id}`,
        );
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);

        const data = await res.json();

        setUserData({
          name: data.github_username || session.user.name || "Unknown User",
          avatar:
            data.github_avatar_url ||
            session.user.image ||
            "/default-avatar.png",
          totalEarned: data.total_earnings || 0,
          completedBounties: data.completed_bounties || 0,
          avgAIScore: data.avg_ai_score || 0,
          topPercentile: data.top_percentile || "N/A",
        });
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    }

    fetchUserProfile();
  }, [session]);

  // Mock user data

  // Mock bounties data with issue URLs
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
      issueUrl: "https://github.com/RepoPulse/code-coin/issues/1",
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
      issueUrl: "https://github.com/RepoPulse/code-coin/issues/2",
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
      issueUrl: "https://github.com/RepoPulse/code-coin/issues/3",
    },
  ];

  useEffect(() => {
    if (activeTab === "prs") {
      fetchPullRequests();
    }
  }, [activeTab]);

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

  const fetchPullRequests = async () => {
    try {
      setPrLoading(true);
      setPrError(null);
      const response = await fetch(
        "https://stipendless-kameron-programmatic.ngrok-free.dev/api/contributor/installationid",
      );

      //const response = await fetch("http://localhost:8000/api/contributor/installationid")
      if (!response.ok) {
        throw new Error("Failed to fetch pull requests");
      }
      const data = await response.json();
      setPullRequests(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setPrError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching PRs:", err);
    } finally {
      setPrLoading(false);
    }
  };

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

  const filteredPRs = pullRequests
    .filter((pr) => prFilterStatus === "all" || pr.status === prFilterStatus)
    .filter(
      (pr) =>
        pr.title.toLowerCase().includes(prSearchQuery.toLowerCase()) ||
        pr.repo_name.toLowerCase().includes(prSearchQuery.toLowerCase()),
    );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "text-blue-400 border-blue-500/30";
      case "merged":
        return "text-purple-400 border-purple-500/30";
      case "closed":
        return "text-red-400 border-red-500/30";
      default:
        return "text-gray-400 border-gray-500/30";
    }
  };

  const getComplexityColor = (score: number) => {
    if (score <= 3) return "text-green-400 border-green-500/30";
    if (score <= 6) return "text-yellow-400 border-yellow-500/30";
    return "text-red-400 border-red-500/30";
  };

  const getComplexityLabel = (score: number) => {
    if (score <= 3) return "Easy";
    if (score <= 6) return "Medium";
    return "Hard";
  };

  // const handleConnectWallet = () => {
  //   setWalletConnected(true);
  //   setWalletAddress("0x742d...8f2a");
  //   setShowWalletModal(false);
  // };

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
          <Card className="glass-effect-strong border-red-900/30 w-full max-w-md depth-shadow bg-black">
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
          <Card className="glass-effect-strong border-red-900/30 w-full max-w-md depth-shadow bg-black">
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
          <Card className="glass-effect-strong border-red-900/20 hover:border-red-900/40 transition-all depth-shadow bg-black">
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
          <Card className="glass-effect-strong border-red-900/20 hover:border-red-900/40 transition-all depth-shadow bg-black">
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
          <Card className="glass-effect-strong border-red-900/20 hover:border-red-900/40 transition-all depth-shadow bg-black">
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

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="mb-8">
          {/* Tab Navigation */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setActiveTab("bounties")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === "bounties"
                  ? "bg-gradient-to-r from-red-700 to-red-800 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <span className="text-2xl">🎯</span>
              Available Bounties
            </button>
            <button
              onClick={() => setActiveTab("prs")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === "prs"
                  ? "bg-gradient-to-r from-red-700 to-red-800 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <GitBranch className="w-5 h-5" />
              Available PRs
            </button>
          </div>

          {/* Bounties Tab */}
          {activeTab === "bounties" && (
            <>
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
                    className="glass-effect-strong border-red-500/10 hover:border-red-500/30 transition-all depth-shadow hover:depth-shadow-lg bg-black"
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
                          <a
                            href={bounty.issueUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold px-6 py-2 rounded-lg text-sm depth-shadow flex items-center gap-2 transition-all"
                          >
                            View Issue
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* PRs Tab */}
          {activeTab === "prs" && (
            <>
              {/* Search and Filter Bar */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    type="text"
                    placeholder="Search pull requests..."
                    value={prSearchQuery}
                    onChange={(e) => setPrSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-black border border-red-900/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-red-700"
                  />
                </div>
                <select
                  value={prFilterStatus}
                  onChange={(e) => setPrFilterStatus(e.target.value)}
                  className="px-4 py-2 bg-black border border-red-900/30 rounded-lg text-white focus:outline-none focus:border-red-700"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="merged">Merged</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* PRs List */}
              {prLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                </div>
              ) : prError ? (
                <div className="p-6 bg-red-900/10 border border-red-900/30 rounded-lg">
                  <p className="text-red-400 font-medium">
                    Error loading pull requests
                  </p>
                  <p className="text-red-300 text-sm mt-1">{prError}</p>
                  <button
                    onClick={fetchPullRequests}
                    className="mt-4 px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-all"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPRs.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-gray-400">No pull requests found</p>
                    </div>
                  ) : (
                    filteredPRs.map((pr) => (
                      <Card
                        key={pr.id}
                        className="glass-effect-strong border-red-500/10 hover:border-red-500/30 transition-all depth-shadow hover:depth-shadow-lg bg-black"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-sm font-mono text-gray-400">
                                  {pr.repo_name}
                                </span>
                                <Badge
                                  variant="secondary"
                                  className={`glass-effect text-xs font-medium ${getStatusColor(pr.status)}`}
                                >
                                  {pr.status.charAt(0).toUpperCase() +
                                    pr.status.slice(1)}
                                </Badge>
                                <Badge
                                  variant="secondary"
                                  className={`glass-effect text-xs font-medium ${getComplexityColor(pr.complexity_score)}`}
                                >
                                  {getComplexityLabel(pr.complexity_score)}
                                </Badge>
                              </div>
                              <h3 className="text-lg font-bold text-white mb-2">
                                {pr.title}
                              </h3>
                              <div className="flex flex-wrap gap-2 text-sm text-gray-400">
                                <span>PR #{pr.github_pr_number}</span>
                                <span>•</span>
                                <span>
                                  Complexity: {pr.complexity_score}/10
                                </span>
                                {pr.merged_at && (
                                  <>
                                    <span>•</span>
                                    <span>
                                      Merged:{" "}
                                      {new Date(
                                        pr.merged_at,
                                      ).toLocaleDateString()}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-3">
                              <div className="text-right">
                                <div className="text-3xl font-black text-green-400">
                                  ${pr.actual_payout ?? pr.estimated_payout}
                                </div>
                                <p className="text-gray-500 text-xs">
                                  {pr.actual_payout ? "Paid" : "Estimated"}
                                </p>
                              </div>
                              <a
                                href={`https://github.com/${pr.repo_name}/pull/${pr.github_pr_number}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold px-6 py-2 rounded-lg text-sm depth-shadow flex items-center gap-2 transition-all"
                              >
                                View PR
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}