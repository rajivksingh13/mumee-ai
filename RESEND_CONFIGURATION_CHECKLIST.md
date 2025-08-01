# Resend Configuration Issues Checklist

## Potential Configuration Issues Causing Email Bouncing

### 1. **Domain Verification Issues** ⚠️ **MOST LIKELY CAUSE**

**Problem**: Custom domain `hello@teachlea.com` not properly verified in Resend.

**Check Steps**:
1. Go to [Resend Domains](https://resend.com/domains)
2. Check if `teachlea.com` is listed
3. Verify status shows "Verified" (not "Pending" or "Failed")
4. If not verified, follow the verification process

**Fix**:
- Add required DNS records (SPF, DKIM, DMARC)
- Wait for verification to complete (can take 24-48 hours)
- Contact Resend support if verification fails

### 2. **DNS Records Missing or Incorrect**

**Required DNS Records**:
```
SPF Record:
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all

DKIM Record:
Type: TXT
Name: resend._domainkey
Value: (provided by Resend during domain setup)

DMARC Record:
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@teachlea.com
```

**Check Steps**:
1. Use DNS lookup tools (nslookup, dig, or online tools)
2. Verify all records exist and are correct
3. Allow 24-48 hours for DNS propagation

### 3. **Account Status and Limits**

**Check Steps**:
1. Go to [Resend Account](https://resend.com/account)
2. Verify account is active (not suspended)
3. Check sending limits and current usage
4. Ensure no restrictions are in place

**Common Issues**:
- Account suspended due to abuse
- Exceeded sending limits
- Payment issues

### 4. **API Key Issues**

**Check Steps**:
1. Verify `RESEND_API_KEY` environment variable is set
2. Ensure API key is valid and active
3. Check API key permissions

**Test Command**:
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" https://api.resend.com/domains
```

### 5. **Email Provider Blocking**

**Yahoo-Specific Issues**:
- Yahoo has stricter requirements than Gmail
- May block emails from unverified domains
- May require specific authentication

**Check Steps**:
1. Test with Gmail (should work)
2. Test with different Yahoo accounts
3. Check Yahoo's sender guidelines

### 6. **Email Content Issues**

**Spam Trigger Words**:
- Avoid words like "FREE", "URGENT", "ACT NOW"
- Use proper HTML structure
- Include unsubscribe link

**Check Steps**:
1. Review email content for spam triggers
2. Test with plain text emails
3. Use email testing tools

### 7. **Sending Frequency and Volume**

**Issues**:
- Sending too many emails quickly
- High bounce rates
- Low engagement rates

**Check Steps**:
1. Monitor sending frequency
2. Check bounce rates in Resend dashboard
3. Implement proper rate limiting

## Quick Diagnostic Steps

### Step 1: Check Resend Dashboard
```bash
# Run configuration check
node scripts/check-resend-config.js
```

### Step 2: Test with Different Providers
```bash
# Test Gmail (should work)
curl -X POST http://localhost:3000/api/email/test-send \
  -H "Content-Type: application/json" \
  -d '{"email": "test@gmail.com"}'

# Test Yahoo (problematic)
curl -X POST http://localhost:3000/api/email/test-send \
  -H "Content-Type: application/json" \
  -d '{"email": "rajiv.kumar0213@yahoo.com"}'
```

### Step 3: Check Server Logs
Look for these patterns:
```
✅ Email sent successfully with custom domain: email_id
❌ Resend API Error with custom domain: domain not verified
```

### Step 4: Check Resend Activity
1. Go to [Resend Activity](https://resend.com/activity)
2. Look for your test emails
3. Check delivery status and bounce reasons

## Most Likely Solutions

### If Domain Not Verified:
1. **Use verified domains temporarily**:
   - `onboarding@resend.dev`
   - `hello@resend.dev`
   - `noreply@resend.dev`

2. **Fix domain verification**:
   - Add required DNS records
   - Wait for verification
   - Contact Resend support

### If DNS Records Missing:
1. **Add required DNS records**:
   - SPF record
   - DKIM record
   - DMARC record

2. **Wait for propagation**:
   - DNS changes can take 24-48 hours
   - Use DNS checking tools to verify

### If Account Issues:
1. **Check account status**:
   - Verify account is active
   - Check sending limits
   - Resolve any payment issues

2. **Contact Resend support**:
   - For account suspensions
   - For verification issues
   - For technical problems

## Recommended Action Plan

### 1. **Immediate (Before Code Changes)**:
```bash
# Check current configuration
node scripts/check-resend-config.js

# Test with verified domains manually
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "titliAI <onboarding@resend.dev>",
    "to": ["rajiv.kumar0213@yahoo.com"],
    "subject": "Test Email",
    "html": "<h1>Test</h1>"
  }'
```

### 2. **If Manual Test Works**:
- Apply the code changes to use verified domains automatically
- This will fix the Yahoo bouncing issue

### 3. **If Manual Test Fails**:
- Check Resend account status
- Verify API key is correct
- Contact Resend support

### 4. **Long-term Fix**:
- Properly verify your custom domain
- Add all required DNS records
- Wait for verification to complete

## Expected Results

### **If Configuration is Correct**:
- Gmail emails should work
- Yahoo emails should work with verified domains
- No bouncing at Resend level

### **If Configuration has Issues**:
- Gmail might work (more forgiving)
- Yahoo will bounce (stricter requirements)
- Need to fix domain verification or use verified domains

## Next Steps

1. **Run the configuration check**: `node scripts/check-resend-config.js`
2. **Test manually with verified domains**
3. **Fix any configuration issues identified**
4. **If issues persist, apply the code changes**
5. **Monitor Resend dashboard for delivery status**

This systematic approach will help identify the root cause before making code changes. 