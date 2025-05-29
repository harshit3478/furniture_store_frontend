"use client";

import { FC, useState, useEffect } from "react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileIcon, ChevronRight, Loader2, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/authContext";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

type KycStatus = "unverified" | "verified" | "rejected" | "under_review";

interface KycDetails {
  kycStatus: KycStatus;
  documentType?: string;
  documentId?: string;
  documentImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

const KycVerificationPage: FC = () => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kycDetails, setKycDetails] = useState<KycDetails>({ kycStatus: "unverified" });
  const [documentType, setDocumentType] = useState<string>("");
  const [documentId, setDocumentId] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [showImagePreview, setShowImagePreview] = useState(false);

  useEffect(() => {
    if (token) {
      fetchKycDetails();
    }
  }, [token]);

  const fetchKycDetails = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/kyc`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch KYC details");
      }

      const data = await response.json();
      setKycDetails({
        kycStatus: data.kycStatus,
        documentType: data.documentType,
        documentId: data.documentId,
        documentImage: data.documentImage,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      });
    } catch (error) {
      console.error("Error fetching KYC details:", error);
      toast.error("Failed to load KYC details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Create a preview URL for the file
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (fileReader.result) {
          setPreviewUrl(fileReader.result as string);
        }
      };
      fileReader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!documentType || !documentId || !file) {
      toast.error("Please fill in all fields and upload a document");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("documentType", documentType);
      formData.append("documentId", documentId);
      formData.append("documentImage", file);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/kyc`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit KYC documents");
      }

      const data = await response.json();
      setKycDetails({
        kycStatus: data.kycStatus,
        documentType: data.documentType,
        documentId: data.documentId,
        documentImage: data.documentImage,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      });

      toast.success("KYC documents submitted successfully");
      setFile(null);
      setPreviewUrl("");
      setDocumentType("");
      setDocumentId("");
    } catch (error) {
      console.error("Error submitting KYC documents:", error);
      toast.error("Failed to submit KYC documents");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = () => {
    switch(kycDetails.kycStatus) {
      case "verified": return "text-green-600";
      case "unverified": return "text-red-600";
      case "rejected": return "text-red-600";
      case "under_review": return "text-yellow-600";
      default: return "text-red-600";
    }
  };

  const getStatusText = () => {
    switch(kycDetails.kycStatus) {
      case "verified": return "Verified";
      case "unverified": return "Unverified";
      case "rejected": return "Rejected";
      case "under_review": return "Under Review";
      default: return "Unverified";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "dd MMMM yyyy");
    } catch (error) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg border-2 mx-4">
      {/* Breadcrumb - Mobile Only */}
      <div className="md:hidden bg-gray-50 py-2 px-4 text-sm text-primary flex items-center overflow-x-auto whitespace-nowrap">
        <Link href="/profile" className="hover:text-gray-900">Profile</Link>
        <ChevronRight size={14} className="mx-1" />
        <span className="text-primary font-medium">KYC and Verification</span>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 border-b border-gray-200">
        <h1 className="text-3xl font-gilroySemibold">KYC and Verification</h1>
        <p className="text-gray-500 text-sm">Upload your KYC documents for verification</p>
      </div>

      {/* Desktop Header - Hidden on Mobile */}
      <div className="hidden md:block mb-6">
        <h1 className="text-3xl font-gilroySemibold mb-2">KYC and Verification</h1>
        <p className="text-gray-500 font-gilroy text-base mb-6">Upload your KYC documents for verification</p>
      </div>

      <Card className="md:shadow-none md:border-0 p-6 md:p-0 bg-transparent ">
        <div className="space-y-6">
          {/* KYC Status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">KYC Status:</span>
              <span className={getStatusColor()}>{getStatusText()}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium">Date of Verification:</span>
              {kycDetails.kycStatus === "verified" ? (
                <span>{formatDate(kycDetails.updatedAt)}</span>
              ) : (
                <span>-</span>
              )}
            </div>
          </div>

          {kycDetails.kycStatus === "verified" ? (
            // Verified KYC View
            <div className="space-y-4">
              <h2 className="text-lg font-medium">Uploaded Documents</h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Document Type:</span>
                  <span>{kycDetails.documentType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Document ID:</span>
                  <span>{kycDetails.documentId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Upload Date:</span>
                  <span>{formatDate(kycDetails.createdAt)}</span>
                </div>
                {kycDetails.documentImage && (
                  <div className="mt-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center">
                          <Eye className="h-4 w-4 mr-2" />
                          View Document
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <div className="relative h-[70vh] w-full">
                          <Image
                            src={kycDetails.documentImage}
                            alt="KYC Document"
                            fill
                            className="object-contain"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
            </div>
          ) : kycDetails.kycStatus === "under_review" ? (
            // Under Review KYC View
            <div className="space-y-4">
              <h2 className="text-lg font-medium">Uploaded Documents</h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Document Type:</span>
                  <span>{kycDetails.documentType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Document ID:</span>
                  <span>{kycDetails.documentId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Upload Date:</span>
                  <span>{formatDate(kycDetails.createdAt)}</span>
                </div>
                {kycDetails.documentImage && (
                  <div className="mt-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center">
                          <Eye className="h-4 w-4 mr-2" />
                          View Document
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <div className="relative h-[70vh] w-full">
                          <Image
                            src={kycDetails.documentImage}
                            alt="KYC Document"
                            fill
                            className="object-contain"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
                <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-md text-sm">
                  Your documents are being reviewed. This process typically takes 1-2 business days.
                </div>
              </div>
            </div>
          ) : (
            // Unverified or Rejected KYC View
            <div className="space-y-4">
              <h2 className="text-lg font-medium">Upload Documents</h2>

              {kycDetails.kycStatus === "rejected" && (
                <div className="p-3 bg-red-50 text-red-800 rounded-md text-sm mb-4">
                  Your document was rejected. Please ensure you upload a clear image of a valid document.
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Document Type:</label>
                  <Select value={documentType} onValueChange={setDocumentType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Document Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Aadhaar Card">Aadhaar Card</SelectItem>
                      <SelectItem value="PAN Card">PAN Card</SelectItem>
                      <SelectItem value="Passport">Passport</SelectItem>
                      <SelectItem value="Driving License">Driving License</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Document ID:</label>
                  <Input
                    placeholder="Enter your document number"
                    value={documentId}
                    onChange={(e) => setDocumentId(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Upload Document:</label>
                  <div
                    className="border border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => document.getElementById('fileInput')?.click()}
                  >
                    <input
                      type="file"
                      id="fileInput"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*,.pdf"
                    />
                    {previewUrl ? (
                      <div className="relative h-40 w-full mb-2">
                        <Image
                          src={previewUrl}
                          alt="Document Preview"
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <FileIcon className="h-10 w-10 text-purple-300 mb-2" />
                    )}
                    <p className="text-center text-sm">
                      {previewUrl ? "Click to change document" : "Drop a picture of the document here"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Supported formats: JPG, PNG, PDF</p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !documentType || !documentId || !file}
                  >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Image Preview Dialog */}
      <Dialog open={showImagePreview} onOpenChange={setShowImagePreview}>
        <DialogContent className="max-w-3xl">
          {previewUrl && (
            <div className="relative h-[70vh] w-full">
              <Image
                src={previewUrl}
                alt="Document Preview"
                fill
                className="object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KycVerificationPage;
