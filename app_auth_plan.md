# User Profile & Authentication Display

This plan details how to replace hardcoded user profiles with dynamic data fetched from the backend.

## User Review Required
> [!IMPORTANT]
> To display real user names, the dashboard will now perform a lightweight fetch to `/api/auth/me` on load. This ensures the name matches the account you just created.

## Proposed Changes

### Authentication Context
- **[NEW] [AuthContext.tsx](file:///d:/Humber%20IGS/Semester%204/Web%20Programming%20And%20Framework%202/FinalProject/loadflow/context/AuthContext.tsx)**: 
  - Create a React Context that fetches the user's profile from `/api/auth/me`.
  - Provide `user`, `isLoading`, and `logout` functionality to all dashboard children.

### Component Integration
- **[MODIFY] [layout.tsx](file:///d:/Humber%20IGS/Semester%204/Web%20Programming%20And%20Framework%202/FinalProject/loadflow/app/dashboard/layout.tsx)**:
  - Wrap the dashboard content in the `AuthProvider`.
  - Replace hardcoded "Marcus Webb" in the header with a client-side component that reads from `AuthContext`.
- **[MODIFY] [Sidebar.tsx](file:///d:/Humber%20IGS/Semester%204/Web%20Programming%20And%20Framework%202/FinalProject/loadflow/components/Sidebar.tsx)**:
  - Use `useAuth()` hook to display the real user's name and email in the sidebar footer.
  - Fix the logout link to trigger the `logout` function from context.

## Verification Plan
1. **Login Test**: Register a new user with a unique name (e.g., "John Smith"), log in, and verify that "John Smith" appears in both the top header and the sidebar footer.
2. **Persistence Check**: Refresh the dashboard and ensure the user's name remains visible (doesn't flicker back to placeholders).
3. **Logout Test**: Click the sign-out link and verify that you are redirected to the landing page and the `token` cookie is cleared.
