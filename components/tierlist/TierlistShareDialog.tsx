"use client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/Dialog"
import { Button } from "../ui/Button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs"
import { Label } from "../ui/Label"
import {
  Download,
  Copy,
  MessageSquare,
  Share2,
  Palette,
  Settings,
} from "lucide-react"
import { useState, useRef, useCallback } from "react"
import { toast } from "sonner"
import TierlistCanvas from "./TierlistCanvas"
import type { TierlistWithTiers } from "@/types/tierlist.type"
import { useValidateSession } from "@/lib/hooks"

interface TierlistShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tierlist: TierlistWithTiers
  userId: string
}

interface ShareSettings {
  includeUserInfo: boolean
  includeTitle: boolean
  includeDateRange: boolean
  includeGenres: boolean
  backgroundColor: string
  textColor: string
  quality: "high" | "medium" | "low"
}

export default function TierlistShareDialog({
  open,
  onOpenChange,
  tierlist,
}: TierlistShareDialogProps) {
  const { data: user } = useValidateSession()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPosting, setIsPosting] = useState(false)

  const [settings, setSettings] = useState<ShareSettings>({
    includeUserInfo: true,
    includeTitle: true,
    includeDateRange: true,
    includeGenres: true,
    backgroundColor: "#1e1e2e", // Use crust color from globals.css
    textColor: "#cdd6f4", // Use foreground color
    quality: "high",
  })

  const updateSetting = <K extends keyof ShareSettings>(
    key: K,
    value: ShareSettings[K],
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const generateImage = useCallback(async () => {
    if (!canvasRef.current) return null

    setIsGenerating(true)
    try {
      // Convert canvas to blob
      return new Promise<Blob>((resolve, reject) => {
        canvasRef.current?.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error("Failed to generate image"))
            }
          },
          "image/png",
          settings.quality === "high"
            ? 1.0
            : settings.quality === "medium"
              ? 0.8
              : 0.6,
        )
      })
    } catch (error) {
      toast.error("Failed to generate image")
      throw error
    } finally {
      setIsGenerating(false)
    }
  }, [settings.quality])

  const handleDownload = async () => {
    try {
      const blob = await generateImage()
      if (!blob) return

      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `tierlist-${tierlist.id}-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success("Tierlist image downloaded!")
    } catch (error) {
      toast.error("Failed to download image")
    }
  }

  const handleCopyImage = async () => {
    try {
      const blob = await generateImage()
      if (!blob) return

      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ])

      toast.success("Tierlist image copied to clipboard!")
    } catch (error) {
      toast.error("Failed to copy image")
    }
  }

  const handlePostToDiscord = async () => {
    setIsPosting(true)
    try {
      const blob = await generateImage()
      if (!blob) return

      const formData = new FormData()
      formData.append("file", blob, `tierlist-${tierlist.id}.png`)

      const userInfo = user?.name
        ? ` by <@${user?.accounts[0]?.providerAccountId}>`
        : "" // Simplified since user info is not in tierlist type
      const dateInfo = tierlist.watchDate
        ? ` (${new Date(tierlist.watchDate.from as string).toLocaleDateString()} - ${new Date(tierlist.watchDate.to as string).toLocaleDateString()})`
        : ""

      formData.append("content", `Tierlist ${userInfo}${dateInfo}!`)

      const response = await fetch("/api/tierlists/share/discord", {
        method: "POST",
        body: JSON.stringify({
          content: `Tierlist${userInfo}${dateInfo}!`,
          imageBlob: await blobToBase64(blob),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        toast.success("Tierlist posted to Discord!")
        onOpenChange(false)
      } else {
        // Get the error message from the response
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }))
        toast.error(errorData.error || "Failed to post to Discord")
      }
    } catch (error) {
      toast.error("Failed to post to Discord")
    } finally {
      setIsPosting(false)
    }
  }

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl w-[95vw] h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Tierlist
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-7 gap-4 flex-1 min-h-0">
          <div className="lg:col-span-3 xl:col-span-5 flex flex-col min-w-0 min-h-0">
            <h3 className="text-lg font-semibold mb-2">Preview</h3>
            <div className="flex-1 bg-muted rounded-lg overflow-hidden min-h-0">
              <div className="w-full h-full overflow-auto p-4">
                <div className="max-w-fit">
                  <TierlistCanvas
                    ref={canvasRef}
                    tierlist={tierlist}
                    settings={settings}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 xl:col-span-2 flex flex-col min-w-0 min-h-0">
            <Tabs defaultValue="settings" className="flex-1">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="settings"
                  className="flex items-center gap-1"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </TabsTrigger>
                <TabsTrigger value="share" className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  Share
                </TabsTrigger>
              </TabsList>

              <TabsContent value="settings" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Include in Image</h4>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="includeTitle"
                      checked={settings.includeTitle}
                      onChange={(e) =>
                        updateSetting("includeTitle", e.target.checked)
                      }
                      className="rounded"
                    />
                    <Label htmlFor="includeTitle">Title</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="includeUserInfo"
                      checked={settings.includeUserInfo}
                      onChange={(e) =>
                        updateSetting("includeUserInfo", e.target.checked)
                      }
                      className="rounded"
                    />
                    <Label htmlFor="includeUserInfo">User Info</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="includeDateRange"
                      checked={settings.includeDateRange}
                      onChange={(e) =>
                        updateSetting("includeDateRange", e.target.checked)
                      }
                      className="rounded"
                    />
                    <Label htmlFor="includeDateRange">Date Range</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="includeGenres"
                      checked={settings.includeGenres}
                      onChange={(e) =>
                        updateSetting("includeGenres", e.target.checked)
                      }
                      className="rounded"
                    />
                    <Label htmlFor="includeGenres">Genres</Label>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Appearance
                  </h4>

                  <div className="space-y-2">
                    <Label htmlFor="backgroundColor">Background Color</Label>
                    <input
                      type="color"
                      id="backgroundColor"
                      value={settings.backgroundColor}
                      onChange={(e) =>
                        updateSetting("backgroundColor", e.target.value)
                      }
                      className="w-full h-8 rounded"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="textColor">Text Color</Label>
                    <input
                      type="color"
                      id="textColor"
                      value={settings.textColor}
                      onChange={(e) =>
                        updateSetting("textColor", e.target.value)
                      }
                      className="w-full h-8 rounded"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quality">Quality</Label>
                    <select
                      id="quality"
                      value={settings.quality}
                      onChange={(e) =>
                        updateSetting(
                          "quality",
                          e.target.value as ShareSettings["quality"],
                        )
                      }
                      className="w-full p-2 border rounded"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                    <p className="text-xs text-muted-foreground">
                      💡 For Discord sharing, use &apos;Medium&apos; or
                      &apos;Low&apos; quality to avoid file size limits
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="share" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Export Options</h4>

                  <Button
                    onClick={handleDownload}
                    className="w-full"
                    disabled={isGenerating}
                    variant="outline"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Image
                  </Button>

                  <Button
                    onClick={handleCopyImage}
                    variant="outline"
                    className="w-full"
                    disabled={isGenerating}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy to Clipboard
                  </Button>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Discord Integration</h4>
                  <Button
                    onClick={handlePostToDiscord}
                    className="w-full"
                    variant="outline"
                    disabled={isPosting || isGenerating}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {isPosting ? "Posting..." : "Post to Discord"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
