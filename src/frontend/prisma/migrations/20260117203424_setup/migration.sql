-- CreateTable
CREATE TABLE "markers" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "markers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_markers" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "markerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sub_markers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notes" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "subMarkerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "markers_userId_idx" ON "markers"("userId");

-- CreateIndex
CREATE INDEX "sub_markers_markerId_idx" ON "sub_markers"("markerId");

-- CreateIndex
CREATE INDEX "notes_subMarkerId_idx" ON "notes"("subMarkerId");

-- CreateIndex
CREATE INDEX "notes_createdAt_idx" ON "notes"("createdAt");

-- AddForeignKey
ALTER TABLE "sub_markers" ADD CONSTRAINT "sub_markers_markerId_fkey" FOREIGN KEY ("markerId") REFERENCES "markers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_subMarkerId_fkey" FOREIGN KEY ("subMarkerId") REFERENCES "sub_markers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
