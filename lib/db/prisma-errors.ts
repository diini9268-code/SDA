export function isPrismaErrorCode(error: unknown, code: string): boolean {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === code,
  );
}

export function isUniqueConstraintError(error: unknown): boolean {
  return isPrismaErrorCode(error, "P2002");
}

export function isMissingRecordError(error: unknown): boolean {
  return isPrismaErrorCode(error, "P2025");
}
