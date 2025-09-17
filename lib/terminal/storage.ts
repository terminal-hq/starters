// Types
export interface FileUploadResult {
  id: string;
}

export interface FileDownloadUrl {
  url: string;
}

export interface FileListItem {
  id: string;
  size?: number;
  lastModified?: Date;
}

export interface FileMetadata {
  contentType?: string;
  size?: number;
  lastModified?: Date;
}

/**
 * Upload a file to the AWS proxy server
 * @param file File object or buffer with filename and mimetype
 * @param type "public" or "private" storage
 * @returns Promise with file ID and URL if public
 */
export const uploadFile = async (
  file: File | { buffer: Buffer; filename: string; mimetype: string },
  type: "public" | "private" = "private"
): Promise<FileUploadResult> => {
  const formData = new FormData();

  if (file instanceof File) {
    formData.append("file", file);
  } else {
    // Convert buffer to blob for FormData (create a Uint8Array view to satisfy BlobPart types)
    const uint8Array = new Uint8Array(file.buffer);
    const blob = new Blob([uint8Array], { type: file.mimetype });
    formData.append("file", blob, file.filename);
  }
  formData.append("type", type);

  const response = await fetch(`${process.env.TERMINAL_END_POINT}/files`, {
    method: "POST",
    headers: {
      "X-API-KEY": process.env.TERMINAL_API_KEY!,
      "X-APP-ID": process.env.TERMINAL_APP_ID!,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(`Upload failed: ${error.error || response.statusText}`);
  }

  return response.json();
};

/**
 * Get a pre-signed download URL for a file
 * @param fileId File identifier
 * @param expires Optional expiration time in seconds (default 900s)
 * @returns Promise with pre-signed URL
 */
export const getFileDownloadUrl = async (
  fileId: string,
  expires?: number
): Promise<FileDownloadUrl> => {
  const response = await fetch(
    `${process.env.TERMINAL_END_POINT}/files/${encodeURIComponent(fileId)}` +
      (expires ? `?expires=${expires}` : ""),
    {
      method: "GET",
      headers: {
        "X-API-KEY": process.env.TERMINAL_API_KEY!,
        "X-APP-ID": process.env.TERMINAL_APP_ID!,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(
      `Failed to get download URL: ${error.error || response.statusText}`
    );
  }

  return response.json();
};

/**
 * List all files in the storage
 * @returns Promise with array of file information
 */
export const listFiles = async (): Promise<FileListItem[]> => {
  const response = await fetch(`${process.env.TERMINAL_END_POINT}/files`, {
    method: "GET",
    headers: {
      "X-API-KEY": process.env.TERMINAL_API_KEY!,
      "X-APP-ID": process.env.TERMINAL_APP_ID!,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(
      `Failed to list files: ${error.error || response.statusText}`
    );
  }

  return response.json();
};

/**
 * Delete a file from storage
 * @param fileId File identifier
 * @returns Promise with success status
 */
export const deleteFile = async (
  fileId: string
): Promise<{ success: boolean }> => {
  const response = await fetch(
    `${process.env.TERMINAL_END_POINT}/files/${encodeURIComponent(fileId)}`,
    {
      method: "DELETE",
      headers: {
        "X-API-KEY": process.env.TERMINAL_API_KEY!,
        "X-APP-ID": process.env.TERMINAL_APP_ID!,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(
      `Failed to delete file: ${error.error || response.statusText}`
    );
  }

  return response.json();
};

/**
 * Get file metadata
 * @param fileId File identifier
 * @returns Promise with file metadata
 */
export const getFileMetadata = async (
  fileId: string
): Promise<FileMetadata> => {
  const response = await fetch(
    `${process.env.TERMINAL_END_POINT}/files/${encodeURIComponent(
      fileId
    )}/metadata`,
    {
      method: "GET",
      headers: {
        "X-API-KEY": process.env.TERMINAL_API_KEY!,
        "X-APP-ID": process.env.TERMINAL_APP_ID!,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    if (response.status === 404) {
      throw new Error("File not found");
    }
    throw new Error(
      `Failed to get file metadata: ${error.error || response.statusText}`
    );
  }

  return response.json();
};

/**
 * Check if a file exists
 * @param fileId File identifier
 * @returns Promise with boolean indicating if file exists
 */
export const fileExists = async (fileId: string): Promise<boolean> => {
  try {
    await getFileMetadata(fileId);
    return true;
  } catch (error) {
    if (error instanceof Error && error.message === "File not found") {
      return false;
    }
    throw error;
  }
};
