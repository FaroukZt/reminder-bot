export function validateTaskName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'اسم المهمة مطلوب' };
  }
  if (name.length > 100) {
    return { valid: false, error: 'اسم المهمة طويل جداً (أقصى 100 حرف)' };
  }
  return { valid: true };
}

export function validateDuration(duration: number): { valid: boolean; error?: string } {
  if (duration <= 0) {
    return { valid: false, error: 'المدة يجب أن تكون أكبر من 0' };
  }
  if (duration > 10000) {
    return { valid: false, error: 'المدة كبيرة جداً' };
  }
  return { valid: true };
}
