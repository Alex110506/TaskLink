import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Download, Sparkles, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AICVBuilder = () => {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCvFile(file);
      toast({
        title: "CV Uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    }
  };

  const handleGenerateCV = () => {
    if (!cvFile || !jobDescription) {
      toast({
        title: "Missing Information",
        description: "Please upload a CV and provide a job description.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "CV Enhanced!",
        description: "Your CV has been optimized for the job offer.",
      });
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
              Upload Your CV
            </CardTitle>
            <CardDescription>
              Upload your current CV in PDF, DOC, or DOCX format
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:border-primary/50 transition-all cursor-pointer bg-gradient-to-br from-blue-900/5 to-transparent">
              <input
                type="file"
                id="cv-upload"
                className="hidden"
                accept=".pdf,.doc,.docx"
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
                      PDF, DOC, DOCX (max 10MB)
                    </>
                  )}
                </div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Job Description Section */}
        <Card className="border-border/50 bg-gradient-to-br from-card/80 to-card hover:border-primary/30 transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              Job Details
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company (Optional)</Label>
              <Input
                id="company"
                placeholder="e.g., Tech Corp"
                className="bg-background/50 border-border/50 focus:border-primary"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Description */}
      <Card className="border-border/50 bg-gradient-to-br from-card/80 to-card">
        <CardHeader>
          <CardTitle>Job Description</CardTitle>
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

      {/* AI Settings */}
      <Card className="border-border/50 bg-gradient-to-br from-primary/5 via-blue-600/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            AI Enhancement Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-border/50 bg-card/50 hover:border-primary/50 transition-all cursor-pointer">
              <div className="font-medium mb-1">🎯 Keyword Optimization</div>
              <div className="text-sm text-muted-foreground">Match job requirements</div>
            </div>
            <div className="p-4 rounded-lg border border-border/50 bg-card/50 hover:border-primary/50 transition-all cursor-pointer">
              <div className="font-medium mb-1">✨ Content Enhancement</div>
              <div className="text-sm text-muted-foreground">Improve descriptions</div>
            </div>
            <div className="p-4 rounded-lg border border-border/50 bg-card/50 hover:border-primary/50 transition-all cursor-pointer">
              <div className="font-medium mb-1">📊 Skills Highlighting</div>
              <div className="text-sm text-muted-foreground">Emphasize relevant skills</div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
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
              disabled={isProcessing}
            >
              <Download className="h-5 w-5 mr-2" />
              Download
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card className="border-border/50 bg-gradient-to-br from-card/80 to-card">
        <CardHeader>
          <CardTitle>Enhanced CV Preview</CardTitle>
          <CardDescription>
            Your AI-optimized CV will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-[300px] rounded-lg border-2 border-dashed border-border/50 bg-gradient-to-br from-blue-900/5 to-transparent flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-blue-600/20 flex items-center justify-center">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <p className="text-muted-foreground">
                Your enhanced CV will be displayed here after processing
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AICVBuilder;
