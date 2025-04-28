import { Request, Response, NextFunction } from "express";

type LogLevel = "error" | "warn" | "info" | "debug" | "success";

const colors = {
	reset: "\x1b[0m",
	error: "\x1b[31m", // red
	warn: "\x1b[33m", // yellow
	info: "\x1b[36m", // cyan
	debug: "\x1b[35m", // magenta
	success: "\x1b[32m", // green
	timestamp: "\x1b[90m", // gray
};

const log = (level: LogLevel, message: string, meta?: unknown): void => {
	const timestamp = new Date().toISOString();
	const coloredLevel = `${colors[level]}${level.toUpperCase().padEnd(7)}${
		colors.reset
	}`;
	const coloredTimestamp = `${colors.timestamp}${timestamp}${colors.reset}`;

	console.log(
		`${coloredTimestamp} ${coloredLevel} ${message}`,
		meta ? JSON.stringify(meta, null, 2) : ""
	);
};

export const logger = {
	error: (message: string, error?: Error | unknown) => {
		const meta =
			error instanceof Error
				? { message: error.message, stack: error.stack }
				: error;
		log("error", message, meta);
	},
	warn: (message: string, meta?: unknown) => log("warn", message, meta),
	info: (message: string, meta?: unknown) => log("info", message, meta),
	debug: (message: string, meta?: unknown) => log("debug", message, meta),
	success: (message: string, meta?: unknown) => log("success", message, meta),
};

export const requestLogger = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const start = Date.now();

	res.on("finish", () => {
		const duration = Date.now() - start;
		logger.info(`${req.method} ${req.originalUrl}`, {
			status: res.statusCode,
			duration: `${duration}ms`,
			ip: req.ip,
			userAgent: req.headers["user-agent"],
		});
	});

	next();
};

export const errorLogger = (
	error: Error,
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	logger.error("Request error", {
		path: req.path,
		method: req.method,
		error: error.message,
		stack: process.env.NODE_ENV !== "production" ? error.stack : undefined,
	});
	next(error);
};
