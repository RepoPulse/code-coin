"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, Plus, Users, Wallet, LogOut, AlertCircle, User } from "lucide-react"
import * as StellarSdk from "@stellar/stellar-sdk"

export default function MaintainerDashboard() {
  const [showAddRepoModal, setShowAddRepoModal] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showAddIssueModal, setShowAddIssueModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [depositAmount, setDepositAmount] = useState("")
  const [walletAmount, setWalletAmount] = useState("0")
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [newRepo, setNewRepo] = useState({ name: "", description: "", language: "" })
  const [newIssue, setNewIssue] = useState({ title: "", repoName: "", issueNumber: "", bountyAmount: "" })

  const [userProfile, setUserProfile] = useState({
    name: "Darshan Gaikwad",
    email: "darshangaikwad117@gmail.com",
    picture: "https://avatars.githubusercontent.com/u/68278195?v=4",
    id: 68278195,
  })

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
  const [issues, setIssues] = useState([
    {
      id: 1,
      title: "Fix authentication bug",
      repoName: "awesome-project",
      issueNumber: 142,
      bountyAmount: 500,
      status: "open",
    },
    {
      id: 2,
      title: "Optimize database queries",
      repoName: "next-gen-app",
      issueNumber: 89,
      bountyAmount: 750,
      status: "open",
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
      const albedo = (await import("@albedo-link/intent")).default

      const result = await albedo.publicKey({
        token: "CodeCoin Wallet Connection",
      })

      if (result && result.pubkey) {
        setWalletConnected(true)
        setWalletAddress(result.pubkey)
        setShowWalletModal(false)
        console.log("Connected Stellar Address:", result.pubkey)
      } else {
        alert("Wallet connection failed or cancelled.")
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
      alert("Something went wrong while connecting to Albedo.")
    }
  }
const handleDeposit = async () => {
    if (!depositAmount || !walletConnected) {
      alert("Please connect wallet and enter amount")
      return
    }

    try {
      // Contract configuration
      const contractId = "CC457P2NWSB3BES7LBZXTVFHNULMNFNVT76O5AVQLLRKR22M5FQOJV7T"
      const rpcUrl = "https://soroban-testnet.stellar.org"
      const networkPassphrase = StellarSdk.Networks.TESTNET

      // Convert amount to stroops (1 XLM = 10,000,000 stroops)
      const amountInStroops = Math.floor(parseFloat(depositAmount) * 10_000_000)

      // Initialize contract
      const server = new StellarSdk.rpc.Server(rpcUrl)
      const contract = new StellarSdk.Contract(contractId)

      // Get source account
      const sourceAccount = await server.getAccount(walletAddress)

      // Build transaction to call fund_pool
      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase,
      })
        .addOperation(
          contract.call(
            "fund_pool",
            StellarSdk.Address.fromString(walletAddress).toScVal(), // from
            StellarSdk.nativeToScVal(amountInStroops, { type: "i128" }) // amount
          )
        )
        .setTimeout(30)
        .build()

      // Prepare transaction
      const preparedTransaction = await server.prepareTransaction(transaction)

      // Sign with Albedo
      const albedo = (await import("@albedo-link/intent")).default
      const signResult = await albedo.tx({
        xdr: preparedTransaction.toXDR(),
        network: "testnet",
        submit: true,
      })
              setWalletAmount(Math.floor(parseFloat(walletAmount) + parseFloat(depositAmount)).toString())


      if (signResult && signResult.signed_envelope_xdr) {
        console.log("Deposit successful!")
        console.log("Transaction hash:", signResult.tx_hash)
        alert(`Deposit successful! Amount: ${depositAmount} XLM\nTx: ${signResult.tx_hash}`)
        setWalletAmount(Math.floor(parseFloat(walletAmount) + parseFloat(depositAmount)).toString())
        setDepositAmount("")
        setShowDepositModal(false)
      }
    } catch (error) {
      console.error("Deposit error:", error)
      alert("Deposit failed: " + error?.message as any)
    }
  }
  const handleAddIssue = () => {
    if (newIssue.title && newIssue.repoName && newIssue.issueNumber && newIssue.bountyAmount) {
      const issue = {
        id: issues.length + 1,
        title: newIssue.title,
        repoName: newIssue.repoName,
        issueNumber: Number.parseInt(newIssue.issueNumber),
        bountyAmount: Number.parseFloat(newIssue.bountyAmount),
        status: "open",
      }
      setIssues([...issues, issue])
      setNewIssue({ title: "", repoName: "", issueNumber: "", bountyAmount: "" })
      setShowAddIssueModal(false)
    }
  }

  const handleWithdraw = () => {
    if (withdrawAmount) {
      console.log("Withdrawing:", withdrawAmount, "USDC")
      setWithdrawAmount("")
      setShowWithdrawModal(false)
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
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-green-500 text-sm font-medium">
                <div className=""></div>
               
              </div>
              <Button
                onClick={() => setShowDepositModal(true)}
                className="px-3 py-1 rounded-lg bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-600 hover:to-blue-700 text-white font-medium text-sm"
              >
                Deposit Money
              </Button>
            </div>
            <button
              onClick={() => setShowWalletModal(true)}
              className="px-4 py-2 rounded-lg glass-effect hover:glass-effect-strong text-white font-medium text-sm flex items-center gap-2 transition-all"
            >
              <Wallet className="w-4 h-4" />
              {walletConnected ? "Wallet" : "Connect"}
            </button>
            <button
              onClick={() => setShowProfileModal(true)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold depth-shadow overflow-hidden border-2 border-red-700 hover:border-red-600 transition-all"
              title={userProfile.name}
            >
              <img
                src={userProfile.picture || "/placeholder.svg"}
                alt={userProfile.name}
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="glass-effect-strong border-red-900/30 w-full max-w-md depth-shadow bg-black">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Deposit Money
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-400 text-sm">Add funds to your bounty pool to create and fund new bounties</p>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Amount (USDC)</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-2 bg-black border border-red-900/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-red-700"
                />
              </div>
              <div className="p-3 bg-blue-900/10 rounded-lg border border-blue-900/30">
                <p className="text-gray-400 text-xs mb-1">Deposit will be added to your bounty pool</p>
                <p className="text-white font-bold text-sm">{depositAmount || "0"} USDC</p>
              </div>
              <Button
                onClick={handleDeposit}
                className="w-full bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-600 hover:to-blue-700 text-white font-bold"
              >
                Confirm Deposit
              </Button>
              <Button
                onClick={() => setShowDepositModal(false)}
                variant="outline"
                className="w-full text-gray-400 border-red-900/30 hover:bg-red-900/10"
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="glass-effect-strong border-red-900/30 w-full max-w-md depth-shadow bg-black">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                User Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center gap-4">
                <img
                  src={userProfile.picture || "/placeholder.svg"}
                  alt={userProfile.name}
                  className="w-20 h-20 rounded-full border-2 border-red-700 object-cover"
                />
                <div className="text-center">
                  <h3 className="text-lg font-bold text-white">{userProfile.name}</h3>
                  <p className="text-gray-400 text-sm">{userProfile.email}</p>
                  <p className="text-gray-500 text-xs mt-1">GitHub ID: {userProfile.id}</p>
                </div>
              </div>
              <div className="border-t border-red-900/20 pt-4 space-y-2">
                <Button
                  onClick={() => setShowProfileModal(false)}
                  className="w-full bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-bold"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setShowProfileModal(false)
                    // Add logout functionality here
                  }}
                  variant="outline"
                  className="w-full text-red-400 border-red-900/30 hover:bg-red-900/10 flex items-center gap-2 justify-center"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
          <Card className="glass-effect-strong border-red-900/30 w-full max-w-md depth-shadow bg-black">
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
              <p className="text-gray-400 text-xs">Available: {walletAmount}</p>
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
          <Card className="glass-effect-strong border-red-900/20 hover:border-red-900/40 transition-all depth-shadow bg-black">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-400 text-sm font-medium">Wallet</CardTitle>
                <span className="text-lg">💰</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-green-500 mb-1">${walletAmount}</div>
              <p className="text-gray-500 text-xs">Available Balance</p>
            </CardContent>
          </Card>

          {/* Active Bounties Card */}
          <Card className="glass-effect-strong border-red-900/20 hover:border-red-900/40 transition-all depth-shadow bg-black">
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
          <Card className="glass-effect-strong border-red-900/20 hover:border-red-900/40 transition-all depth-shadow bg-black">
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
            <Card className="glass-effect-strong border-red-900/30 depth-shadow mb-6 bg-black">
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
                className="glass-effect-strong border-red-900/20 hover:border-red-900/40 transition-all depth-shadow hover:depth-shadow-lg bg-black"
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

        {/* Add Issue Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <h2 className="text-2xl font-black text-white">Active Issues</h2>
            </div>
            <Button
              onClick={() => setShowAddIssueModal(!showAddIssueModal)}
              className="bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-bold px-6 py-2 rounded-lg depth-shadow flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Issue
            </Button>
          </div>

          {/* Add Issue Modal */}
          {showAddIssueModal && (
            <Card className="glass-effect-strong border-red-900/30 depth-shadow mb-6 bg-black">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Create New Issue
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Issue Title</label>
                  <input
                    type="text"
                    value={newIssue.title}
                    onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                    placeholder="e.g., Fix authentication bug"
                    className="w-full px-4 py-2 bg-black border border-red-900/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-red-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Repository Name</label>
                  <input
                    type="text"
                    value={newIssue.repoName}
                    onChange={(e) => setNewIssue({ ...newIssue, repoName: e.target.value })}
                    placeholder="e.g., awesome-project"
                    className="w-full px-4 py-2 bg-black border border-red-900/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-red-700"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Issue Number</label>
                    <input
                      type="number"
                      value={newIssue.issueNumber}
                      onChange={(e) => setNewIssue({ ...newIssue, issueNumber: e.target.value })}
                      placeholder="e.g., 142"
                      className="w-full px-4 py-2 bg-black border border-red-900/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-red-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Bounty Amount (USDC)</label>
                    <input
                      type="number"
                      value={newIssue.bountyAmount}
                      onChange={(e) => setNewIssue({ ...newIssue, bountyAmount: e.target.value })}
                      placeholder="e.g., 500"
                      className="w-full px-4 py-2 bg-black border border-red-900/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-red-700"
                    />
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <Button
                    onClick={() => setShowAddIssueModal(false)}
                    className="px-4 py-2 rounded-lg glass-effect hover:glass-effect-strong text-white font-medium"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddIssue}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-bold"
                  >
                    Create Issue
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Issues List */}
          <div className="space-y-4">
            {issues.map((issue) => (
              <Card
                key={issue.id}
                className="glass-effect-strong border-red-900/20 hover:border-red-900/40 transition-all depth-shadow bg-black"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="secondary" className="glass-effect text-blue-400 border-blue-500/30 text-xs">
                          #{issue.issueNumber}
                        </Badge>
                        <span className="text-sm font-mono text-gray-400">{issue.repoName}</span>
                        <Badge variant="secondary" className="glass-effect text-green-400 border-green-500/30 text-xs">
                          {issue.status}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{issue.title}</h3>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right">
                        <div className="text-2xl font-black text-yellow-400">${issue.bountyAmount}</div>
                        <p className="text-gray-500 text-xs">Bounty</p>
                      </div>
                    </div>
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
                className="glass-effect-strong border-red-900/20 hover:border-red-900/40 transition-all depth-shadow bg-black"
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