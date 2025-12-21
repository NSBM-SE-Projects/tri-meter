# Tri-Meter (Team) - Environment Setup Guide 

**Complete this setup before kickoff meeting!**

## Required Software

### 1. Node.js & npm
**For:** Backend and frontend development        
**Version:** 20.x or higher

**Installation:**

- **Mac:** `brew install node` (**needs brew**) OR download from [Node.js](https://nodejs.org)
- **Windows:** Download installer from [Node.js](https://nodejs.org)

**Verify:**
```bash
node --version # Should show v20.x or higher
npm --version  # Should show 10.x or higher
```

### 2. Git
**For:** Version control

**Installation:**
- **Mac:** `brew install git` OR download from [Git](https://git-scm.com)
- **Windows:** Download Git for Windows from [Git](https://git-scm.com) 

**Verify:**
```bash
git --version  # Should show git version 2.3.x or higher
```

**Configure Git:**
```bash
git config --global user.name "Your Name"               # Exactly as on GitHub
git config --global user.email "your.email@example.com"
```

### 3. MS SQL Server Management Studio (Windows) or Azure Data Studio (Mac)
**For:** Database management and development

**Installation:**
- **Windows:** Download from [SSMS](https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms)
- **Mac:** Download from [Azure Data Studio](https://learn.microsoft.com/en-us/azure-data-studio/download-azure-data-studio)      

**Note:** We're using Azure SQL Database (cloud)

---

### 4. VS Code
**For:** Code editor

**Installation:**
- Download from [Visual Studio Code](https://code.visualstudio.com)

**Recommended Extensions:**
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- SQL Server (mssql)
- Prettier - Code formatter
- GitLens

## Project Setup

### Step 1 ---> Clone repository
```bash
git clone [REPOSITORY_URL]
cd "tri-meter"
```

### Step 2 ---> Verify project structure
You should see these folders:
```
documentation/
database/
backend/
frontend/
design/
presentation/
```

## Azure SQL Database Setup

**Contact [@dwainXDL](https://github.com/dwainXDL) for DB ENV Variables files and Claude Context Files**

**Connect via SSMS/Azure Data Studio:**
1. Open SSMS or Azure Data Studio
2. Connect to server:
   - Connection type: **Microsoft SQL Server**
   - Server name: `[server-name].database.windows.net`
   - Authentication: **SQL Server Authentication**
   - Login: `[provided username]`
   - Password: `[provided password]`
   - Encrypt: **Strict**
   - Trust server certificate: **True**
3. Should show a green check mark next to Tri-Meter DB

## Backend Setup

```bash
cd backend
npm install
```

**Run backend:**
```bash
npm run dev
```

Should see: `Server running on PORT 5000`

---

## Frontend Setup

```bash
cd frontend
npm install
```

**Run frontend:**
```bash
npm run dev
```

Should see: `Local Server: http://localhost:****`

## Common Issues & Fixes

### Issue: "node: command not found"
- **Fix:** Node.js not in PATH. Restart terminal or reinstall Node.js

### Issue: "Port 5000 already in use"
- **Fix:** Change PORT in backend `.env` file to 5001 or kill process using port

## Tests & API References (README)

Coming soon

## Git Commands

1. When you're starting a task in the project folder

```bash
# Create a new personal branch
git checkout -b dwain/feature/login
```

2. Once you're done for the day, with a task or done with some part execute these commands

```bash
# Check status/files that have changed
git status

# If you're not in your personal feature branch*
git checkout dwain/feature/login

# Stage 
git add .

# Commit
git commit -m "Added login feature"

# Pull latest changes
git pull

# Push to your branch (1st time)
git push -u origin dwain/feature/login

# Push to your branch
git push origin dwain/feature/login
```

**Create a pull request (PR):**.     
1. Open GitHub
2. Create PR: feature/login -> dev
3. Assign reviewers
4. Assign yourself as assignees
5. Labels as appropriate
6. Solve merge conflicts
7. Squash and merge
8. Wait for pull request to be approved!

Note: **Use your own names/messages!**

## Getting Help

**Stuck?** Post in WhatsApp/Discord group with:
1. What you're trying to do
2. What error you're seeing
3. Screenshot of error (if applicable)

## Next Steps
Check the **Team Notion and Discord** for updates

---

**Questions?** Ask in the group! Don't struggle alone.
