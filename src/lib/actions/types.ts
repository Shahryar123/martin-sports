export type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

export function actionError(error: unknown, fallback = "Something went wrong."): ActionResult<never> {
  return { success: false, error: error instanceof Error ? error.message : fallback };
}
