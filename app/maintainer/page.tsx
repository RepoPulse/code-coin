"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, Plus, Users, Wallet, LogOut } from "lucide-react"

export default function MaintainerDashboard() {
  const [showAddRepoModal, setShowAddRepoModal] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [newRepo, setNewRepo] = useState({ name: "", description: "", language: "" })
  const [repos, setRepos] = useState([
    {
      id: 1,
      name: "awesome-project",
      activeBounties: 5,
      contributors: 8,
      totalPaid: 1250,
    },
    {
      id: 2,
      name: "next-gen-app",
      activeBounties: 3,
      contributors: 5,
      totalPaid: 850,
    },
    {
      id: 3,
      name: "react-components",
      activeBounties: 7,
      contributors: 12,
      totalPaid: 2100,
    },
  ])

  const maintainerData = {
    name: "Sarah Maintainer",
    avatar: "/maintainer-avatar.jpg",
    availableBalance: 5000,
    activeBounties: 15,
    totalDistributed: 4200,
  }

  const recentPayments = [
    {
      id: 1,
      repo: "awesome-project",
      aiScore: "AI Score 94",
      title: "Fix authentication bug",
      contributor: "@alice_dev",
      amount: 250,
      date: "2025-10-20",
    },
    {
      id: 2,
      repo: "next-gen-app",
      aiScore: "AI Score 88",
      title: "Optimize database queries",
      contributor: "@bob_codes",
      amount: 500,
      date: "2025-10-18",
    },
  ]

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
}

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
              5000 USDC
            </div>
            <button
              onClick={() => setShowWalletModal(true)}
              className="px-4 py-2 rounded-lg glass-effect hover:glass-effect-strong text-white font-medium text-sm flex items-center gap-2 transition-all"
            >
              <Wallet className="w-4 h-4" />
              {walletConnected ? "Wallet" : "Connect"}
            </button>
            <button className="w-10 h-10 rounded-full bg-gradient-to-r from-red-700 to-red-800 flex items-center justify-center text-white font-bold depth-shadow">
              S
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
                  <p className="text-gray-400 text-sm">Connect your Stellar wallet to receive payments</p>
                  <Button
                    onClick={handleConnectWallet}
                    className="w-full bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-bold"
                  >
                    Connect with Albedo
                  </Button>
                </>
              ) : (
                <>
                  <div className="p-3 bg-red-900/10 rounded-lg border border-red-900/30">
                    <p className="text-gray-400 text-xs mb-1">Connected Wallet</p>
                    <p className="text-white font-mono text-sm">{walletAddress}</p>
                  </div>
                  <Button
                    onClick={() => {
                      setShowWithdrawModal(true)
                      setShowWalletModal(false)
                    }}
                    className="w-full bg-gradient-to-r from-green-700 to-green-800 hover:from-green-600 hover:to-green-700 text-white font-bold"
                  >
                    Withdraw USDC
                  </Button>
                  <Button
                    onClick={() => {
                      setWalletConnected(false)
                      setShowWalletModal(false)
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Amount (USDC)</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-2 bg-black border border-red-900/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-red-700"
                />
              </div>
              <p className="text-gray-400 text-xs">Available: 5000 USDC</p>
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
          {/* Wallet Card */}
          <Card className="glass-effect-strong border-red-900/20 hover:border-red-900/40 transition-all depth-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-400 text-sm font-medium">Wallet</CardTitle>
                <span className="text-lg">💰</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-green-500 mb-1">$5000</div>
              <p className="text-gray-500 text-xs">Available Balance</p>
            </CardContent>
          </Card>

          {/* Active Bounties Card */}
          <Card className="glass-effect-strong border-red-900/20 hover:border-red-900/40 transition-all depth-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-400 text-sm font-medium">Active</CardTitle>
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-white mb-1">15</div>
              <p className="text-gray-500 text-xs">Active Bounties</p>
            </CardContent>
          </Card>

          {/* Total Distributed Card */}
          <Card className="glass-effect-strong border-red-900/20 hover:border-red-900/40 transition-all depth-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-400 text-sm font-medium">Total</CardTitle>
                <Users className="w-4 h-4 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-yellow-500 mb-1">$4200</div>
              <p className="text-gray-500 text-xs">Total Distributed</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Your Repositories Section */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📚</span>
              <h2 className="text-2xl font-black text-white">Your Repositories</h2>
            </div>
            <Button
              onClick={() => setShowAddRepoModal(!showAddRepoModal)}
              className="bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-bold px-6 py-2 rounded-lg depth-shadow flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Connect Repo
            </Button>
          </div>

          {/* Add Repo Modal */}
          {showAddRepoModal && (
            <Card className="glass-effect-strong border-red-900/30 depth-shadow mb-6">
              <CardHeader>
                <CardTitle className="text-white">Add New Repository</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Repository Name</label>
                  <input
                    type="text"
                    value={newRepo.name}
                    onChange={(e) => setNewRepo({ ...newRepo, name: e.target.value })}
                    placeholder="e.g., my-awesome-project"
                    className="w-full px-4 py-2 bg-black border border-red-900/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-red-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={newRepo.description}
                    onChange={(e) => setNewRepo({ ...newRepo, description: e.target.value })}
                    placeholder="Describe your repository..."
                    className="w-full px-4 py-2 bg-black border border-red-900/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-red-700 resize-none"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                  <input
                    type="text"
                    value={newRepo.language}
                    onChange={(e) => setNewRepo({ ...newRepo, language: e.target.value })}
                    placeholder="e.g., TypeScript, Python, Go"
                    className="w-full px-4 py-2 bg-black border border-red-900/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-red-700"
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <Button
                    onClick={() => setShowAddRepoModal(false)}
                    className="px-4 py-2 rounded-lg glass-effect hover:glass-effect-strong text-white font-medium"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      if (newRepo.name && newRepo.description && newRepo.language) {
                        const repo = {
                          id: repos.length + 1,
                          name: newRepo.name,
                          activeBounties: 0,
                          contributors: 0,
                          totalPaid: 0,
                        }
                        setRepos([...repos, repo])
                        setNewRepo({ name: "", description: "", language: "" })
                        setShowAddRepoModal(false)
                      }
                    }}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-bold"
                  >
                    Add Repository
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Repositories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {repos.map((repo) => (
              <Card
                key={repo.id}
                className="glass-effect-strong border-red-900/20 hover:border-red-900/40 transition-all depth-shadow hover:depth-shadow-lg"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-white text-lg">{repo.name}</CardTitle>
                    <Settings className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-300" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Active Bounties</span>
                    <Badge variant="secondary" className="glass-effect text-yellow-500 border-yellow-900/30 font-bold">
                      {repo.activeBounties}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Contributors</span>
                    <span className="text-white font-bold">{repo.contributors}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-red-900/20">
                    <span className="text-gray-400 text-sm">Total Paid</span>
                    <span className="text-green-500 font-bold">${repo.totalPaid.toLocaleString()} USDC</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Bounty Payments Section */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">💸</span>
            <h2 className="text-2xl font-black text-white">Recent Bounty Payments</h2>
          </div>

          <div className="space-y-4">
            {recentPayments.map((payment) => (
              <Card
                key={payment.id}
                className="glass-effect-strong border-red-900/20 hover:border-red-900/40 transition-all depth-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-mono text-gray-400">{payment.repo}</span>
                        <Badge
                          variant="secondary"
                          className="glass-effect text-purple-400 border-purple-500/30 text-xs"
                        >
                          {payment.aiScore}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{payment.title}</h3>
                      <p className="text-gray-400 text-sm">Completed by {payment.contributor}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right">
                        <div className="text-2xl font-black text-green-400">${payment.amount}</div>
                        <p className="text-gray-500 text-xs">{payment.date}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
