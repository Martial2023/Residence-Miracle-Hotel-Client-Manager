-- AlterTable
ALTER TABLE "restaurant" ADD COLUMN     "geoLatitude" DOUBLE PRECISION,
ADD COLUMN     "geoLongitude" DOUBLE PRECISION,
ADD COLUMN     "sendReportsClock" TIMESTAMP(3);
