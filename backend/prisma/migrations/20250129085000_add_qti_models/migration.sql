/*
  Warnings:

  - You are about to drop the `QtiAssessmentItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QtiAssessmentTest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QtiCurriculum` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QtiSection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SectionItems` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "QtiSection" DROP CONSTRAINT "QtiSection_testId_fkey";

-- DropForeignKey
ALTER TABLE "_SectionItems" DROP CONSTRAINT "_SectionItems_A_fkey";

-- DropForeignKey
ALTER TABLE "_SectionItems" DROP CONSTRAINT "_SectionItems_B_fkey";

-- DropTable
DROP TABLE "QtiAssessmentItem";

-- DropTable
DROP TABLE "QtiAssessmentTest";

-- DropTable
DROP TABLE "QtiCurriculum";

-- DropTable
DROP TABLE "QtiSection";

-- DropTable
DROP TABLE "_SectionItems";

-- CreateTable
CREATE TABLE "qti_assessments" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "toolName" TEXT NOT NULL DEFAULT 'EduAssess QTI Editor',
    "toolVersion" TEXT NOT NULL DEFAULT '1.0',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "qti_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qti_test_parts" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "navigationMode" TEXT NOT NULL DEFAULT 'linear',
    "submissionMode" TEXT NOT NULL DEFAULT 'individual',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "assessmentId" TEXT NOT NULL,

    CONSTRAINT "qti_test_parts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qti_assessment_sections" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "testPartId" TEXT NOT NULL,

    CONSTRAINT "qti_assessment_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qti_assessment_items" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "adaptive" BOOLEAN NOT NULL DEFAULT false,
    "timeDependent" BOOLEAN NOT NULL DEFAULT false,
    "interactionType" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "correctResponse" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sectionId" TEXT NOT NULL,

    CONSTRAINT "qti_assessment_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "qti_assessments_identifier_key" ON "qti_assessments"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "qti_test_parts_identifier_assessmentId_key" ON "qti_test_parts"("identifier", "assessmentId");

-- CreateIndex
CREATE UNIQUE INDEX "qti_assessment_sections_identifier_testPartId_key" ON "qti_assessment_sections"("identifier", "testPartId");

-- CreateIndex
CREATE UNIQUE INDEX "qti_assessment_items_identifier_sectionId_key" ON "qti_assessment_items"("identifier", "sectionId");

-- AddForeignKey
ALTER TABLE "qti_assessments" ADD CONSTRAINT "qti_assessments_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qti_test_parts" ADD CONSTRAINT "qti_test_parts_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "qti_assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qti_assessment_sections" ADD CONSTRAINT "qti_assessment_sections_testPartId_fkey" FOREIGN KEY ("testPartId") REFERENCES "qti_test_parts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qti_assessment_items" ADD CONSTRAINT "qti_assessment_items_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "qti_assessment_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
