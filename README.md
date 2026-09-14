# Agreement Hub - Consolidated v1

This package consolidates the working Agreement Hub CRM into complete replacement files.

## Included
- Firebase Email/Password Login
- Protected Dashboard
- New/Edit/Delete/View Agreements
- Fresh New Agreement from both Dashboard buttons
- Default Agreement Period from Settings: 11 / 22 / 33 months
- Automatic End Date calculation
- Clients module
- Business Profile save/load
- Agreement Settings save/load
- Change Password + Logout
- Total Service Charges dashboard card (rent/deposit are NOT revenue)
- Admin-only Agreement Charges, My Service Charge, Brokerage
- Client-safe Preview/PDF: internal charges are excluded

## Important: Stamp Duty / Registration Fee
The fields are included, but government-fee auto-calculation is NOT hard-coded in this version.
This is intentional. Use the official IGR Maharashtra calculator/rules until the exact current formula is verified and tested.
Do not rely on an estimated formula for payment/registration.

## Replace safely
1. Backup your current project:
   git add .
   git commit -m "Backup before consolidated v1"

2. Copy the contents of this folder into:
   C:\Users\ASUS\Desktop\AgreementHub

3. Keep any extra assets/images you already have.

4. Firestore Rules:
   firebase.cmd deploy --only firestore:rules

5. Hosting:
   firebase.cmd deploy --only hosting

6. Hard refresh:
   Ctrl + F5

## Test order
1. Login
2. Settings -> save Business Profile
3. Settings -> Default Agreement Period = 11
4. New Agreement -> verify 11 Months + End Date
5. Add My Service Charge = 1000 -> Save
6. Dashboard -> Total Service Charges should increase
7. View Agreement -> internal charges must NOT appear
8. Generate Client PDF -> internal charges must NOT appear

## Security note
Current rules are suitable for the present admin CRM stage only: any authenticated Firebase user can access the admin collections.
Before launching a separate Client Login, implement role-based Firestore rules so clients can read only their own agreement/documents.
