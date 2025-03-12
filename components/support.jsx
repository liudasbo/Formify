"use client";

import React, { useState } from "react";
import { LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function Support() {
  const [currentUrl, setCurrentUrl] = useState(() => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return "";
  });

  const [ticketCreated, setTicketCreated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [ticketData, setTicketData] = useState({
    summary: "",
    description: "",
    priority: "Medium",
  });
  const [ticketInfo, setTicketInfo] = useState({
    jiraKey: "",
    summary: "",
    priority: "Medium",
    status: "",
    link: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePriorityChange = (value) => {
    setTicketData((prev) => ({
      ...prev,
      priority: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    console.log("Submitting ticket data:", {
      summary: ticketData.summary,
      description: ticketData.description,
      priority: ticketData.priority,
      pageUrl: currentUrl,
    });

    try {
      const response = await fetch("/api/jira", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: ticketData.summary,
          description: ticketData.description,
          priority: ticketData.priority,
          pageUrl: currentUrl,
        }),
      });

      const data = await response.json();
      console.log("API response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to create ticket");
      }

      setTicketInfo(data.ticket);
      setTicketCreated(true);
      toast.success("Support ticket created successfully!");
    } catch (err) {
      console.error("Error creating ticket:", err);
      setError(err.message);
      toast.error(`Failed to create ticket: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTicketData({
      summary: "",
      description: "",
      priority: "Medium",
    });
    setTicketCreated(false);
    setError(null);
  };

  return (
    <Dialog onOpenChange={(open) => !open && resetForm()}>
      <DialogTrigger className="fixed bottom-6 right-6 p-3 bg-background rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50">
        <LifeBuoy size={24} />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {ticketCreated ? "Support Ticket Created" : "Create Support Ticket"}
          </DialogTitle>
          <DialogDescription>
            {ticketCreated
              ? "Your support ticket has been created successfully."
              : "Describe your issue and we'll help you resolve it."}
          </DialogDescription>
        </DialogHeader>

        {ticketCreated ? (
          <div className="space-y-4 py-4">
            <div className="bg-slate-50 p-4 rounded-md border">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">{ticketInfo.summary}</div>
                <Badge
                  variant={
                    ticketInfo.priority === "Highest" ||
                    ticketInfo.priority === "High"
                      ? "destructive"
                      : ticketInfo.priority === "Low" ||
                        ticketInfo.priority === "Lowest"
                      ? "outline"
                      : "default"
                  }
                >
                  {ticketInfo.priority}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground mb-4">
                Ticket #{ticketInfo.jiraKey}
              </div>
              <div className="text-sm">
                <span className="font-medium text-slate-500">Status: </span>
                <Badge variant="outline" className="bg-blue-50 ml-2">
                  {ticketInfo.status || "Open"}
                </Badge>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-md text-sm space-y-2">
              <p>
                <span className="font-medium">Page URL: </span>
                {currentUrl}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                You can track your ticket status in Jira
              </span>
              <a
                href={ticketInfo.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-blue-600 hover:underline"
              >
                View in Jira
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>

            <DialogFooter>
              <Button onClick={resetForm} type="button">
                Create Another Ticket
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="summary">Summary</Label>
              <Input
                id="summary"
                name="summary"
                placeholder="Brief description of your issue"
                value={ticketData.summary}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Provide additional details about the issue"
                value={ticketData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={ticketData.priority}
                onValueChange={handlePriorityChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-2">
              <div className="bg-slate-50 p-3 rounded-md text-sm text-muted-foreground space-y-2">
                <p>
                  <span className="font-medium">Page URL: </span>
                  {currentUrl}
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Ticket"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
