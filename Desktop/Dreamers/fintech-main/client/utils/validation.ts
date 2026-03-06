/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  isValid: boolean;
  strength: "weak" | "fair" | "good" | "strong";
  feedback: string[];
} {
  const feedback: string[] = [];
  let strength: "weak" | "fair" | "good" | "strong" = "weak";

  if (password.length < 8) {
    feedback.push("Password should be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    feedback.push("Add at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    feedback.push("Add at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    feedback.push("Add at least one number");
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    feedback.push("Add at least one special character");
  }

  // Determine strength
  const metCriteria = 5 - feedback.length;
  if (metCriteria === 5) strength = "strong";
  else if (metCriteria === 4) strength = "good";
  else if (metCriteria === 3) strength = "fair";
  else strength = "weak";

  return {
    isValid: feedback.length === 0,
    strength,
    feedback,
  };
}

/**
 * Validate amount input
 */
export function validateAmount(
  amount: string,
  minAmount: number = 100,
  maxAmount: number = 1000000
): {
  isValid: boolean;
  error?: string;
} {
  const num = parseFloat(amount);

  if (isNaN(num)) {
    return { isValid: false, error: "Please enter a valid amount" };
  }

  if (num < minAmount) {
    return { isValid: false, error: `Minimum amount is ${minAmount}` };
  }

  if (num > maxAmount) {
    return { isValid: false, error: `Maximum amount is ${maxAmount}` };
  }

  return { isValid: true };
}

/**
 * Validate phone number (basic validation)
 */
export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

/**
 * Validate bank account number (basic validation)
 */
export function validateBankAccount(accountNumber: string): boolean {
  const accountRegex = /^[0-9]{8,18}$/;
  return accountRegex.test(accountNumber);
}

/**
 * Validate UPI ID
 */
export function validateUPIId(upiId: string): boolean {
  const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/;
  return upiRegex.test(upiId);
}

/**
 * Validate required field
 */
export function validateRequired(value: string | null | undefined): boolean {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
}

/**
 * Check if withdrawal is allowed (1st to 5th of month)
 */
export function isWithdrawalAllowed(): boolean {
  const today = new Date();
  const dayOfMonth = today.getDate();
  return dayOfMonth >= 1 && dayOfMonth <= 5;
}

/**
 * Get days until next withdrawal window
 */
export function getDaysUntilWithdrawal(): number {
  const today = new Date();
  const dayOfMonth = today.getDate();

  if (dayOfMonth >= 1 && dayOfMonth <= 5) {
    return 0;
  }

  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.ceil((nextMonth.getTime() - today.getTime()) / msPerDay);
}
