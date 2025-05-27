
import React, { createContext, useContext, useReducer, useCallback } from "react";
import { GrantPermissionRequest, PermissionGrant } from "../types/permissions";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

//MOCK DATABASE FOR GRANTS
let mockGrantsDatabase: PermissionGrant[] = [
  {
    id: "grant-123",
    grantorUserId: "user-123",
    recipientUserId: "user-456",
    recipientEmail: "colleague@example.com",
    recipientName: "Work Colleague",
    scope: ["Access Financial Insights", "Access Receipt Information"],
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "grant-124",
    grantorUserId: "user-123",
    recipientUserId: "user-789",
    recipientEmail: "friend@example.com",
    recipientName: "Close Friend",
    scope: ["Access Receipt Information"],
    expiresAt: null, // Never expires
    isActive: true,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
  },
];

let mockReceivedGrantsDatabase: PermissionGrant[] = [
  {
    id: "grant-987",
    grantorUserId: "user-555",
    grantorName: "Jane Smith",
    grantorEmail: "jane@example.com",
    recipientUserId: "user-123",
    scope: ["Access Financial Insights", "Access Health Information"],
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    isActive: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: "grant-654",
    grantorUserId: "user-777",
    grantorName: "Mike Johnson",
    grantorEmail: "mike@example.com",
    recipientUserId: "user-123",
    scope: ["Access Receipt Information"],
    expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
    isActive: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
];


interface PermissionsState {
  grantsIssued: PermissionGrant[];
  grantsReceived: PermissionGrant[];
  isLoading: boolean;
  error: string | null;
}

type PermissionsAction =
  | { type: "FETCH_GRANTS_START" }
  | { type: "FETCH_GRANTS_SUCCESS"; payload: { issued: PermissionGrant[], received: PermissionGrant[] } }
  | { type: "FETCH_GRANTS_FAILURE"; payload: string }
  | { type: "GRANT_PERMISSION_START" }
  | { type: "GRANT_PERMISSION_SUCCESS"; payload: PermissionGrant }
  | { type: "GRANT_PERMISSION_FAILURE"; payload: string }
  | { type: "REVOKE_PERMISSION_START"; payload: string }
  | { type: "REVOKE_PERMISSION_SUCCESS"; payload: string }
  | { type: "REVOKE_PERMISSION_FAILURE"; payload: { error: string; grantId: string } };

interface PermissionsContextType {
  state: PermissionsState;
  fetchGrants: () => Promise<void>;
  grantPermission: (request: GrantPermissionRequest) => Promise<void>;
  revokePermission: (grantId: string) => Promise<void>;
}

const initialState: PermissionsState = {
  grantsIssued: [],
  grantsReceived: [],
  isLoading: false,
  error: null,
};

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

const permissionsReducer = (state: PermissionsState, action: PermissionsAction): PermissionsState => {
  switch (action.type) {
    case "FETCH_GRANTS_START":
    case "GRANT_PERMISSION_START":
      return { ...state, isLoading: true, error: null };
    case "FETCH_GRANTS_SUCCESS":
      return {
        ...state,
        grantsIssued: action.payload.issued,
        grantsReceived: action.payload.received,
        isLoading: false,
        error: null,
      };
    case "GRANT_PERMISSION_SUCCESS":
      return {
        ...state,
        grantsIssued: [...state.grantsIssued, action.payload],
        isLoading: false,
        error: null,
      };
    case "REVOKE_PERMISSION_START":
      return { ...state, isLoading: true, error: null };
    case "REVOKE_PERMISSION_SUCCESS":
      return {
        ...state,
        grantsIssued: state.grantsIssued.map(grant => 
          grant.id === action.payload ? { ...grant, isActive: false } : grant
        ),
        isLoading: false,
        error: null,
      };
    case "FETCH_GRANTS_FAILURE":
    case "GRANT_PERMISSION_FAILURE":
      return { ...state, isLoading: false, error: action.payload };
    case "REVOKE_PERMISSION_FAILURE":
      return { ...state, isLoading: false, error: action.payload.error };
    default:
      return state;
  }
};

export const PermissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(permissionsReducer, initialState);
  const { toast } = useToast();

  const fetchGrants = useCallback(async () => {
    dispatch({ type: "FETCH_GRANTS_START" });
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      dispatch({
        type: "FETCH_GRANTS_SUCCESS",
        payload: {
          issued: mockGrantsDatabase.filter(g => g.grantorUserId === "user-123"), // Simulate fetching only current user's issued grants
          received: mockReceivedGrantsDatabase.filter(g => g.recipientUserId === "user-123") // Simulate fetching only current user's received grants
        },
      });
    } catch (error) {
      dispatch({ type: "FETCH_GRANTS_FAILURE", payload: "Failed to fetch permissions" });
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch permissions. Please try again.",
      });
    }
  }, []);

  const grantPermission =  useCallback(async (request: GrantPermissionRequest) => {
    dispatch({ type: "GRANT_PERMISSION_START" });
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful grant
      const newGrant: PermissionGrant = {
        id: uuidv4(),
        grantorUserId: "user-123", // Current user
        recipientUserId: `user-${Math.floor(Math.random() * 1000)}`,
        recipientEmail: request.recipientEmail,
        recipientName: request.recipientEmail.split('@')[0], // Mock name from email
        scope: request.scope,
        expiresAt: request.expiresAt,
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      mockGrantsDatabase.push(newGrant);
      dispatch({ type: "GRANT_PERMISSION_SUCCESS", payload: newGrant });
      toast({
        title: "Permission Granted",
        description: `Profile access granted to ${request.recipientEmail}`,
      });
    } catch (error) {
      dispatch({ type: "GRANT_PERMISSION_FAILURE", payload: "Failed to grant permission" });
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to grant permission. Please check the email and try again.",
      });
    }
  },[]);

  const revokePermission = async (grantId: string) => {
    dispatch({ type: "REVOKE_PERMISSION_START", payload: grantId });
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));

      mockGrantsDatabase = mockGrantsDatabase.map(grant =>
        grant.id === grantId ? { ...grant, isActive: false } : grant
      );

      dispatch({ type: "REVOKE_PERMISSION_SUCCESS", payload: grantId });
      toast({
        title: "Permission Revoked",
        description: "Profile access has been revoked successfully.",
      });
    } catch (error) {
      dispatch({
        type: "REVOKE_PERMISSION_FAILURE",
        payload: { error: "Failed to revoke permission", grantId },
      });
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to revoke permission. Please try again.",
      });
    }
  };

  return (
    <PermissionsContext.Provider value={{ state, fetchGrants, grantPermission, revokePermission }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
};


