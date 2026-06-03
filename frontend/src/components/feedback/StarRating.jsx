import React from "react";

/**
 * StarRating component — amber stars.
 * @param {number}   value       Current rating (1-5)
 * @param {function} onChange    Called with new rating (interactive mode)
 * @param {boolean}  readOnly    If true, renders static stars (no hover/click)
 * @param {string}   size        "sm" | "md" | "lg"
 */
export default function StarRating({ value = 0, onChange, readOnly = false, size = "md" }) {
	const [hovered, setHovered] = React.useState(0);

	const sizeClass =
		{
			sm: "w-4 h-4",
			md: "w-6 h-6",
			lg: "w-8 h-8",
		}[size] || "w-6 h-6";

	const display = !readOnly && hovered ? hovered : value;

	return (
		<div className='flex items-center gap-0.5' role={readOnly ? undefined : "radiogroup"} aria-label='Star rating'>
			{[1, 2, 3, 4, 5].map((star) => {
				const filled = star <= display;
				return (
					<button
						key={star}
						type='button'
						disabled={readOnly}
						onClick={() => !readOnly && onChange?.(star)}
						onMouseEnter={() => !readOnly && setHovered(star)}
						onMouseLeave={() => !readOnly && setHovered(0)}
						aria-label={`${star} star${star !== 1 ? "s" : ""}`}
						className={`border-0 bg-transparent p-0 transition-all duration-150 focus:outline-none ${
							readOnly ? "cursor-default" : "cursor-pointer hover:scale-110"
						}`}>
						<svg
							className={`${sizeClass} transition-colors duration-150 ${
								filled ? "text-amber-400 drop-shadow-sm" : "text-slate-200"
							}`}
							fill='currentColor'
							viewBox='0 0 24 24'>
							<path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
						</svg>
					</button>
				);
			})}
		</div>
	);
}
