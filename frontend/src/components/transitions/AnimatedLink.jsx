/**
 * AnimatedLink Component
 * ----------------------
 * A custom link component that adds a slight delay before navigation
 * to allow exit animations to complete.
 *
 * Exports:
 *   - AnimatedLink: A component that extends the default link behavior with animation capabilities.
 *
 * Props:
 *   - to: The destination path for navigation.
 *   - className: Additional CSS classes to apply to the link.
 *   - children: The content to display inside the link.
 *   - delay: Optional delay in milliseconds before navigation (default: 300ms).
 *
 * State:
 *   - isNavigating: Boolean indicating whether navigation is in progress.
 *
 * Functions:
 *   - handleClick(e): Prevents default link behavior, sets navigation state, and delays navigation.
 *
 * Layout:
 *   - Renders an anchor (`<a>`) element styled with dynamic classes.
 *   - Applies a `pointer-events-none` class and reduced opacity during navigation to prevent multiple clicks.
 *
 * Usage:
 *   - Used in `FormFooter` to provide smooth transitions between authentication pages.
 *   - This component is rendered in `App.jsx` as part of the `/login` and `/signup` routes.
 *
 * Example:
 *   - Rendered in `FormFooter.jsx`:
 *       <AnimatedLink to="/signup" className="text-white underline">
 *           Sign up
 *       </AnimatedLink>
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AnimatedLink = ({ to, className, children, delay = 300 }) => {
    const navigate = useNavigate();
    const [isNavigating, setIsNavigating] = useState(false);

    const handleClick = (e) => {
        e.preventDefault();

        if (isNavigating) return;

        setIsNavigating(true);

        // Delay navigation to allow exit animations to complete
        setTimeout(() => {
            navigate(to);
            setIsNavigating(false);
        }, delay);
    };

    return (
        <a
            href={to}
            onClick={handleClick}
            className={`${className} ${
                isNavigating ? "pointer-events-none opacity-70" : ""
            }`}
        >
            {children}
        </a>
    );
};

export default AnimatedLink;
