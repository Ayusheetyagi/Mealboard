import type { WeeklyRecipe } from "@/lib/meal-plan";
import { CARD_SURFACE, FOCUS_RING } from "@/lib/styles";

export function RecipeCard({ recipe }: { recipe: WeeklyRecipe }) {
  return (
    <div className={`flex flex-col gap-2 p-4 transition-shadow hover:shadow-[0_2px_4px_rgba(31,42,36,0.06),0_12px_28px_-8px_rgba(31,42,36,0.16)] ${CARD_SURFACE}`}>
      <span className="self-start rounded-full bg-turmeric px-2 py-0.5 font-mono text-xs uppercase tracking-wide text-ink">
        {recipe.mealType}
      </span>
      <h3 className="font-display text-lg text-ink">{recipe.title}</h3>
      <p className="text-sm text-muted">{recipe.description}</p>
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted">
        <span>{recipe.prepMinutes} min</span>
        <span>·</span>
        <span>serves {recipe.servings}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {recipe.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-background px-2 py-0.5 font-mono text-xs text-ink">
            {tag}
          </span>
        ))}
      </div>
      {recipe.instructions.length > 0 && (
        <details className="group">
          <summary
            className={`cursor-pointer text-xs font-medium text-tomato ${FOCUS_RING} rounded`}
          >
            <span className="group-open:hidden">Show steps</span>
            <span className="hidden group-open:inline">Hide steps</span>
          </summary>
          <ol className="mt-2 flex list-decimal flex-col gap-1.5 pl-4 text-sm text-ink">
            {recipe.instructions.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </details>
      )}
      {recipe.sourceUrl && (
        <a
          href={recipe.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-xs text-tomato underline underline-offset-2 ${FOCUS_RING}`}
        >
          View recipe source
        </a>
      )}
    </div>
  );
}
