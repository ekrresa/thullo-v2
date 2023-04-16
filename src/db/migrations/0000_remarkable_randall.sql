CREATE TABLE `accounts` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`userId` varchar(191) NOT NULL,
	`type` text NOT NULL,
	`provider` varchar(191) NOT NULL,
	`providerAccountId` varchar(191) NOT NULL,
	`refresh_token` text,
	`refresh_token_expires_in` int,
	`access_token` text,
	`expires_at` int,
	`token_type` text,
	`scope` text,
	`id_token` text,
	`session_state` text
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`sessionToken` varchar(191) NOT NULL,
	`userId` varchar(191) NOT NULL,
	`expires` timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`name` varchar(191),
	`email` varchar(191) NOT NULL,
	`emailVerified` timestamp,
	`username` varchar(100),
	`userType` enum('user','guest') NOT NULL DEFAULT 'user',
	`image` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `verificationToken` (
	`identifier` varchar(191) PRIMARY KEY NOT NULL,
	`token` varchar(191) NOT NULL,
	`expires` timestamp NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `accounts__provider__providerAccountId__idx` ON `accounts` (`provider`,`providerAccountId`);--> statement-breakpoint
CREATE INDEX `accounts__userId__idx` ON `accounts` (`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX `sessions__sessionToken__idx` ON `sessions` (`sessionToken`);--> statement-breakpoint
CREATE INDEX `session__userId__idx` ON `sessions` (`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX `email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `username_idx` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `vt__token__idx` ON `verificationToken` (`token`);