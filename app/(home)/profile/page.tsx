"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import {
  useValidateSession,
  useLinkTMDBAccount,
  useProcessTMDBCallback,
  useRadarrSettings,
  useUpdateRadarrSettings,
  useTestRadarrConnection,
} from "@/lib/hooks"
import { Settings, Link } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import {
  LoadingState,
  ProfileHeader,
  GeneralTab,
  TMDBIntegration,
  RadarrIntegration,
} from "@/components/profile"

export default function Profile() {
  const { data: session, status, isLoading } = useValidateSession()
  const { data: radarrSettings } = useRadarrSettings()
  const updateRadarrMutation = useUpdateRadarrSettings()
  const testRadarrMutation = useTestRadarrConnection()

  const linkTMDBMutation = useLinkTMDBAccount()
  const processTMDBCallbackMutation = useProcessTMDBCallback()

  // Radarr form state
  const [radarrForm, setRadarrForm] = useState({
    radarrUrl: "",
    radarrApiKey: "",
    radarrRootFolder: "",
    radarrQualityProfileId: 1,
    radarrMonitored: true,
    radarrEnabled: false,
  })

  // Update form when settings are loaded
  useEffect(() => {
    if (radarrSettings) {
      setRadarrForm({
        radarrUrl: radarrSettings.radarrUrl || "",
        radarrApiKey: radarrSettings.radarrApiKey || "",
        radarrRootFolder: radarrSettings.radarrRootFolder || "",
        radarrQualityProfileId: radarrSettings.radarrQualityProfileId || 1,
        radarrMonitored: radarrSettings.radarrMonitored ?? true,
        radarrEnabled: radarrSettings.radarrEnabled ?? false,
      })
    }
  }, [radarrSettings])

  // Handle TMDB callback on page load
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const requestToken = searchParams.get("request_token")
    const approved = searchParams.get("approved")

    if (
      requestToken &&
      approved === "true" &&
      session?.id &&
      !processTMDBCallbackMutation.isPending
    ) {
      processTMDBCallbackMutation.mutate({
        requestToken,
        userId: session.id,
      })

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [session?.id, processTMDBCallbackMutation])

  if (isLoading || status === "pending") {
    return <LoadingState isLoading={true} />
  }

  if (status === "error" || !session) {
    return <LoadingState hasError={true} />
  }

  const handleTMDBLink = () => {
    linkTMDBMutation.mutate()
  }

  const handleRadarrSave = async () => {
    try {
      await updateRadarrMutation.mutateAsync(radarrForm)
      toast.success("Radarr settings saved successfully!")
    } catch (error) {
      toast.error("Failed to save Radarr settings")
    }
  }

  const handleRadarrTest = async () => {
    try {
      const result = await testRadarrMutation.mutateAsync()
      if (result.success) {
        toast.success("Radarr connection successful!")
      } else {
        toast.error(result.error || "Connection failed")
      }
    } catch (error) {
      toast.error("Connection test failed")
    }
  }

  const handleRadarrFormChange = (
    field: string,
    value: string | number | boolean,
  ) => {
    setRadarrForm((prev) => ({ ...prev, [field]: value }))
  }

  const isConnected = !!(session.tmdbSessionId && session.tmdbAccountId)
  const isRadarrConfigured = !!(
    radarrSettings?.radarrEnabled &&
    radarrSettings?.radarrUrl &&
    radarrSettings?.radarrApiKey
  )

  return (
    <div className="min-h-screen bg-background pt-20 ">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {processTMDBCallbackMutation.isPending && (
          <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-800">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
              Processing TMDB connection...
            </div>
          </div>
        )}
        <div className="bg-card rounded-lg shadow-sm border">
          <ProfileHeader userName={session.name || "User"} />
          <div className="p-6">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="general"
                  className="flex items-center space-x-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>General</span>
                </TabsTrigger>
                <TabsTrigger
                  value="integrations"
                  className="flex items-center space-x-2"
                >
                  <Link className="w-4 h-4" />
                  <span>Integrations</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                <GeneralTab session={session} />
              </TabsContent>

              <TabsContent value="integrations" className="space-y-6">
                <div className="space-y-6">
                  <TMDBIntegration
                    session={session}
                    isConnected={isConnected}
                    onConnect={handleTMDBLink}
                    isConnecting={linkTMDBMutation.isPending}
                  />

                  <RadarrIntegration
                    radarrForm={radarrForm}
                    onFormChange={handleRadarrFormChange}
                    onSave={handleRadarrSave}
                    onTest={handleRadarrTest}
                    testMutation={testRadarrMutation}
                    updateMutation={updateRadarrMutation}
                    isConfigured={isRadarrConfigured}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
