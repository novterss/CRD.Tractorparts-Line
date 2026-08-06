# User Flow - CRD Tractor Parts

This document explains the end-to-end user journey, from initial greeting to final sales closure.

## 1. Welcome Flow
- A user adds the bot or sends a message.
- The bot replies with a greeting and a **Quick Reply** menu containing 4 options:
  1. View Products (Flex Catalog)
  2. Order via Web (LIFF App)
  3. Consult Mechanic (AI)
  4. Contact Admin (Store Info)

## 2. E-Commerce & Checkout Flow
- The user clicks **"🌐 Order via Web"**.
- A full-screen LIFF App opens (Premium theme).
- The user clicks **"Checkout"**.
- The LIFF SDK sends the cart summary back to the LINE chat.
- **The system calculates the total and generates a Dynamic PromptPay QR Code**, sending it back for immediate payment.

## 3. Slip Verification & VIP CRM Flow
- The user **uploads a slip image** into the chat.
- The bot acknowledges receipt and **sends a Push Notification to the Admin**.
- The Admin can log in via two channels:
  - Channel 1: Type `/admin fatmonkey` in chat to approve directly in LINE.
  - Channel 2: Open the Web Admin Dashboard (PIN: `fatmonkey`) to view the slip and approve.
- Upon approval, **the user automatically earns VIP points (100 THB = 1 Point)**.
- The user can type `เช็คแต้ม` (Check Points) to view their BRONZE/SILVER/GOLD VIP card.

## 4. Smart Logistics Flow
- The Admin inputs a tracking number (e.g., KERRY-9999) in the Admin Dashboard.
- The system pushes a **Delivery Status** Flex Message to the user.
- The user clicks "Check Kerry Parcel", redirecting them instantly to the official KEX Express tracking page with their tracking number pre-filled.

## 5. AI Mechanic Consultation Flow
- The user types a question prefixed with **"ถาม"** (Ask).
- The bot relays the prompt to Gemini 1.5 Flash for analysis.
- The bot responds with professional, context-aware mechanical advice, acting as an expert tractor mechanic.
