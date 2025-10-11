"use client";

import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileText,
  Users,
  BarChart2,
  TrendingUp,
  Calendar,
  Clock,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto p-4">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <DashboardCard
                title="Documents"
                value="24"
                description="Total documents"
                icon={FileText}
                trend="+3 this week"
                trendUp={true}
              />
              <DashboardCard
                title="Users"
                value="156"
                description="Active users"
                icon={Users}
                trend="+12 this month"
                trendUp={true}
              />
              <DashboardCard
                title="Keywords"
                value="342"
                description="In dictionary"
                icon={BarChart2}
                trend="+28 this month"
                trendUp={true}
              />
              <DashboardCard
                title="Comments"
                value="87"
                description="Total comments"
                icon={TrendingUp}
                trend="+15 this week"
                trendUp={true}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest actions in the portal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        action: "Document uploaded",
                        user: "John Doe",
                        time: "2 hours ago",
                      },
                      {
                        action: "Comment added",
                        user: "Jane Smith",
                        time: "5 hours ago",
                      },
                      {
                        action: "Keywords updated",
                        user: "Admin",
                        time: "Yesterday",
                      },
                      {
                        action: "New blog post",
                        user: "Sarah Johnson",
                        time: "2 days ago",
                      },
                      {
                        action: "Document analyzed",
                        user: "Mike Brown",
                        time: "3 days ago",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 pb-4 border-b last:border-0"
                      >
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Clock className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.action}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{item.user}</span>
                            <span>•</span>
                            <span>{item.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>
                    Healthcare reform events and deadlines
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Policy Review Meeting",
                        date: "March 15, 2023",
                        location: "Virtual",
                      },
                      {
                        title: "Healthcare Summit",
                        date: "April 2, 2023",
                        location: "Burlington, VT",
                      },
                      {
                        title: "Budget Submission Deadline",
                        date: "April 15, 2023",
                        location: "N/A",
                      },
                      {
                        title: "Public Forum on Reform",
                        date: "May 10, 2023",
                        location: "Montpelier, VT",
                      },
                      {
                        title: "Quarterly Review",
                        date: "June 1, 2023",
                        location: "Virtual",
                      },
                    ].map((event, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 pb-4 border-b last:border-0"
                      >
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Calendar className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{event.title}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{event.date}</span>
                            <span>•</span>
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendUp,
}: {
  title: string;
  value: string;
  description: string;
  icon: any;
  trend: string;
  trendUp: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <div className="bg-primary/10 p-3 rounded-full">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{description}</p>
          <p
            className={`text-xs ${trendUp ? "text-green-500" : "text-red-500"}`}
          >
            {trend}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
