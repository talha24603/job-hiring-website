"use client";

import type React from "react";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import type { Application } from "@/types/application";
import { Briefcase, Filter, X } from "lucide-react";
import { toast } from "sonner";

interface JobApplicationsProps {
  applications: Application[];
}

export default function JobApplications({
  applications,
}: JobApplicationsProps) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Get unique statuses from applications
  const statuses = useMemo(() => {
    const statusSet = new Set<string>();
    applications.forEach((app) => {
      if (app.status) {
        statusSet.add(app.status.toLowerCase());
      }
    });
    return Array.from(statusSet);
  }, [applications]);

  // Filter applications by status
  const filteredApplications = useMemo(() => {
    if (!statusFilter) return applications;
    return applications.filter(
      (app) => app.status.toLowerCase() === statusFilter.toLowerCase()
    );
  }, [applications, statusFilter]);

  // Count applications by status
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    applications.forEach((app) => {
      const status = app.status.toLowerCase();
      counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
  }, [applications]);

  // If no applications, show empty state
  if (!applications || applications.length === 0) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <EmptyState
          title="No Applications Found"
          description="There are no applications for this job yet."
          action={
            <Button onClick={() => window.history.back()}>Go Back</Button>
          }
        />
      </div>
    );
  }

  // Function to get status badge style
  const getStatusBadgeStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "applied":
      case "pending":
        return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100";
      case "reviewing":
      case "under review":
        return "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100";
      case "interview":
      case "interviewing":
        return "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100";
      case "hired":
      case "accepted":
        return "bg-green-50 text-green-700 border-green-200 hover:bg-green-100";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200 hover:bg-red-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100";
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.history.back()}
          className="mb-4"
        >
          ← Back
        </Button>
        <h1 className="text-2xl font-bold">Applications</h1>
        {applications[0]?.jobPost && (
          <p className="text-gray-500">
            For: {applications[0].jobPost.title} at{" "}
            {applications[0].jobPost.company}
          </p>
        )}
      </div>

      {/* Status Filter */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Filter size={16} className="text-gray-500" />
          <h2 className="text-sm font-medium">Filter by Status</h2>
          {statusFilter && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
              onClick={() => setStatusFilter(null)}
            >
              <X size={14} className="mr-1" />
              Clear filter
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <Badge
              key={status}
              variant="outline"
              className={`cursor-pointer ${getStatusBadgeStyles(status)} ${
                statusFilter === status ? "ring-2 ring-offset-1" : ""
              }`}
              onClick={() =>
                setStatusFilter(statusFilter === status ? null : status)
              }
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-1 text-xs">
                ({statusCounts[status] || 0})
              </span>
            </Badge>
          ))}
        </div>
      </div>

      {filteredApplications.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredApplications.map((application, index) => (
            <ApplicationCard
              key={application.id}
              application={application}
              index={index}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Matching Applications"
          description={`There are no applications with the "${statusFilter}" status.`}
          action={
            <Button variant="outline" onClick={() => setStatusFilter(null)}>
              Clear Filter
            </Button>
          }
        />
      )}
    </div>
  );
}

// Application Card Component
interface ApplicationCardProps {
  application: Application;
  index: number;
}

function ApplicationCard({ application, index }: ApplicationCardProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(application.status);

  // Function to determine badge color based on status
  const getStatusBadgeStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "applied":
      case "pending":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "reviewing":
      case "under review":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "interview":
      case "interviewing":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "hired":
      case "accepted":
        return "bg-green-50 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      setIsUpdating(true);

      // Make API call to update application status

      const response = await fetch(
        `
/api/application/
${application.id}
/status
`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      if (response.ok) {
        setCurrentStatus(newStatus);
        toast.success("Status updated", {
          description: `Application status changed to ${newStatus}`,
        });
      } else {
        // Handle error
        console.error("Failed to update status");
        toast.error("Error updating status", {
          description: "Failed to update application status",
        });
      }
    } catch (error) {
      console.error("Error updating application status:", error);
      toast.error("Error updating status", {
        description: "Failed to update application status",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card
      className={`bg-white shadow hover:shadow-md transition fade-up border-l-4 ${
        currentStatus.toLowerCase() === "hired" ||
        currentStatus.toLowerCase() === "accepted"
          ? "border-l-green-500"
          : currentStatus.toLowerCase() === "rejected"
            ? "border-l-red-500"
            : currentStatus.toLowerCase() === "interview" ||
                currentStatus.toLowerCase() === "interviewing"
              ? "border-l-purple-500"
              : currentStatus.toLowerCase() === "reviewing" ||
                  currentStatus.toLowerCase() === "under review"
                ? "border-l-yellow-500"
                : "border-l-blue-500"
      }`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              {application.employeeProfile?.name || "Applicant"}
            </CardTitle>
            <CardDescription>
              {application.employeeProfile?.email || "No email provided"}
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className={getStatusBadgeStyles(currentStatus)}
          >
            {currentStatus.charAt(0).toUpperCase() +
              currentStatus.slice(1).toLowerCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() =>
                window.open(
                  application.employeeProfile?.resumeUrl || "#",
                  "_blank"
                )
              }
              disabled={!application.employeeProfile?.resumeUrl}
            >
              View Resume
            </Button>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Update Status:</p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className={`text-xs ${currentStatus.toLowerCase() === "reviewing" ? "bg-yellow-100" : ""}`}
                onClick={() => handleStatusChange("reviewing")}
                disabled={
                  isUpdating || currentStatus.toLowerCase() === "reviewing"
                }
              >
                Reviewing
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`text-xs ${currentStatus.toLowerCase() === "interview" ? "bg-purple-100" : ""}`}
                onClick={() => handleStatusChange("interview")}
                disabled={
                  isUpdating || currentStatus.toLowerCase() === "interview"
                }
              >
                Interview
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`text-xs ${currentStatus.toLowerCase() === "hired" ? "bg-green-100" : ""}`}
                onClick={() => handleStatusChange("hired")}
                disabled={isUpdating || currentStatus.toLowerCase() === "hired"}
              >
                Hire
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`text-xs ${currentStatus.toLowerCase() === "rejected" ? "bg-red-100" : ""}`}
                onClick={() => handleStatusChange("rejected")}
                disabled={
                  isUpdating || currentStatus.toLowerCase() === "rejected"
                }
              >
                Reject
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-gray-500">
        Applied on: {new Date(application.appliedAt).toLocaleDateString()}
      </CardFooter>
    </Card>
  );
}

// Empty State Component
interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-lg border border-dashed border-gray-300">
      <div className="rounded-full bg-gray-100 p-3 mb-4">
        <Briefcase className="h-6 w-6 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 mb-4">{description}</p>
      {action}
    </div>
  );
}
