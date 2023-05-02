# Job Posting App

#### Routes
- /login
- /register
- /forgot-password
- /admin/job-applications
- /admin/jobs
- /admin/jobs/create
- /admin/job-categories
- /admin/job-types
- /user/jobs

#### Project Details
There are 2 types of users in the app
1. Admin 
2. Candidate

Admin can perform the following actions
- Register, login, logout, and forgot-password
- Create job categories and job types
- Post a new job and view job posts created by him
- View job applications and approve or reject application
- Download the resume uploaded by the candidate

Candidate can perform the following actions
- Register, login, logout, and forgot-password
- View all job posts uploaded by admin
- Apply for job post and upload resume

#### Technologies Used
- Frontend: ReactJS, Tailwind CSS
- Backend: NodeJS, ExpressJS, Prisma (ORM)