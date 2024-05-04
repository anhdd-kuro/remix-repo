-- CreateTable
CREATE TABLE "CustomerAppSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" TIMESTAMP,
    "accessToken" TEXT NOT NULL,
    "userId" BIGINT
);

CREATE TABLE "CustomerAppQrToken" (
    "token" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "expiredAt" TIMESTAMP NOT NULL
);
