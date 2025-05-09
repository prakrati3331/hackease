import { useState, useRef } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, AlertTriangle, Loader2 } from "lucide-react";

interface ResumeParserProps {
  onParseSuccess: (data: any) => void;
}

export default function ResumeParser({ onParseSuccess }: ResumeParserProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Reset states
    setError(null);
    
    // Validate file type (PDF or DOCX)
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(selectedFile.type)) {
      setError("Please upload a PDF or DOCX file");
      return;
    }
    
    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB");
      return;
    }
    
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return newProgress;
        });
      }, 300);
      
      // Call resume parsing API
      const response = await apiRequest("POST", "/api/resume-parse", {
        filename: file.name,
        fileType: file.type,
      });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Resume Parsed",
          description: "Successfully extracted information from your resume.",
        });
        onParseSuccess(data.data);
      } else {
        setError("Failed to parse resume. Please try again.");
      }
    } catch (error) {
      console.error("Error parsing resume:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.docx"
      />
      
      {!file ? (
        <div className="space-y-4">
          <div className="flex justify-center">
            <FileText className="h-12 w-12 text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-1">Upload your resume</h3>
            <p className="text-gray-500 text-sm mb-4">Supports PDF and DOCX (Max 5MB)</p>
            <Button onClick={triggerFileInput} type="button">
              <Upload className="mr-2 h-4 w-4" />
              Select Resume
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-center">
            <FileText className="h-12 w-12 text-primary" />
          </div>
          <h3 className="text-lg font-medium">{file.name}</h3>
          <p className="text-gray-500 text-sm">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
          
          {isUploading ? (
            <div className="space-y-3">
              <Progress value={uploadProgress} className="h-2 w-full" />
              <p className="text-sm text-gray-500">Parsing resume... {uploadProgress}%</p>
            </div>
          ) : (
            <div className="flex justify-center gap-3">
              <Button onClick={triggerFileInput} variant="outline" type="button">
                Change
              </Button>
              <Button onClick={handleUpload} type="button" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Parse Resume</>
                )}
              </Button>
            </div>
          )}
        </div>
      )}
      
      {error && (
        <div className="mt-4 text-red-500 flex items-center justify-center">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
