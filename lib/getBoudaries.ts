import { PeriodTypes } from "./types";
import { startOfDay, endOfDay, subDays } from 'date-fns';

export const getBoundaries = (period: PeriodTypes) => {
    const now = new Date();
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    switch (period) {
        case 'TODAY':
            startDate = startOfDay(now);
            endDate = endOfDay(now);
            break;
        case 'YESTERDAY':
            startDate = startOfDay(subDays(now, 1));
            endDate = endOfDay(subDays(now, 1));
            break;
        case 'LAST_7_DAYS':
            startDate = startOfDay(subDays(now, 7));
            endDate = endOfDay(now);
            break;
        case 'LAST_30_DAYS':
            startDate = startOfDay(subDays(now, 30));
            endDate = endOfDay(now);
            break;
        case 'LAST_90_DAYS':
            startDate = startOfDay(subDays(now, 90));
            endDate = endOfDay(now);
            break;
        case 'LAST_365_DAYS':
            startDate = startOfDay(subDays(now, 365));
            endDate = endOfDay(now);
            break;
        case 'ALL_TIME':
            startDate = undefined;
            endDate = undefined;
            break;
        default:
            throw new Error('Invalid period type');
    }

    return { startDate, endDate };
}