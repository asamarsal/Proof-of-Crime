"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useDeployContract } from "wagmi"
import { smartcontractbountyAbi } from "@/app/abi/smartcontractbountyAbi"
import { Loader2, Plus } from "lucide-react"
import { toast } from "sonner"

export function DeployBountyModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [usdcrimeAddress, setUsdcrimeAddress] = useState("")
  const [approvers, setApprovers] = useState("")
  const [requiredApprovals, setRequiredApprovals] = useState("")
  
  const { deployContract, isPending } = useDeployContract()

  const handleDeploy = async () => {
    try {
      if (!usdcrimeAddress || !approvers || !requiredApprovals) {
        toast.error("Please fill in all fields")
        return
      }

      const approverList = approvers.split(",").map((a) => a.trim())
      const approvals = parseInt(requiredApprovals)

      // NOTE: Bytecode is required for deployment. 
      // Since we don't have the compiled bytecode, this will fail if run.
      // You need to compile the Solidity contract and provide the bytecode here.
      const bytecode = "0x" // REPLACE WITH ACTUAL BYTECODE

      deployContract({
        abi: smartcontractbountyAbi,
        bytecode: bytecode as `0x${string}`,
        args: [usdcrimeAddress as `0x${string}`, approverList as `0x${string}`[], approvals],
      }, {
        onSuccess: (hash) => {
            toast.success("Contract deployment initiated!")
            setIsOpen(false)
        },
        onError: (error) => {
            toast.error("Deployment failed: " + error.message)
        }
      })

    } catch (error) {
      console.error(error)
      toast.error("An error occurred")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Deploy Bounty Contract
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deploy Smart Contract Bounty</DialogTitle>
          <DialogDescription>
            Deploy a new bounty contract instance. Requires USDCRIME address and approvers configuration.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="usdcrime">USDCRIME Address</Label>
            <Input
              id="usdcrime"
              placeholder="0x..."
              value={usdcrimeAddress}
              onChange={(e) => setUsdcrimeAddress(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="approvers">Approvers (comma separated)</Label>
            <Textarea
              id="approvers"
              placeholder="0x..., 0x..."
              value={approvers}
              onChange={(e) => setApprovers(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="required">Required Approvals</Label>
            <Input
              id="required"
              type="number"
              placeholder="2"
              value={requiredApprovals}
              onChange={(e) => setRequiredApprovals(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleDeploy} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Deploy Contract
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
