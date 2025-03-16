"use client";

import { FC, useState } from "react";
import Link from "next/link";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileIcon, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";

const KycVerificationPage: FC = () => {
  const [kycStatus, setKycStatus] = useState<"unverified" | "verified" | "rejected" | "under_review">("unverified");
  const [documentType, setDocumentType] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    // Handle document submission
    console.log("Document submitted:", documentType, file);
    // In a real app, you would upload the file to your server here
  };

  const getStatusColor = () => {
    switch(kycStatus) {
      case "verified": return "text-green-600";
      case "unverified": return "text-red-600";
      case "rejected": return "text-red-600";
      case "under_review": return "text-yellow-600";
      default: return "text-red-600";
    }
  };

  const getStatusText = () => {
    switch(kycStatus) {
      case "verified": return "Verified";
      case "unverified": return "Unverified";
      case "rejected": return "Rejected";
      case "under_review": return "Under Review";
      default: return "Unverified";
    }
  };

  return (
    <div className="bg-white md:bg-transparent">
      {/* Breadcrumb - Mobile Only */}
      <div className="md:hidden bg-gray-50 py-2 px-4 text-sm text-primary flex items-center overflow-x-auto whitespace-nowrap">
        <Link href="/profile" className="hover:text-gray-900">Profile</Link>
        <ChevronRight size={14} className="mx-1" />
        <span className="text-primary font-medium">KYC and Verification</span>
      </div>
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold">KYC and Verification</h1>
        <p className="text-gray-500 text-sm">Upload your KYC documents for verification</p>
      </div>
      
      {/* Desktop Header - Hidden on Mobile */}
      <div className="hidden md:block mb-6">
        <h1 className="text-2xl font-bold mb-2">KYC and Verification</h1>
        <p className="text-gray-500">Upload your KYC documents for verification</p>
      </div>
      
      <Card className="md:shadow-none md:border-0 p-4 md:p-0">
        <div className="space-y-6">
          {/* KYC Status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">KYC Status:</span>
              <span className={getStatusColor()}>{getStatusText()}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-medium">Date of Verification:</span>
              {kycStatus === "verified" ? (
                <span>12 March 2025</span>
              ) : (
                <span>-</span>
              )}
            </div>
          </div>
          
          {kycStatus === "verified" ? (
            // Verified KYC View
            <div className="space-y-4">
              <h2 className="text-lg font-medium">Uploaded Documents</h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Document Type:</span>
                  <span>Aadhaar Card</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Upload Date:</span>
                  <span>11 March 2025</span>
                </div>
              </div>
            </div>
          ) : kycStatus === "under_review" ? (
            // Under Review KYC View
            <div className="space-y-4">
              <h2 className="text-lg font-medium">Uploaded Documents</h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Document Type:</span>
                  <span>Aadhaar Card</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Upload Date:</span>
                  <span>11 March 2025</span>
                </div>
                <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-md text-sm">
                  Your documents are being reviewed. This process typically takes 1-2 business days.
                </div>
              </div>
            </div>
          ) : (
            // Unverified or Rejected KYC View
            <div className="space-y-4">
              <h2 className="text-lg font-medium">Upload Documents</h2>
              
              {kycStatus === "rejected" && (
                <div className="p-3 bg-red-50 text-red-800 rounded-md text-sm mb-4">
                  Your document was rejected. Please ensure you upload a clear image of a valid document.
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Document Type:</label>
                  <Select onValueChange={setDocumentType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Document Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aadhaar">Aadhaar Card</SelectItem>
                      <SelectItem value="pan">PAN Card</SelectItem>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="driving_license">Driving License</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <FileIcon className="h-10 w-10 text-purple-300 mb-2" />
                    <p className="text-center text-sm">Drop a picture of the document here</p>
                    <p className="text-xs text-gray-400 mt-1">Supported formats: JPG, PNG, PDF</p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default KycVerificationPage;
