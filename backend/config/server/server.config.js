import path from "path";

export const createServerConfig = (__dirname) => {
    const PORT = process.env.PORT || 5000;
    const NODE_ENV = process.env.NODE_ENV || "development";
    const projectRoot = path.resolve(__dirname, "..");

    return { PORT, NODE_ENV, projectRoot };
};
