import { Button } from "@/components/ui/Button"
import { Checkbox } from "@/components/ui/Checkbox"
import { Input } from "@/components/ui/Input"
import {
  Settings,
  Download,
  CheckCircle,
  XCircle,
  ExternalLink,
} from "lucide-react"

interface RadarrForm {
  radarrUrl: string
  radarrApiKey: string
  radarrRootFolder: string
  radarrQualityProfileId: number
  radarrMonitored: boolean
  radarrEnabled: boolean
}

interface TestMutation {
  isPending: boolean
  isSuccess: boolean
  isError: boolean
  data?: { message?: string }
  error?: { message?: string } | null
}

interface UpdateMutation {
  isPending: boolean
  isSuccess: boolean
  isError: boolean
  error?: { message?: string } | null
}

interface RadarrIntegrationProps {
  radarrForm: RadarrForm
  onFormChange: (field: string, value: string | number | boolean) => void
  onSave: () => Promise<void>
  onTest: () => Promise<void>
  testMutation: TestMutation
  updateMutation: UpdateMutation
  isConfigured: boolean
}

export function RadarrIntegration({
  radarrForm,
  onFormChange,
  onSave,
  onTest,
  testMutation,
  updateMutation,
  isConfigured,
}: RadarrIntegrationProps) {
  return (
    <div className="border rounded-lg p-6">
      <div className="flex flex-col gap-4 lg:flex-row md:items-center justify-between mb-4">
        <div className="flex flex-col gap-4 md:flex-row items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Download className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              Radarr (Movie Downloads)
            </h3>
            <p className="text-sm text-muted-foreground">
              Automatically download winning movies to your media server
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${isConfigured ? "bg-green-500" : "bg-gray-300"}`}
          ></div>
          <span className="text-sm text-muted-foreground">
            {isConfigured ? "Configured" : "Not Configured"}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Checkbox
            size="sm"
            checked={radarrForm.radarrEnabled}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onFormChange("radarrEnabled", e.target.checked)
            }
          />
          <label className="text-sm font-medium text-foreground">
            Enable Radarr Integration
          </label>
        </div>
        {radarrForm.radarrEnabled && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">
                  Radarr URL
                </label>
                <Input
                  value={radarrForm.radarrUrl}
                  onChange={(e) => onFormChange("radarrUrl", e.target.value)}
                  placeholder="http://localhost:7878"
                  className="bg-background"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">
                  API Key
                </label>
                <Input
                  value={radarrForm.radarrApiKey}
                  onChange={(e) => onFormChange("radarrApiKey", e.target.value)}
                  placeholder="Your Radarr API key"
                  type="password"
                  className="bg-background font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">
                  Root Folder
                </label>
                <Input
                  value={radarrForm.radarrRootFolder}
                  onChange={(e) =>
                    onFormChange("radarrRootFolder", e.target.value)
                  }
                  placeholder="/movies"
                  className="bg-background"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">
                  Quality Profile ID
                </label>
                <Input
                  value={radarrForm.radarrQualityProfileId.toString()}
                  onChange={(e) =>
                    onFormChange(
                      "radarrQualityProfileId",
                      parseInt(e.target.value) || 1,
                    )
                  }
                  placeholder="1"
                  type="number"
                  className="bg-background"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                size="sm"
                checked={radarrForm.radarrMonitored}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onFormChange("radarrMonitored", e.target.checked)
                }
              />
              <label className="text-sm font-medium text-foreground">
                Monitor movies for automatic downloads
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={onSave}
                className="flex items-center space-x-2"
                variant={"outline"}
                disabled={updateMutation.isPending}
              >
                <Settings className="w-4 h-4" />
                <span>
                  {updateMutation.isPending
                    ? "Saving..."
                    : "Save Configuration"}
                </span>
              </Button>

              {isConfigured && (
                <Button
                  onClick={onTest}
                  variant="outline"
                  className="flex items-center space-x-2"
                  disabled={testMutation.isPending}
                >
                  {testMutation.isPending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  ) : testMutation.isSuccess ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : testMutation.isError ? (
                    <XCircle className="w-4 h-4 text-red-500" />
                  ) : (
                    <ExternalLink className="w-4 h-4" />
                  )}
                  <span>
                    {testMutation.isPending ? "Testing..." : "Test Connection"}
                  </span>
                </Button>
              )}
            </div>

            {!isConfigured && radarrForm.radarrEnabled && (
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <div className="flex items-center space-x-2 text-blue-800">
                  <Settings className="w-4 h-4" />
                  <span className="text-sm font-medium">Save Required</span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  Please save your configuration first before testing the
                  connection.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
