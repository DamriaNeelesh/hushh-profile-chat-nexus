
export interface PermissionGrant {
  id: string;
  grantorUserId: string;
  grantorName?: string;
  grantorEmail?: string;
  recipientUserId: string;
  recipientEmail?: string;
  recipientName?: string;
  scope: string[];
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface GrantPermissionRequest {
  recipientEmail: string;
  scope: string[];
  expiresAt: string | null;
}
