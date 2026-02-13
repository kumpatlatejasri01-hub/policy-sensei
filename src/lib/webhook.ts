import { supabase } from "@/integrations/supabase/client";

export interface WebhookPayload {
  project_name: string;
  pdf_files: { name: string; base64: string }[];
  email: string;
  jurisdiction: string;
  file_names: string;
  submission_timestamp: string;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function submitToWebhook(
  files: File[],
  email: string,
  jurisdiction: string
): Promise<void> {
  const pdfFiles = await Promise.all(
    files.map(async (file) => ({
      name: file.name,
      base64: await fileToBase64(file),
    }))
  );

  const { data, error } = await supabase.functions.invoke("submit-documents", {
    body: {
      pdf_files: pdfFiles,
      email,
      jurisdiction,
      file_names: files.map((f) => f.name).join(", "),
    },
  });

  if (error) {
    throw new Error(`Submission failed: ${error.message}`);
  }

  if (data?.error) {
    throw new Error(data.error);
  }
}
