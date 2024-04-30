const dayjs = require('dayjs');

class CalculateVacationDurationHandler {
    handle(startDate, endDate) {
        startDate = dayjs(startDate);
        endDate = dayjs(endDate);
        let days = endDate.diff(startDate, 'day');
        let workingDays = 0;

        for (let i = 0; i < days + 1; i++) {
            const day = startDate.get('day');
            const isWeekend = day === 0 || day === 6;

            if (!isWeekend) {
                workingDays++;
            }

            startDate = startDate.add(1, 'day');
        }

        return workingDays;
    }
}

module.exports = CalculateVacationDurationHandler;
