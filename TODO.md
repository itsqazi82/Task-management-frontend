# TODO: Integrate Admin User Management APIs

## Steps to Complete
- [x] Update src/pages/Users.tsx: Add functionality for all admin user management APIs.
- [x] Implement GET /api/admin/users: Fetch all users (Managers and Users).
- [x] Implement POST /api/admin/create-user: Create a new user (Manager or Regular User).
- [x] Implement PUT /api/admin/assign-manager: Assign a manager to a user.
- [x] Implement PUT /api/admin/users/:id: Update a user.
- [x] Implement DELETE /api/admin/delete-user/:id: Delgete any user or manager by ID.

## Followup Steps
- [x] Updated User type to match API response structure with _id, managerId as object/string, assignedUsers, etc.
- [x] Modified fetchUsers to combine users and managers arrays, map _id to id for compatibility
- [x] Updated manager display logic to handle both object and string managerId types
- [x] Fixed AuthContext mock users to include _id field
- [x] Added conditional rendering for "Assign Manager" button - only show for users with role 'user', not for managers
- [x] Created AllTasks page for admin to view all tasks in the system using GET /api/admin/all-tasks
- [x] Updated Task type to include creatorId and assignedTo as objects/strings
- [x] Enhanced TaskCard to display creator and assigned user information
- [x] Added /all-tasks route to App.tsx with admin-only access
- [x] Updated sidebar navigation to include "All Tasks" link for admins
- [x] Created TeamTasks page for managers to view their team members and manage team tasks
- [x] Integrated GET /api/admin/my-team API to fetch team members for managers
- [x] Integrated POST /api/tasks/team-task API for creating team tasks
- [x] Updated TaskForm to support team member assignment
- [x] Added /team-tasks route to App.tsx with manager-only access
- [ ] Test the user management page as admin to ensure users can be created, assigned managers, updated, and deleted correctly.
- [ ] Test the All Tasks page to ensure it displays all tasks with creator and assigned user information.
- [ ] Test the Team Tasks page to ensure managers can view their team and create team tasks.
