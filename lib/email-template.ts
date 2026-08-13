import type { WeeklyPlan } from "@/lib/meal-plan";

export function renderWeeklyPlanEmail(plan: WeeklyPlan): string {
  const recipeRows = plan.recipes
    .map(
      (recipe) => `
        <tr>
          <td style="padding: 16px 0; border-bottom: 1px solid #d9d9d0;">
            <span style="display:inline-block; background:#D9A02A; color:#1F2A24; font-family:Consolas,Menlo,monospace; font-size:11px; text-transform:uppercase; letter-spacing:0.05em; padding:2px 8px; border-radius:999px;">
              ${escapeHtml(recipe.day)} &middot; ${escapeHtml(recipe.mealType)}
            </span>
            <h3 style="margin:8px 0 4px; font-family:Georgia,serif; font-size:18px; color:#1F2A24;">
              ${escapeHtml(recipe.title)}
            </h3>
            <p style="margin:0 0 6px; font-family:Arial,sans-serif; font-size:14px; color:#6B7268;">
              ${escapeHtml(recipe.description)}
            </p>
            <p style="margin:0; font-family:Consolas,Menlo,monospace; font-size:12px; color:#6B7268;">
              ${recipe.prepMinutes} min &middot; serves ${recipe.servings}
            </p>
            ${
              recipe.instructions.length > 0
                ? `<ol style="margin:10px 0 0; padding-left:18px; font-family:Arial,sans-serif; font-size:13px; color:#1F2A24;">
                    ${recipe.instructions.map((step) => `<li style="margin-bottom:3px;">${escapeHtml(step)}</li>`).join("")}
                  </ol>`
                : ""
            }
            ${
              recipe.sourceUrl
                ? `<p style="margin:6px 0 0;"><a href="${escapeAttr(recipe.sourceUrl)}" style="color:#C1432E; font-family:Arial,sans-serif; font-size:13px;">View recipe source</a></p>`
                : ""
            }
          </td>
        </tr>`,
    )
    .join("");

  const groceryByCategory = plan.groceryList.reduce<Record<string, typeof plan.groceryList>>(
    (acc, item) => {
      (acc[item.category] ??= []).push(item);
      return acc;
    },
    {},
  );

  const groceryHtml = Object.entries(groceryByCategory)
    .map(
      ([category, items]) => `
        <h4 style="margin:16px 0 4px; font-family:Arial,sans-serif; font-size:12px; text-transform:uppercase; letter-spacing:0.05em; color:#6B7268;">
          ${escapeHtml(category)}
        </h4>
        <ul style="margin:0; padding-left:18px; font-family:Arial,sans-serif; font-size:14px; color:#1F2A24;">
          ${items
            .map(
              (item) =>
                `<li>${escapeHtml(item.name)} — <span style="font-family:Consolas,Menlo,monospace; color:#6B7268;">${escapeHtml(item.quantity)}</span></li>`,
            )
            .join("")}
        </ul>`,
    )
    .join("");

  return `
    <div style="background:#EFF2E9; padding:32px 16px; font-family:Arial,sans-serif;">
      <table role="presentation" width="100%" style="max-width:560px; margin:0 auto; background:#ffffff; border-radius:16px; padding:24px;">
        <tr>
          <td>
            <h1 style="margin:0 0 4px; font-family:Georgia,serif; font-size:26px; color:#1F2A24;">Your week</h1>
            <p style="margin:0 0 16px; font-family:Arial,sans-serif; font-size:14px; color:#6B7268;">
              Here's this week's plan, built around your family's constraints.
            </p>
            <table role="presentation" width="100%">${recipeRows}</table>
            <h2 style="margin:24px 0 4px; font-family:Georgia,serif; font-size:20px; color:#1F2A24;">Grocery list</h2>
            ${groceryHtml}
          </td>
        </tr>
      </table>
    </div>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(value: string): string {
  return escapeHtml(value).replace(/"/g, "&quot;");
}
