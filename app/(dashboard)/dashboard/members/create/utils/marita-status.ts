export const shouldShowChildrenField = (
  maritalStatus: string | null | undefined
): boolean => {
  return (
    maritalStatus !== "SINGLE" &&
    maritalStatus !== null &&
    maritalStatus !== undefined
  )
}
