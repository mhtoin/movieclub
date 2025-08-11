"use client"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import {
  useValidateSession,
  useLinkTMDBAccount,
  useProcessTMDBCallback,
} from "@/lib/hooks"
import { ExternalLink, Settings, User, Calendar, Link } from "lucide-react"
import { useEffect } from "react"

export default function Profile() {
  const { data: session, status, isLoading } = useValidateSession()

  const linkTMDBMutation = useLinkTMDBAccount()
  const processTMDBCallbackMutation = useProcessTMDBCallback()

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
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (status === "error" || !session) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">Access Denied</p>
      </div>
    )
  }

  const handleTMDBLink = () => {
    linkTMDBMutation.mutate()
  }

  const isConnected = session.tmdbSessionId && session.tmdbAccountId

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
          {/* Header */}
          <div className="border-b px-6 py-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Profile Settings
                </h1>
                <p className="text-muted-foreground">
                  Welcome back, {session.name}
                </p>
              </div>
            </div>
          </div>

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
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-3 block">
                        Name
                      </label>
                      <Input
                        value={session.name || ""}
                        readOnly
                        className="bg-muted/50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-3 block">
                        Email
                      </label>
                      <Input
                        value={session.email || ""}
                        readOnly
                        className="bg-muted/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">
                      User ID
                    </label>
                    <Input
                      value={session.id || ""}
                      readOnly
                      className="bg-muted/50 font-mono text-xs"
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-4">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Member since {new Date().getFullYear()}
                    </span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="integrations" className="space-y-6">
                <div className="space-y-6">
                  <div className="border rounded-lg p-6">
                    <div className="flex flex-col gap-4 lg:flex-row md:items-center justify-between mb-4">
                      <div className="flex flex-col gap-4 md:flex-row items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <ExternalLink className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            The Movie Database (TMDB)
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Connect your TMDB account for enhanced movie data
                            and recommendations
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-gray-300"}`}
                        ></div>
                        <span className="text-sm text-muted-foreground">
                          {isConnected ? "Connected" : "Not Connected"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-foreground mb-3 block">
                            Account ID
                          </label>
                          <Input
                            value={
                              session.tmdbAccountId
                                ? session.tmdbAccountId.toString()
                                : "Not connected"
                            }
                            readOnly
                            className="bg-muted/50"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground mb-3 block">
                            Session ID
                          </label>
                          <Input
                            value={
                              session.tmdbSessionId
                                ? "••••••••"
                                : "Not connected"
                            }
                            readOnly
                            className="bg-muted/50 font-mono"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          onClick={handleTMDBLink}
                          className="flex items-center space-x-2"
                          variant={"outline"}
                          disabled={linkTMDBMutation.isPending}
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>
                            {linkTMDBMutation.isPending
                              ? "Connecting..."
                              : isConnected
                                ? "Reconnect"
                                : "Connect"}{" "}
                            TMDB Account
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-6 opacity-50">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Settings className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-muted-foreground">
                          More Integrations
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Additional integrations coming soon...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
