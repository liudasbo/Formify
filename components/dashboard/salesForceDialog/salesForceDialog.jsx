"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function SalesForceDialog({ user, fetchData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    accountName: user?.name || "",
    contactFirstName: user?.firstName || "",
    contactLastName: user?.lastName || "",
    contactEmail: user?.email || "",
    contactPhone: user?.phone || "",
    contactTitle: user?.title || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/salesforce", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountName: formData.accountName,
          contactFirstName: formData.contactFirstName,
          contactLastName: formData.contactLastName,
          contactEmail: formData.contactEmail,
          contactPhone: formData.contactPhone,
          contactTitle: formData.contactTitle,
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to connect to Salesforce");
      }

      toast.success("Successfully connected to Salesforce");
      setIsOpen(false);
      fetchData();
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>Connect to Salesforce</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect to Salesforce</DialogTitle>
            <DialogDescription>
              Fill in the form below to connect your account to Salesforce.
              Pre-filled fields from your profile cannot be changed.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Account Name
              </label>
              <Input
                type="text"
                name="accountName"
                value={formData.accountName}
                onChange={handleChange}
                disabled={!!user?.name}
                required
              />
            </div>
            <div className="mb-4">
              <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                First Name
              </label>
              <Input
                type="text"
                name="contactFirstName"
                value={formData.contactFirstName}
                onChange={handleChange}
                disabled={!!user?.firstName}
                required
              />
            </div>
            <div className="mb-4">
              <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Last Name
              </label>
              <Input
                type="text"
                name="contactLastName"
                value={formData.contactLastName}
                onChange={handleChange}
                disabled={!!user?.lastName}
                required
              />
            </div>
            <div className="mb-4">
              <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Title
              </label>
              <Input
                type="text"
                name="contactTitle"
                value={formData.contactTitle}
                onChange={handleChange}
                disabled={!!user?.title}
              />
            </div>
            <div className="mb-4">
              <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Email
              </label>
              <Input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                disabled={!!user?.email}
                required
              />
            </div>
            <div className="mb-4">
              <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Phone
              </label>
              <Input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                disabled={!!user?.phone}
              />
            </div>
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Connecting..." : "Submit"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
