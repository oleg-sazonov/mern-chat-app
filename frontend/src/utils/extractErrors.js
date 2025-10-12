export const extractErrors = (error) => {
    if (!error) return {};
    if (error.inner && error.inner.length > 0) {
        const mapped = {};
        error.inner.forEach((issue) => {
            if (issue.path && !mapped[issue.path]) {
                mapped[issue.path] = issue.message;
            }
        });
        return mapped;
    }
    if (error.path) {
        return { [error.path]: error.message };
    }
    return {};
};
