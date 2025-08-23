/**
 * PageTransition Component
 * ------------------------
 * Wraps page content with smooth animations for route transitions.
 *
 * Exports:
 *   - PageTransition: A component that applies animations to its children when pages change.
 *
 * Props:
 *   - children: The content to be animated during page transitions.
 *   - type: The type of page ('auth' or 'app') that determines animation style. Defaults to 'auth'.
 *
 * Animation Variants:
 *   - auth:
 *       - Initial: Page starts slightly transparent and shifted down.
 *       - Animate: Page fades in and moves to its normal position.
 *       - Exit: Page fades out and shifts up slightly.
 *   - app:
 *       - Initial: Page starts fully transparent.
 *       - Animate: Page fades in.
 *       - Exit: Page fades out.
 *
 * Layout:
 *   - Wraps its children in a `motion.div` with Framer Motion animations.
 *
 * Usage:
 *   - Used in `App.jsx` to wrap pages like `Login`, `SignUp`, and `Home` for smooth transitions.
 *
 * Example:
 *   - Rendered in `App.jsx`:
 *       <PageTransition type="auth">
 *           <Login />
 *       </PageTransition>
 */

// eslint-disable-next-line
import { motion } from "framer-motion";

const pageVariants = {
    auth: {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
    },
    app: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    },
};

const PageTransition = ({ children, type = "auth" }) => {
    const variant = pageVariants[type] || pageVariants.auth;

    return (
        <motion.div
            initial={variant.initial}
            animate={variant.animate}
            exit={variant.exit}
            transition={{
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
