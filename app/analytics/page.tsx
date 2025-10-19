"use client";

import { PageLayout } from "@/components/page-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AnalyticsPage() {
  return (
    <PageLayout title="Analytics">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Analytics</h1>

        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Document Analysis</CardTitle>
                  <CardDescription>
                    Document uploads and views over time
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <div className="w-full h-full flex items-center justify-center bg-muted/30 rounded-md">
                    <p className="text-muted-foreground">
                      Chart visualization will be implemented
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Engagement</CardTitle>
                  <CardDescription>
                    User activity and engagement metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <div className="w-full h-full flex items-center justify-center bg-muted/30 rounded-md">
                    <p className="text-muted-foreground">
                      Chart visualization will be implemented
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Keyword Usage</CardTitle>
                  <CardDescription>
                    Most frequently highlighted keywords
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <div className="w-full h-full flex items-center justify-center bg-muted/30 rounded-md">
                    <p className="text-muted-foreground">
                      Chart visualization will be implemented
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Comment Activity</CardTitle>
                  <CardDescription>
                    Comment frequency and trends
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <div className="w-full h-full flex items-center justify-center bg-muted/30 rounded-md">
                    <p className="text-muted-foreground">
                      Chart visualization will be implemented
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Document Analytics</CardTitle>
                <CardDescription>
                  Detailed document usage statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      Most Viewed Documents
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          title: "Vermont Healthcare Reform Act 2023",
                          views: 245,
                          keywords: 32,
                        },
                        {
                          title: "Green Mountain Care Board Annual Report",
                          views: 187,
                          keywords: 28,
                        },
                        {
                          title: "Medicaid Expansion Analysis",
                          views: 156,
                          keywords: 24,
                        },
                        {
                          title: "Rural Healthcare Access Initiative",
                          views: 134,
                          keywords: 19,
                        },
                        {
                          title: "Payment Reform White Paper",
                          views: 112,
                          keywords: 22,
                        },
                      ].map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-md"
                        >
                          <div>
                            <p className="font-medium">{doc.title}</p>
                            <p className="text-sm text-muted-foreground">
                              Keywords: {doc.keywords}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{doc.views}</p>
                            <p className="text-sm text-muted-foreground">
                              views
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      Document Upload Trends
                    </h3>
                    <div className="h-60 w-full flex items-center justify-center bg-muted/30 rounded-md">
                      <p className="text-muted-foreground">
                        Chart visualization will be implemented
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Analytics</CardTitle>
                <CardDescription>
                  User engagement and activity metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>User analytics will be implemented in a future update.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="keywords">
            <Card>
              <CardHeader>
                <CardTitle>Keyword Analytics</CardTitle>
                <CardDescription>
                  Keyword usage and highlighting statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Keyword analytics will be implemented in a future update.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
