"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2, Download, Sparkles, RefreshCw } from "lucide-react"

interface AILetterGeneratorProps {
  guestName?: string
  selectedItems?: Array<{ title: string; price?: string }>
}

export function AILetterGenerator({ guestName = "", selectedItems = [] }: AILetterGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedLetter, setGeneratedLetter] = useState("")

  const [formData, setFormData] = useState({
    celebrantName: "Sarah",
    guestName: guestName,
    relationship: "friend",
    tone: "warm and celebratory",
    personalMessage: "",
    letterStyle: "heartfelt",
  })

  const generateLetter = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          giftItems: selectedItems,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedLetter(data.letter)
      } else {
        alert("Sorry, there was an error generating your letter. Please try again.")
      }
    } catch (error) {
      console.error("Letter generation error:", error)
      alert("Sorry, there was an error generating your letter. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadAsPDF = () => {
    // Create a printable HTML version
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Birthday Letter for ${formData.celebrantName}</title>
          <style>
            body {
              font-family: 'Georgia', serif;
              line-height: 1.8;
              max-width: 600px;
              margin: 40px auto;
              padding: 40px;
              color: #333;
              background: white;
            }
            .letter-header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 2px solid #ec4899;
              padding-bottom: 20px;
            }
            .letter-content {
              white-space: pre-line;
              font-size: 16px;
              line-height: 1.8;
            }
            .letter-footer {
              margin-top: 40px;
              text-align: center;
              font-style: italic;
              color: #666;
            }
            @media print {
              body { margin: 0; padding: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="letter-header">
            <h1 style="color: #ec4899; margin: 0;">Happy Birthday ${formData.celebrantName}!</h1>
            <p style="margin: 10px 0 0 0; color: #666;">A Special Letter Just for You</p>
          </div>
          <div class="letter-content">${generatedLetter}</div>
          <div class="letter-footer">
            <p>Generated with love for ${formData.celebrantName}'s special day</p>
          </div>
        </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 text-purple-700 hover:bg-purple-100"
        >
          <Sparkles className="w-4 h-4" />
          Generate AI Letter
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI Birthday Letter Generator
          </DialogTitle>
          <DialogDescription>
            Create a personalized, heartfelt birthday letter to accompany your gift.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!generatedLetter ? (
            <>
              {/* Letter Configuration Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="celebrant-name">Birthday Person's Name</Label>
                  <Input
                    id="celebrant-name"
                    value={formData.celebrantName}
                    onChange={(e) => setFormData({ ...formData, celebrantName: e.target.value })}
                    placeholder="Sarah"
                  />
                </div>
                <div>
                  <Label htmlFor="guest-name-letter">Your Name</Label>
                  <Input
                    id="guest-name-letter"
                    value={formData.guestName}
                    onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                    placeholder="Your name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="relationship">Your Relationship</Label>
                  <Select
                    value={formData.relationship}
                    onValueChange={(value) => setFormData({ ...formData, relationship: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="family">Family Member</SelectItem>
                      <SelectItem value="colleague">Colleague</SelectItem>
                      <SelectItem value="partner">Partner</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="letter-style">Letter Style</Label>
                  <Select
                    value={formData.letterStyle}
                    onValueChange={(value) => setFormData({ ...formData, letterStyle: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="heartfelt">Heartfelt & Sincere</SelectItem>
                      <SelectItem value="casual">Casual & Friendly</SelectItem>
                      <SelectItem value="formal">Formal & Elegant</SelectItem>
                      <SelectItem value="humorous">Light & Humorous</SelectItem>
                      <SelectItem value="poetic">Poetic & Beautiful</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="tone">Tone & Mood</Label>
                <Input
                  id="tone"
                  value={formData.tone}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                  placeholder="e.g., warm and celebratory, joyful and excited"
                />
              </div>

              <div>
                <Label htmlFor="personal-message">Personal Touch (Optional)</Label>
                <Textarea
                  id="personal-message"
                  value={formData.personalMessage}
                  onChange={(e) => setFormData({ ...formData, personalMessage: e.target.value })}
                  placeholder="Any specific memories, inside jokes, or personal messages you'd like included..."
                  rows={3}
                />
              </div>

              {selectedItems.length > 0 && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Your Selected Gifts:</h4>
                  <ul className="text-sm text-purple-700">
                    {selectedItems.map((item, index) => (
                      <li key={index}>• {item.title}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-purple-600 mt-2">These will be naturally mentioned in your letter.</p>
                </div>
              )}

              <Button
                onClick={generateLetter}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                disabled={isGenerating || !formData.celebrantName || !formData.guestName}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Your Letter...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Letter
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              {/* Generated Letter Display */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-purple-800">Your Generated Letter</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setGeneratedLetter("")} className="gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Generate New
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadAsPDF} className="gap-2 bg-transparent">
                      <Download className="w-4 h-4" />
                      Print/Save
                    </Button>
                  </div>
                </div>

                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                  <CardHeader className="text-center border-b border-purple-200">
                    <CardTitle className="text-purple-800">Happy Birthday {formData.celebrantName}!</CardTitle>
                    <CardDescription className="text-purple-600">A Special Letter Just for You</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="whitespace-pre-line text-gray-800 leading-relaxed font-serif">
                      {generatedLetter}
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>💡 Tip:</strong> Click "Print/Save" to open a printer-friendly version. You can print it on
                    nice paper or save it as a PDF to include with your gift!
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
