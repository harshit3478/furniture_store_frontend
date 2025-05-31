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
import { FileIcon, ChevronRight, Loader2, Eye, Upload, CheckCircle, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/authContext";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";

// Updated to match backend values
type KycStatus = "Rejected" | "Approved" | "Pending" | "Unverified";

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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  // Updated default status to match backend
  const [kycDetails, setKycDetails] = useState<KycDetails>({ kycStatus: "Unverified" });
  const [documentType, setDocumentType] = useState<string>("");
  const [documentId, setDocumentId] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

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
      console.log(data);
      setKycDetails({
        kycStatus: data.kycStatus || "Unverified", // Fallback to Unverified if no status
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

  const validateFile = (file: File): boolean => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a valid image (JPG, PNG) or PDF file");
      return false;
    }

    if (file.size > maxSize) {
      toast.error("File size must be less than 5MB");
      return false;
    }

    return true;
  };

  const processFile = (selectedFile: File) => {
    if (!validateFile(selectedFile)) {
      return;
    }

    setFile(selectedFile);
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setUploadProgress(100);
            setIsUploading(false); // This enables the submit button
          }, 200);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    // Create a preview URL for the file
    if (selectedFile.type === 'application/pdf') {
      const blobUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(blobUrl);
    } else {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (fileReader.result) {
          setPreviewUrl(fileReader.result as string);
        }
      };
      fileReader.readAsDataURL(selectedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    // Clean up blob URL if it exists
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl("");
    setUploadProgress(0);
    setIsUploading(false);
    // Reset file input
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
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
        kycStatus: data.kycStatus || "Pending", // Default to Pending after submission
        documentType: data.documentType,
        documentId: data.documentId,
        documentImage: data.documentImage,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      });

      toast.success("KYC documents submitted successfully");
      setFile(null);
      // Clean up blob URL if it exists
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl("");
      setDocumentType("");
      setDocumentId("");
      setUploadProgress(0);
    } catch (error) {
      console.error("Error submitting KYC documents:", error);
      toast.error("Failed to submit KYC documents");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Updated status color mapping for backend values
  const getStatusColor = () => {
    switch (kycDetails.kycStatus) {
      case "Approved": return "text-green-600";
      case "Rejected": return "text-red-600";
      case "Pending": return "text-yellow-600";
      case "Unverified": return "text-red-600";
      default: return "text-red-600";
    }
  };

  // Updated status text mapping for backend values
  const getStatusText = () => {
    switch (kycDetails.kycStatus) {
      case "Approved": return "Verified";
      case "Rejected": return "Rejected";
      case "Pending": return "Under Review";
      case "Unverified": return "Unverified";
      default: return "Unverified";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "dd MMMM yyyy");
    } catch (err) {
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
        <span className="text-primary font-gilroyMedium">KYC and Verification</span>
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
              <span className="font-gilroyMedium">KYC Status:</span>
              <span className={getStatusColor()}>{getStatusText()}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-gilroyMedium">Date of Verification:</span>
              {kycDetails.kycStatus === "Approved" ? (
                <span>{formatDate(kycDetails.updatedAt)}</span>
              ) : (
                <span>-</span>
              )}
            </div>
          </div>

          {kycDetails.kycStatus === "Approved" ? (
            // Approved KYC View
            <div className="space-y-4">
              <h2 className="text-xl font-gilroyMedium">Uploaded Documents</h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-gilroyMedium mb-2">Document Type:</span>
                  <span>{kycDetails.documentType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-gilroyMedium mb-2">Document ID:</span>
                  <span>{kycDetails.documentId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-gilroyMedium">Upload Date:</span>
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
                      <DialogContent className="max-w-4xl max-h-[90vh]">
                        <DialogTitle>KYC Document</DialogTitle>
                        <div className="relative h-[80vh] w-full">
                          {kycDetails.documentImage.toLowerCase().includes('.pdf') ||
                            kycDetails.documentType?.toLowerCase().includes('pdf') ? (
                            <iframe
                              src={kycDetails.documentImage}
                              className="w-full h-full rounded"
                              title="KYC Document"
                            />
                          ) : (
                            <Image
                              src={kycDetails.documentImage}
                              alt="KYC Document"
                              fill
                              className="object-contain"
                            />
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
            </div>
          ) : kycDetails.kycStatus === "Pending" ? (
            // Pending KYC View
            <div className="space-y-4">
              <h2 className="text-lg font-gilroyMedium">Uploaded Documents</h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-gilroyMedium mb-2">Document Type:</span>
                  <span>{kycDetails.documentType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-gilroyMedium mb-2">Document ID:</span>
                  <span>{kycDetails.documentId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-gilroyMedium">Upload Date:</span>
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
                      <DialogContent className="max-w-4xl max-h-[90vh]">
                        <DialogTitle>KYC Document</DialogTitle>
                        <div className="relative h-[80vh] w-full">
                          {kycDetails.documentImage.toLowerCase().includes('.pdf') ||
                            kycDetails.documentType?.toLowerCase().includes('pdf') ? (
                            <iframe
                              src={kycDetails.documentImage}
                              className="w-full h-full rounded"
                              title="KYC Document"
                            />
                          ) : (
                            <Image
                              src={kycDetails.documentImage}
                              alt="KYC Document"
                              fill
                              className="object-contain"
                            />
                          )}
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
              <h2 className="text-lg font-gilroyMedium mb-2">Upload Documents</h2>

              {kycDetails.kycStatus === "Rejected" && (
                <div className="p-3 bg-red-50 text-red-800 rounded-md text-sm mb-4">
                  Your document was rejected. Please ensure you upload a clear image of a valid document.
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-gilroyMedium mb-2">Document Type:</label>
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
                  <label className="block text-sm font-gilroyMedium mb-2">Document ID:</label>
                  <Input
                    placeholder="Enter your document number"
                    value={documentId}
                    onChange={(e) => setDocumentId(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-gilroyMedium mb-2">Upload Document:</label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer ${isDragOver
                      ? 'border-purple-500 bg-purple-50'
                      : file
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    onClick={() => !file && document.getElementById('fileInput')?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      id="fileInput"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*,.pdf"
                    />

                    {file ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span className="text-sm font-gilroyMedium text-green-700">
                              {file.name}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowImagePreview(true);
                              }}
                              className="flex items-center"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Preview
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile();
                              }}
                              className="text-red-500 border border-red-400 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {isUploading && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Uploading...</span>
                              <span>{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center">
                        {isDragOver ? (
                          <>
                            <Upload className="h-10 w-10 text-purple-500 mb-2" />
                            <p className="text-purple-600 font-gilroyMedium">Drop your document here</p>
                          </>
                        ) : (
                          <>
                            <FileIcon className="h-10 w-10 text-gray-400 mb-2" />
                            <p className="text-gray-600 font-gilroyMedium mb-1">
                              Drop a document here or click to browse
                            </p>
                            <p className="text-xs text-gray-400">
                              Supported formats: JPG, PNG, PDF (Max 5MB)
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !documentType || !documentId || !file || isUploading}
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

      {/* Image/PDF Preview Dialog */}
      <Dialog open={showImagePreview} onOpenChange={setShowImagePreview}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogTitle>Document Preview</DialogTitle>
          {previewUrl && (
            <div className="relative h-[80vh] w-full">
              {file && file.type === 'application/pdf' ? (
                <iframe
                  src={previewUrl}
                  className="w-full h-full rounded"
                  title="Document Preview"
                />
              ) : (
                <Image
                  src={previewUrl}
                  alt="Document Preview"
                  fill
                  className="object-contain"
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KycVerificationPage;