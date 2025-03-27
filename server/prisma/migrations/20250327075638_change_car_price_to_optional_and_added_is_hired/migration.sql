-- AlterTable
ALTER TABLE `car` ADD COLUMN `isHired` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `pricePerDay` DOUBLE NULL,
    MODIFY `pricePerMonth` DOUBLE NULL,
    MODIFY `pricePer3Months` DOUBLE NULL,
    MODIFY `pricePer6Months` DOUBLE NULL,
    MODIFY `pricePerYear` DOUBLE NULL,
    MODIFY `mileage` DOUBLE NULL;
