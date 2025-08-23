/**
 * FormFooter Component
 * -------------------
 * Reusable footer for authentication forms with a link to another page.
 *
 * Exports:
 *   - FormFooter: A component that displays a footer with text and a link.
 *
 * Props:
 *   - text: The main text content to display in the footer.
 *   - linkText: The text for the clickable link.
 *   - linkHref: The URL or path for the link.
 *
 * Layout:
 *   - Wrapper: A styled container for the footer.
 *   - Text: Displays the main text content.
 *   - Link: A clickable link styled with hover effects.
 *
 * Usage:
 *   - Used in authentication forms like `Login` and `SignUp` to display navigation links.
 *
 * Example:
 *   - Rendered in `SignUp.jsx`:
 *       <FormFooter
 *           text="Already have an account?"
 *           linkText="Login"
 *           linkHref="/login"
 *       />
 *
 *   - Rendered in `Login.jsx`:
 *       <FormFooter
 *           text="Don't have an account?"
 *           linkText="Sign up"
 *           linkHref="/signup"
 *       />
 */

import { getFooterClass } from "../../styles/AuthStyles";

const FormFooter = ({ text, linkText, linkHref }) => {
    return (
        <div className={getFooterClass()}>
            <span className="text-white/70 text-sm">
                {text}{" "}
                <a
                    href={linkHref}
                    className="text-white hover:text-white/80 underline font-medium"
                >
                    {linkText}
                </a>
            </span>
        </div>
    );
};

export default FormFooter;
