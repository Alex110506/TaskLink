import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Download, Sparkles, FileText, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// --- DEPENDENCIES FOR FILE PARSING & MARKDOWN ---
// PDF.js for reading PDF files
import * as pdfjsLib from 'pdfjs-dist';
// Mammoth for reading .docx files
import mammoth from 'mammoth';
// ReactMarkdown for rendering the AI's output
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // For tables, strikethroughs, etc.

// --- PDF.js Worker Setup ---
// This is required for pdfjs-dist to work in a web environment
// Make sure to serve this file or use a CDN
// We'll use a CDN for simplicity
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const AICVBuilder = () => {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  
  // --- NEW STATE VARIABLES ---
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [enhancedCv, setEnhancedCv] = useState<string>(""); // Will hold the AI's response
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic type check
      if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'].includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a .pdf, .docx, or .txt file.",
          variant: "destructive",
        });
        return;
      }
      setCvFile(file);
      setEnhancedCv(""); // Clear previous results
      toast({
        title: "CV Uploaded",
        description: `${file.name} has been uploaded.`,
      });
    }
  };

  /**
   * Helper function to extract raw text from the uploaded file
   */
  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (event) => {
        try {
          const buffer = event.target?.result;
          if (!buffer) {
            return reject(new Error("Failed to read file buffer."));
          }

          if (file.type === 'application/pdf') {
            const loadingTask = pdfjsLib.getDocument(new Uint8Array(buffer as ArrayBuffer));
            const pdf = await loadingTask.promise;
            let text = '';
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const content = await page.getTextContent();
              text += content.items.map((item: any) => item.str).join(' ') + '\n';
            }
            resolve(text);
          } 
          else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const result = await mammoth.extractRawText({ arrayBuffer: buffer as ArrayBuffer });
            resolve(result.value);
          }
          else if (file.type === 'text/plain') {
            resolve(buffer as string);
          }
          else {
            reject(new Error("Unsupported file type."));
          }
        } catch (error) {
          console.error("Error parsing file:", error);
          reject(new Error("Error parsing file. It may be corrupted."));
        }
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file."));
      };

      // Read file based on type
      if (file.type === 'text/plain') {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  };

  /**
   * Main function to handle the CV generation
   */
  const handleGenerateCV = async () => {
    if (!cvFile || !jobDescription) {
      toast({
        title: "Missing Information",
        description: "Please upload a CV and provide a job description.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setEnhancedCv(""); // Clear previous output
    toast({
      title: "AI is on the case!",
      description: "Reading your CV and crafting the perfect response...",
    });

    try {
      // --- Step 1: Extract text from the file ---
      let resumeText;
      try {
        resumeText = await extractTextFromFile(cvFile);
      } catch (parseError: any) {
        toast({
          title: "File Parsing Error",
          description: parseError.message || "Could not read text from the file. Please check the file and try again.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      // --- Step 2: Construct a high-quality user instruction ---
      const userInstruction = `
        Please act as an expert resume writer and career coach.
        I am applying for the role of "${jobTitle || 'the specified position'}" at "${company || 'the target company'}".

        Below is the full job description:
        --- JOB DESCRIPTION START ---
        ${jobDescription}
        --- JOB DESCRIPTION END ---

        Below is the raw text from my current resume:
        --- RESUME TEXT START ---
        ${resumeText}
        --- RESUME TEXT END ---

        Your task is to rewrite and tailor my resume to be a perfect fit for this job.
        Please optimize for ATS keywords, use strong action verbs, and highlight my most relevant skills and experiences.
        The output should be the full, enhanced resume content in clean Markdown format.
      `;

      console.log(resumeText);

      // --- Step 3: Call the backend API ---
      const response = await fetch('/api/optimize-cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText: resumeText, // We send the raw text, but the instruction gives context
          userInstruction: userInstruction // The detailed prompt is the key
        }),
        credentials:"include"
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An error occurred from the server.");
      }

      // --- Step 4: Handle the successful response ---
      const result = await response.json();
      if (result.success && result.data) {
        setEnhancedCv(result.data);
        toast({
          title: "CV Enhanced!",
          description: "Your new CV is ready to preview below.",
        });
      } else {
        throw new Error("The API returned an unexpected response.");
      }

    } catch (error: any) {
      console.error("Error generating CV:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "An unknown error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Handles downloading the enhanced CV as a .md file
   */
  const handleDownload = () => {
    if (!enhancedCv) {
      toast({
        title: "Nothing to Download",
        description: "Please generate an enhanced CV first.",
        variant: "destructive",
      });
      return;
    }

    // Create a blob from the markdown text
    const blob = new Blob([enhancedCv], { type: 'text/markdown;charset=utf-' });
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    const fileName = jobTitle ? jobTitle.replace(/\s+/g, '_') : 'enhanced';
    link.download = `${fileName}_cv.md`;
    // Programmatically click the link to trigger the download
    document.body.appendChild(link);
    link.click();
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: "Your enhanced CV is downloading as a Markdown file.",
    });
  };


  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-0">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-blue-500 to-accent bg-clip-text text-transparent">
          AI CV Builder
        </h1>
        <p className="text-muted-foreground">
          Upload your CV and specify a job offer to get an AI-enhanced version tailored for that position
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card className="border-border/50 bg-gradient-to-br from-card/80 to-card hover:border-primary/30 transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              1. Upload Your CV
            </CardTitle>
            <CardDescription>
              Upload your current CV (.pdf, .docx, .txt)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:border-primary/50 transition-all cursor-pointer bg-gradient-to-br from-blue-900/5 to-transparent">
              <input
                type="file"
                id="cv-upload"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                onChange={handleFileUpload}
              />
              <label htmlFor="cv-upload" className="cursor-pointer space-y-2">
                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-blue-600/20 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <div className="text-sm text-muted-foreground">
                  {cvFile ? (
                    <span className="text-primary font-medium">{cvFile.name}</span>
                  ) : (
                    <>
                      Click to upload or drag and drop
                      <br />
                      PDF, DOCX, TXT (max 10MB)
                    </>
                  )}
                </div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Job Details Section */}
        <Card className="border-border/50 bg-gradient-to-br from-card/80 to-card hover:border-primary/30 transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              2. Job Details
            </CardTitle>
            <CardDescription>
              Provide details about the job you're applying for
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="job-title">Job Title</Label>
              <Input
                id="job-title"
                placeholder="e.g., Senior Software Engineer"
                className="bg-background/50 border-border/50 focus:border-primary"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company (Optional)</Label>
              <Input
                id="company"
                placeholder="e.g., Tech Corp"
                className="bg-background/50 border-border/50 focus:border-primary"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Description */}
      <Card className="border-border/50 bg-gradient-to-br from-card/80 to-card">
        <CardHeader>
          <CardTitle>3. Job Description</CardTitle>
          <CardDescription>
            Paste the full job description to help AI tailor your CV
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Paste the complete job description here, including required skills, qualifications, and responsibilities..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="min-h-[200px] bg-background/50 border-border/50 focus:border-primary resize-none"
          />
        </CardContent>
      </Card>

      {/* AI Settings / Action Button */}
      <Card className="border-border/50 bg-gradient-to-br from-primary/5 via-blue-600/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            4. Generate & Download
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleGenerateCV}
              disabled={!cvFile || !jobDescription || isProcessing}
              className="flex-1 bg-gradient-to-r from-primary via-blue-600 to-accent hover:opacity-90 shadow-lg shadow-primary/30"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Sparkles className="h-5 w-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate Enhanced CV
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-primary/30 hover:bg-primary/10"
              disabled={isProcessing || !enhancedCv}
              onClick={handleDownload}
            >
              <Download className="h-5 w-5 mr-2" />
              Download .MD File
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card className="border-border/50 bg-gradient-to-br from-card/80 to-card">
        <CardHeader>
          <CardTitle>Enhanced CV Preview</CardTitle>
          <CardDescription>
            Your AI-optimized CV will appear here (formatted as Markdown)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-[300px] rounded-lg border border-border/50 bg-background/30 p-4">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Sparkles className="h-12 w-12 text-primary animate-spin" />
                <p className="mt-4 text-lg">AI is thinking...</p>
                <p>This can take a moment.</p>
              </div>
            ) : enhancedCv ? (
              // --- RENDER MARKDOWN OUTPUT ---
              <article className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {enhancedCv}
                </ReactMarkdown>
              </article>
            ) : (
              // --- DEFAULT PLACEHOLDER ---
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center">
                <FileText className="h-12 w-12 text-primary/50" />
                <p className="mt-4 text-lg">
                  Your enhanced CV will be displayed here after processing
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AICVBuilder;