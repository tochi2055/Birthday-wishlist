"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { MapPin, Loader2 } from "lucide-react"

interface MoneyDonationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<void>
  isSubmitting: boolean
}

export function MoneyDonationModal({ isOpen, onClose, onSubmit, isSubmitting }: MoneyDonationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    amount: "",
    transferType: "belarus",
    message: "",
  })

  const [showInstructions, setShowInstructions] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
    setShowInstructions(true)
  }

  const handleTransferComplete = () => {
    setFormData({
      name: "",
      email: "",
      amount: "",
      transferType: "belarus",
      message: "",
    })
    setShowInstructions(false)
    onClose()
  }

  if (showInstructions) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center dark:bg-gray-800">
                <div className="w-3 h-2 bg-gray-400 rounded-sm"></div>
              </div>
              Bank Transfer Instructions
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Please use the following details to complete your donation.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg space-y-3 dark:bg-gray-800">
              <div className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="w-4 h-4" />
                Belarus Bank Transfer
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <strong>Bank:</strong> Belarusbank
                </div>
                <div>
                  <strong>Account Holder:</strong> Sarah Johnson
                </div>
                <div>
                  <strong>Account Number:</strong> BY86 AKBB 1010 0000 0029 6600 0000
                </div>
                <div>
                  <strong>BIC:</strong> AKBBBY2X
                </div>
                <div>
                  <strong>Amount:</strong> {formData.amount}
                </div>
                <div>
                  <strong>Reference:</strong> Birthday Gift - {formData.name}
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Important:</strong> Please include the reference "Birthday Gift - {formData.name}" in your
                transfer so we can identify your donation. You'll receive a confirmation email once the transfer is
                received.
              </p>
            </div>

            <Button onClick={handleTransferComplete} className="w-full bg-green-600 hover:bg-green-700 text-white">
              I've Made the Transfer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Money Donation</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-600 -mt-2 dark:text-gray-400">
          Contribute to Sarah's birthday with a money gift via bank transfer.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="donor-name">Your Name *</Label>
            <Input
              id="donor-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <Label htmlFor="donor-email">Email Address *</Label>
            <Input
              id="donor-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="$50"
              required
            />
          </div>

          <div>
            <Label>Transfer Type *</Label>
            <div className="flex gap-4 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="belarus"
                  checked={formData.transferType === "belarus"}
                  onCheckedChange={() => setFormData({ ...formData, transferType: "belarus" })}
                />
                <Label htmlFor="belarus" className="text-sm font-medium">
                  Belarus Bank
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="international"
                  checked={formData.transferType === "international"}
                  onCheckedChange={() => setFormData({ ...formData, transferType: "international" })}
                />
                <Label htmlFor="international" className="text-sm font-medium">
                  International
                </Label>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="donor-message">Message (optional)</Label>
            <Textarea
              id="donor-message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Birthday wishes..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              disabled={!formData.name || !formData.email || !formData.amount || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Get Transfer Instructions"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
