/**
 * Input validation utilities for expense forms.
 */

export interface ValidationResult<T> {
  valid: boolean;
  value?: T;
  error?: string;
}

/**
 * Validate amount string. Returns number in base currency units (IDR).
 * Accepts integers and decimals with comma or dot separator.
 */
export function validateAmount(input: string): ValidationResult<number> {
  const trimmed = input.trim();
  if (!trimmed) {
    return { valid: false, error: "Amount is required" };
  }

  // Normalize decimal separator (comma -> dot)
  const normalized = trimmed.replace(/,/g, ".");
  const value = parseFloat(normalized);

  if (isNaN(value)) {
    return { valid: false, error: "Please enter a valid number" };
  }
  if (value <= 0) {
    return { valid: false, error: "Amount must be greater than 0" };
  }
  if (!isFinite(value)) {
    return { valid: false, error: "Amount is too large" };
  }

  // Round to integer (IDR base currency has no decimals)
  return { valid: true, value: Math.round(value) };
}

/**
 * Validate note string. Currently required per product spec.
 */
export function validateNote(input: string): ValidationResult<string> {
  const trimmed = input.trim();
  if (!trimmed) {
    return { valid: false, error: "Please enter a note" };
  }
  if (trimmed.length > 500) {
    return { valid: false, error: "Note must be 500 characters or less" };
  }
  return { valid: true, value: trimmed };
}

/**
 * Validate category name for create/edit.
 */
export function validateCategoryName(input: string): ValidationResult<string> {
  const trimmed = input.trim();
  if (!trimmed) {
    return { valid: false, error: "Category name is required" };
  }
  if (trimmed.length > 50) {
    return { valid: false, error: "Category name must be 50 characters or less" };
  }
  return { valid: true, value: trimmed };
}

/**
 * Validate hex color string (#RRGGBB or #RGB).
 */
export function validateColor(input: string): ValidationResult<string> {
  const trimmed = input.trim();
  if (!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(trimmed)) {
    return { valid: false, error: "Invalid color format (use #RRGGBB or #RGB)" };
  }
  return { valid: true, value: trimmed.toUpperCase() };
}